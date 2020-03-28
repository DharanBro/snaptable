# [WIP] Table Snap 

Plugin for [jsPDF](https://github.com/MrRio/jsPDF) to print a table pdf written with typescript. 

```
const  doc = new  jsPDF({ unit:  "px" });
const  tableSnap = new  TableSnap(doc)
tableSnap.writeTable(data);
const  output = doc.output("datauri");
```
> Sample output: Splitting the outspaced columns to multiple pages with
> a fixed column

<img src="https://github.com/DharanBro/tablesnap/raw/master/src/images/0002-min.jpg" width="250" height="400">
<img src="https://github.com/DharanBro/tablesnap/raw/master/src/images/0003-min.jpg" width="250" height="400">
<img src="https://github.com/DharanBro/tablesnap/raw/master/src/images/0004-min.jpg" width="250" height="400">
<img src="https://github.com/DharanBro/tablesnap/raw/master/src/images/0005-min.jpg" width="250" height="400">
