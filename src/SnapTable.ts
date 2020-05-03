import jsPDF from 'jspdf';
import Page from './Page';
import pixelWidth from 'string-pixel-width';
import Row from './Row';
import Colors from './enum/colors';
import JspdfUtils from './JspdfUtils';
import {
    ICell,
    IRow,
    IPageConfiguration,
    JsPDFX,
    IInternalConfiguration,
    IMergedConfiguration,
    IDocProps,
} from './types';
import merge from 'lodash.merge';
import Cell from './Cell';
import UnitHelper from './UnitHelper';

export type ITableData = {
    head: ICell[] | string[];
    body: IRow[] | string[][];
};

export default class SnapTable {
    doc: jsPDF;

    columnWidth: number[] = [];

    private mergedConfiguration: IMergedConfiguration;

    private documentProperties: IDocProps;

    private internalConfig: IInternalConfiguration = {
        cellPadding: {
            left: 2,
            right: 4,
        },
        headerHeight: 15,
        rowHeight: 15,
        fontSize: 12,
    };

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
        borderColor: Colors.DARK_GREY,
    };

    constructor(doc: jsPDF, configuration: IPageConfiguration) {
        this.doc = doc;
        const currentPageInfo: JsPDFX.ICurrentPageInfo = this.doc.internal.getCurrentPageInfo();
        let pageWidth = currentPageInfo.pageContext.mediaBox.topRightX;
        let pageHeight = currentPageInfo.pageContext.mediaBox.topRightY;
        const { scaleFactor } = doc.internal;

        this.documentProperties = {
            pageWidth,
            pageHeight,
            scaleFactor,
        };

        this.mergedConfiguration = merge({}, this.configuration, configuration, this.internalConfig);
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
        const { margin, rowHeight, headerHeight, cellPadding, fontSize } = this.mergedConfiguration;
        const { pageHeight } = this.documentProperties;
        const pages: Page[] = [];
        let header: Cell[];
        header = (data.head as any[]).map((cell: string | ICell) => {
            return new Cell(cell, true);
        });
        const rows = data.body;
        let contentHeight = headerHeight; // Start with height of header
        const { top: topMargin, bottom: bottomMargin } = margin!;
        const { right: rightPadding, left: leftPadding } = cellPadding!;

        let page = new Page(this.doc, this.documentProperties, this.mergedConfiguration, header);
        pages.push(page);
        for (let i = 0; i < rows.length; i++) {
            const row = new Row(rows[i]);
            const currentRowHeight = row.rowHeight || rowHeight;
            const columns = row.columns;
            if (header.length !== columns.length) {
                throw new Error("Inconsistent data: Number of headers doesn't match with all rows in content");
            }
            for (let j = 0; j < columns.length; j++) {
                const column = columns[j];
                const textWidth = pixelWidth(column.text, { size: fontSize });
                const width = UnitHelper.convertPxToPt(textWidth) + rightPadding + leftPadding;
                if (this.columnWidth[j] !== undefined) {
                    if (width > this.columnWidth[j]) {
                        this.columnWidth[j] = width;
                    }
                } else {
                    this.columnWidth[j] = width;
                }
            }
            // Split pages based on page height
            contentHeight += currentRowHeight;

            if (contentHeight > pageHeight - topMargin - bottomMargin - headerHeight) {
                contentHeight = 0;
                page = new Page(this.doc, this.documentProperties, this.mergedConfiguration, header);
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

        const currentPage = JspdfUtils.getCurrentPageNumber(this.doc);
        this.doc.deletePage(currentPage);
    }
}
