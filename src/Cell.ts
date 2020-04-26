import { ICell } from "./types";
import Colors from './enum/colors'
/**
 *
 *
 * @export
 * @class Cell
 */
export default class Cell {
    background: string;
    color: string;
    text: string;
    constructor(cell: string | ICell, isHeaderCell = false) {
        if (typeof cell === 'string') {
            this.background = Colors.WHITE;
            this.color = Colors.DARK_GREY;
            this.text = cell;
        } else {
            this.text = cell.text;
            this.background = cell.background;
            this.color = cell.color;
        }
        if (isHeaderCell) {
            this.background = Colors.STEEL_BLUE;
            this.color = Colors.WHITE;
        }
    }
}