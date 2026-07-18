//======================================================
// tableEngine.js
// Module 8
// Enterprise Table Engine
//======================================================

window.toggleColumn=toggleColumn;
window.restoreColumns=restoreColumns;

const TABLE_KEY="donation_table_columns";

const columns=[
"checkbox",
"serial",
"reference",
"name",
"mobile",
"amount",
"campaign",
"status",
"date",
"action"
];

let visibleColumns={};



//======================================================
// LOAD SETTINGS
//======================================================

function loadColumnSettings(){

const saved=localStorage.getItem(TABLE_KEY);

if(saved){

visibleColumns=JSON.parse(saved);

}
else{

columns.forEach(c=>{

visibleColumns[c]=true;

});

saveColumnSettings();

}

applyColumns();

}



//======================================================
// SAVE
//======================================================

function saveColumnSettings(){

localStorage.setItem(

TABLE_KEY,

JSON.stringify(

visibleColumns

)

);

}



//======================================================
// APPLY
//======================================================

function applyColumns(){

const table=

document.getElementById(

"donationTable"

);

if(!table) return;

const rows=table.rows;

for(let r=0;r<rows.length;r++){

let cell=0;

columns.forEach(col=>{

if(rows[r].cells[cell]){

rows[r].cells[cell].style.display=

visibleColumns[col]

?

""

:

"none";

}

cell++;

});

}

}



//======================================================
// TOGGLE
//======================================================

function toggleColumn(column){

visibleColumns[column]=

!visibleColumns[column];

saveColumnSettings();

applyColumns();

}



//======================================================
// RESTORE
//======================================================

function restoreColumns(){

columns.forEach(c=>{

visibleColumns[c]=true;

});

saveColumnSettings();

applyColumns();

toastMessage(

"Columns Restored"

);

}



//======================================================
// MULTI SORT
//======================================================

let sortStack=[];

window.multiSort=function(col){

const existing=

sortStack.find(

x=>x.column===col

);

if(existing){

existing.direction=

existing.direction==="asc"

?

"desc"

:

"asc";

}
else{

sortStack.push({

column:col,

direction:"asc"

});

}

filtered.sort((a,b)=>{

for(const s of sortStack){

let x=a[s.column];

let y=b[s.column];

if(s.column==="createdAt"){

x=x?.seconds||0;

y=y?.seconds||0;

}

if(x<y)

return

s.direction==="asc"

?

-1

:

1;

if(x>y)

return

s.direction==="asc"

?

1

:

-1;

}

return 0;

});

renderTable();

};



//======================================================
// COLUMN RESIZE
//======================================================

function enableResize(){

const headers=

document.querySelectorAll(

"#donationTable th"

);

headers.forEach(th=>{

const grip=

document.createElement(

"div"

);

grip.style.width="6px";

grip.style.position="absolute";

grip.style.right="0";

grip.style.top="0";

grip.style.bottom="0";

grip.style.cursor="col-resize";

th.style.position="relative";

th.appendChild(grip);

let startX,startWidth;

grip.addEventListener(

"mousedown",

e=>{

startX=e.pageX;

startWidth=th.offsetWidth;

document.onmousemove=m;

document.onmouseup=u;

});

function m(e){

th.style.width=

startWidth+

(

e.pageX-startX

)

+

"px";

}

function u(){

document.onmousemove=null;

document.onmouseup=null;

}

});

}



//======================================================
// STICKY HEADER
//======================================================

function stickyHeader(){

const head=

document.querySelector(

"#donationTable thead"

);

head.style.position="sticky";

head.style.top="0";

head.style.zIndex="100";

}



//======================================================
// ROW HIGHLIGHT
//======================================================

window.highlightRow=function(id){

document

.querySelectorAll(

"#tableBody tr"

)

.forEach(

x=>x.classList.remove(

"active"

)

);

const row=

document.querySelector(

`tr[data-id='${id}']`

);

if(row)

row.classList.add(

"active"

);

};



//======================================================
// REMEMBER PAGE SIZE
//======================================================

const PAGE_KEY=

"rows_per_page";

const selector=

document.getElementById(

"rowsPerPage"

);

if(selector){

const saved=

localStorage.getItem(

PAGE_KEY

);

if(saved){

selector.value=saved;

rowsPerPage=

parseInt(saved);

}

selector.onchange=e=>{

rowsPerPage=

parseInt(e.target.value);

localStorage.setItem(

PAGE_KEY,

rowsPerPage

);

renderTable();

};

}



//======================================================
// SEARCH DEBOUNCE
//======================================================

function debounce(fn,delay){

let timer;

return(...args)=>{

clearTimeout(timer);

timer=setTimeout(

()=>fn(...args),

delay

);

};

}

document

.getElementById("searchBox")

.addEventListener(

"input",

debounce(

filterData,

300

)

);



//======================================================
// INIT
//======================================================

loadColumnSettings();

enableResize();

stickyHeader();

console.log(

"Table Engine Ready"

);
