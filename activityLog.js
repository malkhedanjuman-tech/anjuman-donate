//======================================================
// activityLog.js
// Module 13
// Enterprise Audit & Activity Log
//======================================================

import {
collection,
addDoc,
getDocs,
query,
orderBy,
limit,
where,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

class ActivityLog{

constructor(){

this.collection="activityLogs";

}

//======================================================
// WRITE LOG
//======================================================

async log(action,data={}){

try{

await addDoc(

collection(

db,

this.collection

),

{

action,

data,

user:

window.currentAdmin||

"Administrator",

timestamp:

serverTimestamp(),

ip:

null,

device:

navigator.userAgent

}

);

}
catch(err){

console.error(

"Activity Log Error",

err

);

}

}

//======================================================
// LOAD LOGS
//======================================================

async latest(count=100){

const q=query(

collection(

db,

this.collection

),

orderBy(

"timestamp",

"desc"

),

limit(count)

);

const snap=

await getDocs(q);

return snap.docs.map(d=>({

id:d.id,

...d.data()

}));

}

//======================================================
// FILTER
//======================================================

async filter(action){

const q=query(

collection(

db,

this.collection

),

where(

"action",

"==",

action

),

orderBy(

"timestamp",

"desc"

)

);

const snap=

await getDocs(q);

return snap.docs.map(x=>({

id:x.id,

...x.data()

}));

}

//======================================================
// RENDER
//======================================================

render(rows){

const body=

document.getElementById(

"activityTableBody"

);

if(!body)

return;

body.innerHTML="";

rows.forEach(log=>{

body.innerHTML+=`

<tr>

<td>${Utils.date(log.timestamp)}</td>

<td>${log.user}</td>

<td>${log.action}</td>

<td>${this.description(log)}</td>

</tr>

`;

});

}

//======================================================
// DESCRIPTION
//======================================================

description(log){

const d=log.data||{};

switch(log.action){

case"VERIFY":

return`Verified donation ${d.reference||""}`;

case"REJECT":

return`Rejected donation ${d.reference||""}`;

case"DELETE":

return`Deleted donation ${d.reference||""}`;

case"UPDATE":

return`Updated donation ${d.reference||""}`;

case"BULK_VERIFY":

return`Bulk verified ${d.count||0} donations`;

case"BULK_DELETE":

return`Bulk deleted ${d.count||0} donations`;

case"LOGIN":

return"Administrator Login";

case"LOGOUT":

return"Administrator Logout";

case"EXPORT":

return`Exported ${d.type||""}`;

default:

return log.action;

}

}

//======================================================
// VERIFY
//======================================================

verify(id,ref){

this.log(

"VERIFY",

{

id,

reference:ref

}

);

}

//======================================================
// REJECT
//======================================================

reject(id,ref){

this.log(

"REJECT",

{

id,

reference:ref

}

);

}

//======================================================
// UPDATE
//======================================================

update(id,ref){

this.log(

"UPDATE",

{

id,

reference:ref

}

);

}

//======================================================
// DELETE
//======================================================

remove(id,ref){

this.log(

"DELETE",

{

id,

reference:ref

}

);

}

//======================================================
// BULK VERIFY
//======================================================

bulkVerify(ids){

this.log(

"BULK_VERIFY",

{

count:ids.length,

ids

}

);

}

//======================================================
// BULK DELETE
//======================================================

bulkDelete(ids){

this.log(

"BULK_DELETE",

{

count:ids.length,

ids

}

);

}

//======================================================
// EXPORT
//======================================================

export(type,total){

this.log(

"EXPORT",

{

type,

total

}

);

}

//======================================================
// LOGIN
//======================================================

login(name){

window.currentAdmin=name;

this.log(

"LOGIN"

);

}

//======================================================
// LOGOUT
//======================================================

logout(){

this.log(

"LOGOUT"

);

}

//======================================================
// STARTUP
//======================================================

async init(){

const logs=

await this.latest(50);

this.render(logs);

}

}

const activityLog=

new ActivityLog();

window.activityLog=

activityLog;

//======================================================
// AUTO HOOKS
//======================================================

document.addEventListener(

"DOMContentLoaded",

()=>{

activityLog.init();

}

);

console.log(

"Activity Log Ready"

);
