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

Supported Data:
```
{
    head: ['Name', 'Email', 'Country'],
    body: [
        ['Caitlin', 'caitlin@example.com', 'Sweden'],
        ['Gale', 'gale@example.com', 'Norway'],
        ['Roslyn', 'roslyn@example.com', 'Australia'],
        ['Reyna', 'reyna@example.com', 'Ireland'],
        ['Sheree', 'sheree@example.com', 'Germany'],
        ['Mueller', 'mueller@example.com', 'United States of America'],
        ['Gray', 'gray@example.com', 'Sweden'],
        ['Fitzpatrick', 'fitzpatrick@example.com', 'France'],
    ],
}
```

Individual cell can be modified with cell config object

```
{
    head: ['Name', 'Email', 'Country'],
    body: [
        ['Caitlin', 'caitlin@example.com', 'Sweden'],
        ['Gale', 'gale@example.com', 'Norway'],
        ['Roslyn', 'roslyn@example.com', 'Australia'],
        ['Reyna', 'reyna@example.com', {
            text: "Ireland",
            background: "#F24436",
            color: "#FFFFFF"
        }],
        ['Sheree', 'sheree@example.com', 'Germany'],
        ['Mueller', 'mueller@example.com', 'United States of America'],
        ['Gray', {
            text: "gray@example.com",
            background: "#FFFFFF",
            color: "#FBC02D"
        }, 'Sweden'],
        ['Fitzpatrick', 'fitzpatrick@example.com', 'France'],
    ],
}
```

# Contributing

```
yarn install
yarn run storybook
```
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/dharanbro/snaptable)

