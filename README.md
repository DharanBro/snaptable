# [WIP] SnapTable 
![MIT](https://badgen.net/badge/license/MIT/blue)
![bundlephobia](https://badgen.net/bundlephobia/min/snaptable)
![types](https://badgen.net/npm/types/snaptable)
![npm version](https://badgen.net/npm/v/snaptable)

Plugin for [jsPDF](https://github.com/MrRio/jsPDF) to write a table to pdf written with typescript. 

```
const  doc = new  jsPDF({ unit:  "px" });
const  snapTable = new  SnapTable(doc)
snapTable.writeTable(data);
const  output = doc.output("datauri");
```
