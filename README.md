# [WIP] Table Snap 

Plugin for [jsPDF](https://github.com/MrRio/jsPDF) to print a table pdf written with typescript. 

```
const  doc = new  jsPDF({ unit:  "px" });
const  tableSnap = new  TableSnap(doc)
tableSnap.writeTable(data);
const  output = doc.output("datauri");
```