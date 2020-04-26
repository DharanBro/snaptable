import Colors from './enum/colors';
import { ICell, IRow } from './types';
import Cell from './Cell';
export default class Row {
    isHeader: boolean;
    rowHeight: number;
    columns: Cell[];
    rowSpan?: number;
    constructor(row?: string[] | IRow) {
        this.isHeader = false;
        this.rowHeight = 15;
        this.columns = [];
        if (!row) {
            return;
        }
        if (Array.isArray(row)) {
            row.forEach((col) => {
                this.addColumn(col);
            });
            return;
        }
        this.isHeader = row.isHeader;
        this.rowHeight = row.rowHeight;
        this.columns = row.columns;
        this.rowSpan = row.rowSpan;
    }
    /**
     * Adds single column to the Row
     *
     * @param {(string | ICell)} column
     * @memberof Row
     */
    addColumn(column: string | ICell): void {
        this.columns.push(new Cell(column));
    }
}
