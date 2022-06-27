import jsPDF from 'jspdf';
import Row from './Row';
import { JsPDFX, IMergedConfiguration, IDocProps } from './types';
import Cell from './Cell';
import Utils from './Utils';
import UnitHelper from './UnitHelper';

/**
 *
 *
 * @export
 * @class Page
 */
export default class Page {
    private columnWidth: number[];
    private header: Cell[];
    private rows: Row[];
    private doc: jsPDF;

    private mergedConfig: IMergedConfiguration;
    private documentProperties: IDocProps;

    constructor(doc: jsPDF, documentProps: IDocProps, configuration: IMergedConfiguration, header?: Cell[]) {
        this.columnWidth = [];
        this.rows = [];
        this.doc = doc;
        this.header = header || [];
        this.mergedConfig = configuration;
        this.documentProperties = documentProps;
    }
    /**
     * Updates the header for the page.
     * This has to be triggered before calling writeToPdf()
     *
     * @param {Cell[]} header
     * @memberof Page
     */
    setHeaders(header: Cell[]): void {
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
        this.columnWidth = [...columnWidth];
    }

    /**
     * Calculates the column start positions
     *
     * @private
     * @returns {number[]} Array of number specifies the position for each column
     * @memberof Page
     */
    private getColumnPositions(): number[] {
        const { left: leftMargin } = this.mergedConfig.margin!;
        let start = leftMargin;
        return this.columnWidth.map((width) => {
            const position = start;
            start += width;
            return position;
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
            if (columnPosition[i] + this.columnWidth[i] > this.documentProperties.pageWidth) {
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
        const { margin, cellPadding, fontSize } = this.mergedConfig;
        const { left: leftMargin, right: rightMargin } = margin!;
        const { left: leftPadding, right: rightPadding } = cellPadding!;
        const columnPosition = this.getColumnPositions();
        const pages: Page[] = [];
        const page: Page = new Page(this.doc, this.documentProperties, this.mergedConfig);
        pages.push(page);
        for (let i = 0; i < this.rows.length; i++) {
            let pageIndex = 0;
            let row = new Row();
            row.addColumn(this.rows[i].columns[0]);

            let columnWidth: number[] = [this.columnWidth[0]];
            let header: Cell[] = [this.header[0]];
            const firstCellWidth = this.columnWidth[0];
            let columnPos = columnPosition[0] + this.columnWidth[0] + leftMargin;
            const availableWidth = this.documentProperties.pageWidth - firstCellWidth - leftMargin - rightMargin;
            for (let j = 1; j < columnPosition.length; j++) {
                const column = this.rows[i].columns[j];

                // When the column start position exceeds the available width
                // create a new page and reset the header, columnWidth and columns
                if (columnPos + this.columnWidth[j] > availableWidth) {
                    if (j !== 1) {
                        // Update the data for the current page
                        pages[pageIndex].addRow(row);
                        pages[pageIndex].setHeaders(header);
                        pages[pageIndex].setColumnWidth(columnWidth);

                        // Create new page
                        pageIndex++;
                        if (!pages[pageIndex]) {
                            const page = new Page(this.doc, this.documentProperties, this.mergedConfig);
                            pages[pageIndex] = page;
                        }

                        // Reset the data for next page
                        columnPos = firstCellWidth;
                        row = new Row();
                        row.addColumn(this.rows[i].columns[0]);
                        header = [this.header[0]];
                        columnWidth = [this.columnWidth[0]];
                    } else {
                        // Crop the content, if the only column exceed the page width
                        this.columnWidth[j] = availableWidth - rightMargin;
                        let modifiedColumnWidth = this.columnWidth[j];
                        const modifiedColumnWidthPx = UnitHelper.convertPtToPx(
                            modifiedColumnWidth - leftPadding - rightPadding,
                        );
                        const truncatedText = Utils.trauncateText(column.text, fontSize, modifiedColumnWidthPx);
                        column.setTruncatedText(truncatedText);
                    }
                }
                // Keep the track of data to be written in current page
                columnPos += this.columnWidth[j];
                row.addColumn(column);
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
     *  Writes a cell to PDF
     *
     * @private
     * @param {Cell} cell
     * @param {number} cellIndex
     * @param {number[]} columnPosition
     * @param {number} rowPosition
     * @memberof Page
     */
    private writeCell(cell: Cell, cellIndex: number, columnPosition: number[], rowPosition: number): void {
        let { left: leftPadding } = this.mergedConfig.cellPadding;
        const x = columnPosition[cellIndex];
        const y = rowPosition;
        const { right: rightMargin } = this.mergedConfig.margin!;
        const { scaleFactor, pageWidth } = this.documentProperties;

        const drawCellRect = (x: number, y: number, cellWidth: number, style = 'S'): void => {
            this.doc.setLineWidth(UnitHelper.documentUnitToPt(1, scaleFactor));
            const xPos = UnitHelper.documentUnitToPt(x, scaleFactor);
            const yPos = UnitHelper.documentUnitToPt(y, scaleFactor);
            const width = UnitHelper.documentUnitToPt(cellWidth, scaleFactor);
            const height = UnitHelper.documentUnitToPt(this.mergedConfig.rowHeight, scaleFactor);
            this.doc.rect(xPos, yPos, width, height, style);
        };

        const writeText = (text: string, x: number, y: number, options) => {
            const xPos = UnitHelper.documentUnitToPt(x, scaleFactor);
            const yPos = UnitHelper.documentUnitToPt(y, scaleFactor);
            this.doc.text(text, xPos, yPos, options);
        };

        const isLastColumn = (columnIndex): boolean => {
            return columnPosition.length === columnIndex + 1;
        };

        const getColumnWidth = (columnIndex: number): number => {
            if (isLastColumn(columnIndex)) {
                return pageWidth - rightMargin - columnPosition[columnIndex];
            }
            return this.columnWidth[columnIndex];
        };

        this.doc.setFillColor(cell.background);
        this.doc.setDrawColor(this.mergedConfig.borderColor!);
        this.doc.setTextColor(cell.color);

        drawCellRect(x, y, getColumnWidth(cellIndex), 'FD');
        let text = cell.truncatedText || cell.text;

        let xPos = x + leftPadding;
        let yPos = y;

        writeText(text, xPos, yPos, {
            lineHeightFactor: 0,
            baseline: 'bottom',
        });
    }

    /**
     * Write a row to the PDF
     *
     * @private
     * @param {Row} row
     * @param {number} rowIndex
     * @param {number[]} columnPosition
     * @memberof Page
     */
    private writeContentRow(row: Row, rowIndex: number, columnPosition: number[]): void {
        const { margin, headerHeight, rowHeight } = this.mergedConfig;
        const { top: topMargin } = margin!;
        const y = rowHeight * rowIndex + topMargin + headerHeight;
        const { columns } = row;

        // Print column cells
        for (let j = 0; j < columns.length; j++) {
            const column = columns[j];
            this.writeCell(column, j, columnPosition, y);
        }
    }

    /**
     * Writes the header to the PDF
     *
     * @private
     * @param {number[]} columnPosition
     * @memberof Page
     */
    private writeHeader(columnPosition: number[]): void {
        const { margin } = this.mergedConfig;
        const { top: topMargin } = margin!;

        // Print Header
        const y = topMargin;
        for (let i = 0; i < this.header.length; i++) {
            const x = columnPosition[i];
            const column = this.header[i];
            this.writeCell(column, i, columnPosition, y);
        }
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
        let { fontSize } = this.mergedConfig;
        const columnPosition = this.getColumnPositions();
        if (this.shouldSplitColumns(columnPosition)) {
            const pages = this.getColumnSplittedPages();

            for (let i = 0; i < pages.length; i++) {
                pages[i].writeToPdf();
            }
            return;
        }
        fontSize = UnitHelper.convertPxToPt(fontSize);
        this.doc.setFontSize(fontSize);

        this.writeHeader(columnPosition);

        // Print rows
        for (let j = 0; j < this.rows.length; j++) {
            const row = this.rows[j];
            this.writeContentRow(row, j, columnPosition);
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
