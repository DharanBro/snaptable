import { storiesOf } from "@storybook/html";
import './style.css'
import jsPDF from 'jspdf';
import SnapTable from '../src/index.ts';
import { data } from './data/simple'
import { data as columnSplitData } from './data/columnSplit'
import { data as customCellConfigData } from './data/customCellConfig'

function generatePDF(data) {
    const root = document.createElement('div');
    root.setAttribute("class", "root");
    root.style.width = '100%';
    root.style.height = '100%';

    const obj = document.createElement('object');
    obj.setAttribute('width', '100%');
    obj.setAttribute('height', '100%');

    var doc = new jsPDF({ unit: "px" });
    const snapTable = new SnapTable(doc);
    snapTable.writeTable(data);
    var outputString = doc.output('datauristring');

    const embed = document.createElement('embed');
    embed.setAttribute('width', '100%');
    embed.setAttribute('height', '100%');
    embed.setAttribute('src', outputString);

    obj.appendChild(embed);

    root.appendChild(obj);
    return root;
}


storiesOf("Demo").add("Simple", () => {
    return generatePDF(data);
});

storiesOf("Demo").add("Column Split", () => {
    return generatePDF(columnSplitData);
});

storiesOf("Demo").add("Custom Cell", () => {
    return generatePDF(customCellConfigData);
});