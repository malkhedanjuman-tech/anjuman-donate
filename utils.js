//======================================================
// utils.js
// Module 10
// Enterprise Utility Library
//======================================================

class Utils{

//======================================================
// CURRENCY
//======================================================

static money(value){

return "₹ "+Number(value||0).toLocaleString(

"en-IN",

{

minimumFractionDigits:2,

maximumFractionDigits:2

}

);

}

//======================================================
// NUMBER
//======================================================

static number(value){

return Number(value||0).toLocaleString("en-IN");

}

//======================================================
// DATE
//======================================================

static date(ts){

if(!ts)

return "-";

if(ts.seconds){

return new Date(

ts.seconds*1000

).toLocaleString(

"en-IN"

);

}

return new Date(ts).toLocaleString(

"en-IN"

);

}

//======================================================
// SHORT DATE
//======================================================

static shortDate(ts){

if(!ts)

return "-";

if(ts.seconds)

ts=ts.seconds*1000;

return new Date(ts)

.toLocaleDateString();

}

//======================================================
// PHONE
//======================================================

static phone(mobile){

if(!mobile)

return "-";

mobile=String(mobile);

if(mobile.length!==10)

return mobile;

return mobile.replace(

/(\d{5})(\d{5})/,

"$1 $2"

);

}

//======================================================
// COPY
//======================================================

static async copy(text){

await navigator.clipboard.writeText(

text

);

toastMessage(

"Copied"

);

}

//======================================================
// UUID
//======================================================

static uuid(){

return Math.random()

.toString(36)

.substring(2,10)

.toUpperCase();

}

//======================================================
// DEBOUNCE
//======================================================

static debounce(fn,delay=300){

let timer;

return(...args)=>{

clearTimeout(timer);

timer=setTimeout(

()=>fn(...args),

delay

);

};

}

//======================================================
// THROTTLE
//======================================================

static throttle(fn,delay){

let waiting=false;

return(...args)=>{

if(waiting)

return;

fn(...args);

waiting=true;

setTimeout(()=>{

waiting=false;

},delay);

};

}

//======================================================
// DOWNLOAD
//======================================================

static download(filename,blob){

const a=

document.createElement("a");

a.href=

URL.createObjectURL(blob);

a.download=filename;

a.click();

}

//======================================================
// LOCAL STORAGE
//======================================================

static save(key,value){

localStorage.setItem(

key,

JSON.stringify(value)

);

}

static load(key,defaultValue=null){

const val=

localStorage.getItem(key);

if(!val)

return defaultValue;

return JSON.parse(val);

}

//======================================================
// QUERY PARAM
//======================================================

static query(name){

return new URLSearchParams(

location.search

).get(name);

}

//======================================================
// STATUS COLOR
//======================================================

static statusColor(status){

switch(status){

case "Verified":

return "#198754";

case "Rejected":

return "#dc3545";

case "Payment Submitted":

return "#0dcaf0";

default:

return "#ffc107";

}

}

//======================================================
// BADGE
//======================================================

static badge(status){

return `

<span

class="badge"

style="background:${Utils.statusColor(status)}">

${status}

</span>

`;

}

//======================================================
// SEARCH
//======================================================

static contains(obj,text){

text=text.toLowerCase();

return JSON.stringify(obj)

.toLowerCase()

.includes(text);

}

//======================================================
// SUM
//======================================================

static sum(rows,key){

return rows.reduce(

(a,b)=>

a+

Number(b[key]||0),

0

);

}

//======================================================
// AVG
//======================================================

static average(rows,key){

if(!rows.length)

return 0;

return(

Utils.sum(rows,key)

/rows.length

).toFixed(2);

}

//======================================================
// MAX
//======================================================

static max(rows,key){

return Math.max(

...rows.map(

x=>Number(x[key]||0)

)

);

}

//======================================================
// MIN
//======================================================

static min(rows,key){

return Math.min(

...rows.map(

x=>Number(x[key]||0)

)

);

}

//======================================================
// GROUP
//======================================================

static groupBy(rows,key){

const map={};

rows.forEach(r=>{

const k=r[key]||"Unknown";

if(!map[k])

map[k]=[];

map[k].push(r);

});

return map;

}

//======================================================
// CSV
//======================================================

static csv(rows){

if(!rows.length)

return "";

const headers=

Object.keys(rows[0]);

let csv=

headers.join(",")

+"\n";

rows.forEach(r=>{

csv+=headers.map(

h=>`"${r[h]}"`

).join(",")

+"\n";

});

return csv;

}

//======================================================
// PRINT
//======================================================

static print(html){

const w=

window.open("");

w.document.write(html);

w.document.close();

w.print();

}

}

window.Utils=Utils;

console.log(

"Utils Ready"

);
