import jsPDF from 'jspdf';
import Page from './Page';
import pixelWidth from 'string-pixel-width';
import Row from './Row';
import Colors from './enum/colors';
import { ICell, IRow, IPageConfiguration, JsPDFX } from './types';

export type ITableData = {
    head: ICell[] | string[];
    body: IRow[] | string[][];
};

export default class SnapTable {
    doc: jsPDF;
    pageWidth: number;
    pageHeight: number;

    headerHeight = 15;
    rowHeight = 15;
    columnWidth: number[] = [];

    // TO-DO: Review the usage of configuration
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

    constructor(doc: jsPDF) {
        this.doc = doc;
        const currentPageInfo: JsPDFX.ICurrentPageInfo = this.doc.internal.getCurrentPageInfo();
        this.pageWidth = currentPageInfo.pageContext.mediaBox.topRightX / 1.33;
        this.pageHeight = currentPageInfo.pageContext.mediaBox.topRightY / 1.33;
    }

    /**
     * Generates the pages based on the page height and individual row height.
     * Also it calculates the column width using `string-pixel-width` library
     * and stores it internally which will be used later for page split based
     * on the number of columns and page width.
     *
     * @private
     * @param {ITableData} data
     * @returns {Page[]}
     * @memberof SnapTable
     */
    private populatePagesAndColumnWidth(data: ITableData): Page[] {
        const pages: Page[] = [];
        let header: ICell[];
        if (typeof data.head[0] === 'string') {
            header = (data.head as string[]).map((cell: string) => {
                return {
                    text: cell,
                    background: Colors.WHITE,
                    color: Colors.DARK_GREY,
                };
            });
        } else {
            header = data.head as ICell[];
        }
        const rows = data.body;
        let contentHeight = this.headerHeight; // Start with height of header
        const { top: topMargin, bottom: bottomMargin } = this.configuration.margin;

        let page = new Page(this.doc, header);
        pages.push(page);
        for (let i = 0; i < rows.length; i++) {
            const row = new Row(rows[i]);
            const rowHeight = row.rowHeight || this.rowHeight;
            const columns = row.columns;
            if (header.length !== columns.length) {
                throw new Error("Inconsistent data: Number of headers doesn't match with all rows in content");
            }
            for (let j = 0; j < columns.length; j++) {
                const column = columns[j];
                const width = pixelWidth(column.text, { size: 10 }) / 1.33;
                if (this.columnWidth[j] !== undefined) {
                    if (width > this.columnWidth[j]) {
                        this.columnWidth[j] = width;
                    }
                } else {
                    this.columnWidth[j] = width;
                }
            }
            // Split pages based on page height
            contentHeight += rowHeight;

            if (contentHeight > this.pageHeight - topMargin - bottomMargin - this.headerHeight) {
                contentHeight = 0;
                page = new Page(this.doc, header);
                pages.push(page);
            }
            page.addRow(row);
        }
        return pages;
    }

    /**
     * Writes the provided data in table format
     *
     * @param {ITableData} data
     * @memberof SnapTable
     */
    writeTable(data: ITableData) {
        const pages = this.populatePagesAndColumnWidth(data);
        for (let i = 0; i < pages.length; i++) {
            pages[i].setColumnWidth(this.columnWidth);
            pages[i].writeToPdf();
        }
    }
}
