//======================================================
// export.js
// Module 4A
// CSV • Excel • PDF • Print Engine
//======================================================

// Requires:
// SheetJS (xlsx)
// jsPDF
//
// HTML:
// <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/jspdf"></script>
// <script src="export.js"></script>

class ExportEngine{

constructor(){

this.filename="Donation_Report";

}

//======================================================
// CURRENT DATASET
//======================================================

getRows(selectedOnly=false){

if(selectedOnly){

const ids=[
...document.querySelectorAll(".rowSelect:checked")
].map(x=>x.value);

return filtered.filter(x=>ids.includes(x.id));

}

return filtered;

}

//======================================================
// NORMALIZE
//======================================================

normalize(rows){

return rows.map(d=>({

Reference:d.donationRef||"",

Name:d.name||"",

Mobile:d.mobile||"",

Amount:Number(d.amount||0),

Campaign:d.campaign||"",

Status:d.status||"",

Remarks:d.remarks||"",

Date:formatDate(d.createdAt)

}));

}

//======================================================
// CSV
//======================================================

csv(selected=false){

const rows=this.normalize(

this.getRows(selected)

);

if(!rows.length){

toastMessage("Nothing to export");

return;

}

const headers=Object.keys(rows[0]);

let csv=headers.join(",");

csv+="\n";

rows.forEach(r=>{

csv+=headers

.map(h=>`"${String(r[h]).replace(/"/g,'""')}"`)

.join(",");

csv+="\n";

});

const blob=new Blob(

[csv],

{type:"text/csv"}

);

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download=this.filename+".csv";

a.click();

toastMessage("CSV Exported");

}

//======================================================
// EXCEL
//======================================================

excel(selected=false){

const rows=this.normalize(

this.getRows(selected)

);

if(!rows.length){

toastMessage("Nothing to export");

return;

}

const ws=XLSX.utils.json_to_sheet(rows);

const wb=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(

wb,

ws,

"Donations"

);

XLSX.writeFile(

wb,

this.filename+".xlsx"

);

toastMessage("Excel Exported");

}

//======================================================
// PDF
//======================================================

pdf(selected=false){

const rows=this.normalize(

this.getRows(selected)

);

if(!rows.length){

toastMessage("Nothing to export");

return;

}

const pdf=new jspdf.jsPDF();

let y=15;

pdf.setFontSize(16);

pdf.text("Donation Report",14,y);

y+=10;

pdf.setFontSize(10);

rows.forEach(r=>{

pdf.text(

`${r.Reference} | ${r.Name} | ₹${r.Amount} | ${r.Status}`,

14,

y

);

y+=7;

if(y>280){

pdf.addPage();

y=15;

}

});

pdf.save(

this.filename+".pdf"

);

toastMessage("PDF Exported");

}

//======================================================
// PRINT
//======================================================

print(selected=false){

const rows=this.normalize(

this.getRows(selected)

);

let html=`

<html>

<head>

<title>Donation Report</title>

<style>

body{

font-family:Arial;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

border:1px solid #aaa;

padding:8px;

font-size:13px;

}

th{

background:#eee;

}

</style>

</head>

<body>

<h2>Donation Report</h2>

<table>

<tr>

<th>Reference</th>

<th>Name</th>

<th>Mobile</th>

<th>Amount</th>

<th>Campaign</th>

<th>Status</th>

<th>Date</th>

</tr>

`;

rows.forEach(r=>{

html+=`

<tr>

<td>${r.Reference}</td>

<td>${r.Name}</td>

<td>${r.Mobile}</td>

<td>${r.Amount}</td>

<td>${r.Campaign}</td>

<td>${r.Status}</td>

<td>${r.Date}</td>

</tr>

`;

});

html+=`

</table>

</body>

</html>

`;

const w=window.open("");

w.document.write(html);

w.document.close();

w.focus();

w.print();

}

//======================================================
// SUMMARY EXPORT
//======================================================

summary(){

let total=0;

filtered.forEach(d=>{

total+=Number(d.amount||0);

});

return{

TotalDonations:filtered.length,

TotalAmount:total,

Average:

filtered.length

?

(total/filtered.length).toFixed(2)

:0

};

}

}

const exporter=new ExportEngine();

//======================================================
// BUTTONS
//======================================================

document.getElementById("exportCSV")
.onclick=()=>exporter.csv();

document.getElementById("exportExcel")
.onclick=()=>exporter.excel();

document.getElementById("exportSelected")
.onclick=()=>exporter.excel(true);

document.getElementById("printBtn")
.onclick=()=>exporter.print();

// Optional
window.exportPDF=()=>exporter.pdf();
window.exportSelectedPDF=()=>exporter.pdf(true);
