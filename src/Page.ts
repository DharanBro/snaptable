import jsPDF from "jspdf";
import pixelWidth from "string-pixel-width";
import Colors from './enum/colors';
import { ICurrentPageInfo } from "./TableSnap";
export default class Page {
    private rowHeight: number = 15;
    private columnWidth: number[];
    private header: string[];
    private rows: IRow[];
    private doc: jsPDF;
    private pageWidth: number;
    private pageHeight: number;
    configuration: IPageConfiguration = {
        pageNumber: {
            enabled: false,
            hPosition: 'RIGHT',
            vPosition: 'BOTTOM',
        },
        margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        }
    };

    constructor(doc: jsPDF, header?: string[], configuration?: IPageConfiguration) {
        this.columnWidth = [];
        this.rows = [];
        this.doc = doc;
        this.header = header || [];
        const currentPageInfo: ICurrentPageInfo = this.doc.internal.getCurrentPageInfo();
        this.pageWidth = currentPageInfo.pageContext.mediaBox.topRightX / 1.33;
        this.pageHeight = currentPageInfo.pageContext.mediaBox.topRightY / 1.33;
    }

    setHeaders(header: string[]) {
        this.header = header;
    }

    private updateColumnWidth(cellContent: string, columnIndex: number) {
        const width: number = pixelWidth(cellContent, { size: 10 }) / 1.33;
        if (this.columnWidth[columnIndex] !== undefined) {
            if (width > this.columnWidth[columnIndex]) {
                this.columnWidth[columnIndex] = width;
            }
        }
        else {
            this.columnWidth[columnIndex] = width;
        }
    }

    private getColumnPositions() {
        const { left: leftMargin } = this.configuration.margin;
        let start = leftMargin;
        return this.columnWidth.map(width => {
            let position = start;
            start += width + 10;
            return position + 2;
        });
    }

    private shouldSplitColumns(columnPosition: number[]) {
        for (let i = 0; i < columnPosition.length; i++) {
            if (columnPosition[i] + this.columnWidth[i] > this.pageWidth) {
                return true;
            }
        }
        return false;
    }

    private getColumnSplittedPages() {
        const { left: leftMargin, right: rightMargin, } = this.configuration.margin;
        const columnPosition = this.getColumnPositions();
        const pages: Page[] = [];

        const page: Page = new Page(this.doc);
        pages.push(page);

        // const createRow = (row: IRow) => {
        //     const newRow: IRow = {
        //         columns: [row.columns[0]],
        //         isHeader: false,
        //         rowHeight: 15,
        //     };
        //     return newRow;
        // }
        for (let i = 0; i < this.rows.length; i++) {
            let pageIndex = 0;
            let row: string[] = [this.rows[i].columns[0].text];
            let header: string[] = [this.header[0]];
            const firstCellWidth = this.columnWidth[0];
            let columnPos = columnPosition[0] + this.columnWidth[0] + leftMargin;
            for (let j = 1; j < columnPosition.length; j++) {
                const availableWidth = this.pageWidth - firstCellWidth - leftMargin - rightMargin;
                if (columnPos + this.columnWidth[j] > availableWidth) {
                    pages[pageIndex].addRow(row);
                    pages[pageIndex].setHeaders(header);

                    // Create new page and reset the row
                    pageIndex++;
                    if (!pages[pageIndex]) {
                        const page = new Page(this.doc);
                        pages[pageIndex] = page;
                    }
                    columnPos = firstCellWidth;
                    row = [this.rows[i].columns[0].text];
                    header = [this.header[0]];
                    // row = createRow(this.rows[i]);
                }
                columnPos += this.columnWidth[j];
                header.push(this.header[j]);
                row.push(this.rows[i].columns[j].text)
                // row.columns.push(this.rows[i].columns[j]);


            }
            pages[pageIndex].addRow(row);
            pages[pageIndex].setHeaders(header);
            // const row = 
            // const rowHeader: ICell = {
            //     background: Colors.WHITE,
            //     color: Colors.DARK_GREY,
            //     text:
            // };
        }
        return pages;
    }


    writeToPdf() {
        const columnPosition = this.getColumnPositions();
        if (this.shouldSplitColumns(columnPosition)) {
            const pages = this.getColumnSplittedPages();

            for (let i = 0; i < pages.length; i++) {
                pages[i].writeToPdf();
            }
            return;
        }
        this.doc.addPage();
        this.doc.setFontSize(10);
        const { left: leftMargin, right: rightMargin, top: topMargin, } = this.configuration.margin;

        const drawRowRect = (y: number, style: string = 'S') => {
            this.doc.rect(leftMargin, y, this.pageWidth - leftMargin - rightMargin, this.rowHeight, style);
        }

        // Print Header
        let y = topMargin;
        this.doc.setFillColor(Colors.STEEL_BLUE);
        this.doc.setDrawColor(Colors.STEEL_BLUE);
        this.doc.setTextColor(Colors.WHITE);

        drawRowRect(y, 'FD');
        for (let i = 0; i < this.header.length; i++) {
            const x = columnPosition[i];
            let column = this.header[i];
            console.log(column);
            this.doc.text(column, x, y + (15 / 2), {
                lineHeightFactor: 0,
                baseline: "middle",
            });
        }

        // Print rows
        this.doc.setFillColor(Colors.WHITE);
        this.doc.setDrawColor(Colors.DARK_GREY);
        this.doc.setTextColor(Colors.DARK_GREY);
        for (let j = 0; j < this.rows.length; j++) {
            const row = this.rows[j];
            let y = (this.rowHeight * j) + topMargin + 15; // 15 is header row height
            const { columns } = row;
            drawRowRect(y);
            // Print column cells
            for (let j = 0; j < columns.length; j++) {
                const x = columnPosition[j];
                let column = columns[j];
                this.doc.text(column.text, x, y + (this.rowHeight / 2), {
                    lineHeightFactor: 0,
                    baseline: "middle",
                });
            }
        }
    }

    addRow(row: string[]) {
        const columnCount = row.length;
        let columns: ICell[] = [];
        for (let i = 0; i < columnCount; i++) {
            const cellContent = row[i];
            const column: ICell = {
                text: cellContent,
                background: Colors.WHITE,
                color: Colors.DARK_GREY,
            };
            columns.push(column);
            this.updateColumnWidth(cellContent, i);
        }
        let processedRow: IRow = {
            columns,
            isHeader: false,
            rowHeight: 20,
        };
        this.rows.push(processedRow);
    }
}
