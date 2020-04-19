import jsPDF from 'jspdf';
import Colors from './enum/colors';
import Row from './Row';
import { ICell, IPageConfiguration, JsPDFX } from './types';

/**
 *
 *
 * @export
 * @class Page
 */
export default class Page {
    private rowHeight = 15;
    private columnWidth: number[];
    private header: ICell[];
    private rows: Row[];
    private doc: jsPDF;
    private pageWidth: number;
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
        },
    };

    constructor(doc: jsPDF, header?: ICell[], configuration?: IPageConfiguration) {
        this.columnWidth = [];
        this.rows = [];
        this.doc = doc;
        this.header = header || [];
        const currentPageInfo: JsPDFX.ICurrentPageInfo = this.doc.internal.getCurrentPageInfo();
        this.pageWidth = currentPageInfo.pageContext.mediaBox.topRightX / 1.33;
    }
    /**
     * Updates the header for the page.
     * This has to be triggered before calling writeToPdf()
     *
     * @param {ICell[]} header
     * @memberof Page
     */
    setHeaders(header: ICell[]): void {
        this.header = header;
    }

    /**
     * Updates the column's width for the page
     * This has to be triggered before calling writeToPdf()
     *
     * @param {number[]} columnWidth
     * @memberof Page
     */
    setColumnWidth(columnWidth: number[]): void {
        this.columnWidth = columnWidth;
    }

    /**
     * Calculates the column start positions
     *
     * @private
     * @returns {number[]} Array of number specifies the position for each column
     * @memberof Page
     */
    private getColumnPositions(): number[] {
        const { left: leftMargin } = this.configuration.margin;
        let start = leftMargin;
        return this.columnWidth.map((width) => {
            const position = start;
            start += width + 10;
            return position + 2;
        });
    }

    /**
     * Checks for wheather the page should be splitted for excessive columns
     *
     * @private
     * @param {number[]} columnPosition
     * @returns {boolean} Whether the page should be splitted for excessive columns
     * @memberof Page
     */
    private shouldSplitColumns(columnPosition: number[]): boolean {
        for (let i = 0; i < columnPosition.length; i++) {
            if (columnPosition[i] + this.columnWidth[i] > this.pageWidth) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generates separate pages for additional column having the first column and header
     * as fixed in every other page.
     *
     * @private
     * @returns {Page[]}
     * @memberof Page
     */
    private getColumnSplittedPages(): Page[] {
        const { left: leftMargin, right: rightMargin } = this.configuration.margin;
        const columnPosition = this.getColumnPositions();
        const pages: Page[] = [];

        const page: Page = new Page(this.doc);
        pages.push(page);

        for (let i = 0; i < this.rows.length; i++) {
            let pageIndex = 0;
            let row = new Row();
            row.addColumn(this.rows[i].columns[0]);

            let columnWidth: number[] = [this.columnWidth[0]];
            let header: ICell[] = [this.header[0]];
            const firstCellWidth = this.columnWidth[0];
            let columnPos = columnPosition[0] + this.columnWidth[0] + leftMargin;
            for (let j = 1; j < columnPosition.length; j++) {
                const availableWidth = this.pageWidth - firstCellWidth - leftMargin - rightMargin;
                // When the column start position exceeds the available width
                // create a new page and reset the header, columnWidth and columns
                if (columnPos + this.columnWidth[j] > availableWidth) {
                    // Update the data for the current page
                    pages[pageIndex].addRow(row);
                    pages[pageIndex].setHeaders(header);
                    pages[pageIndex].setColumnWidth(columnWidth);

                    // Create new page
                    pageIndex++;
                    if (!pages[pageIndex]) {
                        const page = new Page(this.doc);
                        pages[pageIndex] = page;
                    }

                    // Reset the data for next page
                    columnPos = firstCellWidth;
                    row = new Row();
                    row.addColumn(this.rows[i].columns[0]);
                    header = [this.header[0]];
                    columnWidth = [this.columnWidth[0]];
                }
                // Keep the track of data to be written in current page
                columnPos += this.columnWidth[j];
                row.addColumn(this.rows[i].columns[j]);
                header.push(this.header[j]);
                columnWidth.push(this.columnWidth[j]);
            }
            // Update the data for last page
            pages[pageIndex].addRow(row);
            pages[pageIndex].setHeaders(header);
            pages[pageIndex].setColumnWidth(columnWidth);
        }
        return pages;
    }

    /**
     * Writes the page as table to the pdf
     *
     * @returns
     * @memberof Page
     */
    writeToPdf(): void {
        if (this.columnWidth.length === 0) {
            throw new Error('Column width not available: Did you forget to call page.setColumnWidth()?');
        }
        const columnPosition = this.getColumnPositions();
        if (this.shouldSplitColumns(columnPosition)) {
            const pages = this.getColumnSplittedPages();

            for (let i = 0; i < pages.length; i++) {
                pages[i].writeToPdf();
            }
            return;
        }
        this.doc.setFontSize(10);
        const { left: leftMargin, right: rightMargin, top: topMargin } = this.configuration.margin;

        const drawRowRect = (y: number, style = 'S'): void => {
            this.doc.rect(leftMargin, y, this.pageWidth - leftMargin - rightMargin, this.rowHeight, style);
        };

        // Print Header
        const y = topMargin;
        this.doc.setFillColor(Colors.STEEL_BLUE);
        this.doc.setDrawColor(Colors.STEEL_BLUE);
        this.doc.setTextColor(Colors.WHITE);

        drawRowRect(y, 'FD');
        for (let i = 0; i < this.header.length; i++) {
            const x = columnPosition[i];
            const column = this.header[i];
            console.log(column);
            this.doc.text(column.text, x, y + 15 / 2, {
                lineHeightFactor: 0,
                baseline: 'middle',
            });
        }

        // Print rows
        this.doc.setFillColor(Colors.WHITE);
        this.doc.setDrawColor(Colors.DARK_GREY);
        this.doc.setTextColor(Colors.DARK_GREY);
        for (let j = 0; j < this.rows.length; j++) {
            const row = this.rows[j];
            const y = this.rowHeight * j + topMargin + 15; // 15 is header row height
            const { columns } = row;
            drawRowRect(y);
            // Print column cells
            for (let j = 0; j < columns.length; j++) {
                const x = columnPosition[j];
                const column = columns[j];
                this.doc.text(column.text, x, y + this.rowHeight / 2, {
                    lineHeightFactor: 0,
                    baseline: 'middle',
                });
            }
        }

        this.doc.addPage();
    }

    /**
     * Adds a new row to the page.
     * Note: It doesn't write to pdf.
     * TO-DO: Revist, so that it can write directly to pdf to improve the performance.
     *
     * @param {(string[] | Row)} row
     * @returns
     * @memberof Page
     */
    addRow(row: string[] | Row): void {
        if (row instanceof Row) {
            this.rows.push(row);
            return;
        }
        this.rows.push(new Row(row));
    }
}
