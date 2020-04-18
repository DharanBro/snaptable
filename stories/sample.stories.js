import { storiesOf } from "@storybook/html";
import jsPDF from 'jspdf';
import SnapTable from '../src/index.ts';
import { data } from './data'

storiesOf("Sample", module).add("Sample 1", () => {
    const root = document.createElement('div');
    root.setAttribute("class", "root");
    var doc = new jsPDF({ unit: "px" });
    const snapTable = new SnapTable(doc);
    snapTable.writeTable(data);
    var outputString = doc.output('datauristring');
    var embed = "<embed width='100%' height='100%' src='" + outputString + "'/>"
    document.write(embed);
    return root;
});