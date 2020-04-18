import Colors from './enum/colors';
import { ICell, IRow } from './types';
export default class Row {
    isHeader: boolean;
    rowHeight: number;
    columns: ICell[];
    rowSpan?: number;
    constructor(row?: string[] | IRow) {
        this.isHeader = false;
        this.rowHeight = 15;
        if (!row) {
            this.columns = [];
            return;
        }
        if (Array.isArray(row)) {
            this.columns = row.map((col) => {
                return {
                    background: Colors.WHITE,
                    color: Colors.DARK_GREY,
                    text: col,
                };
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
     * @returns
     * @memberof Row
     */
    addColumn(column: string | ICell) {
        if (typeof column === 'string') {
            this.columns.push({
                background: Colors.WHITE,
                color: Colors.DARK_GREY,
                text: column,
            });
            return;
        }
        this.columns.push(column);
    }
}
