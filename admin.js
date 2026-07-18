//======================================================
// admin.js
// Module 2A
// Firebase + Dashboard + Rendering Engine
//======================================================

import {
db,
collection,
getDocs,
query,
orderBy,
doc,
updateDoc,
deleteDoc
} from "./firebase.js";

let donations=[];

let filtered=[];

let currentPage=1;

let rowsPerPage=25;

let sortColumn="createdAt";

let sortDirection="desc";

const tableBody=document.getElementById("tableBody");

const loading=document.getElementById("loadingOverlay");

const toast=document.getElementById("toast");



//======================================================
// START
//======================================================

window.addEventListener("load",()=>{

loadDonations();

setEvents();

});



//======================================================
// EVENTS
//======================================================

function setEvents(){

document
.getElementById("searchBox")
.addEventListener("input",filterData);

document
.getElementById("campaignFilter")
.addEventListener("input",filterData);

document
.getElementById("statusFilter")
.addEventListener("change",filterData);

document
.getElementById("todayOnly")
.addEventListener("change",filterData);

document
.getElementById("pendingOnly")
.addEventListener("change",filterData);

document
.getElementById("rowsPerPage")
.addEventListener("change",e=>{

rowsPerPage=parseInt(e.target.value);

renderTable();

});

document
.getElementById("refreshBtn")
.onclick=loadDonations;

document
.getElementById("prevPage")
.onclick=previousPage;

document
.getElementById("nextPage")
.onclick=nextPage;

}



//======================================================
// LOAD FIREBASE
//======================================================

async function loadDonations(){

showLoading();

try{

const q=query(

collection(db,"donations"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

donations=snap.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

filtered=[...donations];

calculateDashboard();

renderTable();

hideLoading();

toastMessage("Data refreshed");

}
catch(err){

hideLoading();

console.error(err);

toastMessage("Failed loading");

}

}



//======================================================
// DASHBOARD
//======================================================

function calculateDashboard(){

let totalAmount=0;

let pending=0;

let verified=0;

let initiated=0;

let submitted=0;

let today=0;

let month=0;

const now=new Date();

donations.forEach(d=>{

const amount=parseFloat(d.amount||0);

totalAmount+=amount;

switch(d.status){

case "Verified":

verified++;

break;

case "Initiated":

initiated++;

pending++;

break;

case "Payment Submitted":

submitted++;

pending++;

break;

}

if(d.createdAt?.seconds){

const dt=new Date(

d.createdAt.seconds*1000

);

if(

dt.toDateString()===

now.toDateString()

){

today+=amount;

}

if(

dt.getMonth()===now.getMonth()

&&

dt.getFullYear()===now.getFullYear()

){

month+=amount;

}

}

});

document.getElementById("totalDonations").textContent=donations.length;

document.getElementById("totalAmount").textContent="₹"+totalAmount.toLocaleString();

document.getElementById("pendingCount").textContent=pending;

document.getElementById("verifiedCount").textContent=verified;

document.getElementById("initiatedCount").textContent=initiated;

document.getElementById("submittedCount").textContent=submitted;

document.getElementById("todayCollection").textContent="₹"+today.toLocaleString();

document.getElementById("monthCollection").textContent="₹"+month.toLocaleString();

}



//======================================================
// TABLE
//======================================================

function renderTable(){

tableBody.innerHTML="";

const start=(currentPage-1)*rowsPerPage;

const end=start+rowsPerPage;

const pageData=filtered.slice(start,end);

pageData.forEach((d,index)=>{

const tr=document.createElement("tr");

tr.className=(d.status||"").toLowerCase().replaceAll(" ","");

tr.innerHTML=`

<td>

<input
type="checkbox"
class="rowSelect"
value="${d.id}">

</td>

<td>${start+index+1}</td>

<td>${d.donationRef||""}</td>

<td>${d.name||""}</td>

<td>${d.mobile||""}</td>

<td>₹ ${Number(d.amount||0).toLocaleString()}</td>

<td>${d.campaign||""}</td>

<td>${statusBadge(d.status)}</td>

<td>${formatDate(d.createdAt)}</td>

<td>

<button
class="action-btn view-btn"
onclick="openDrawer('${d.id}')">

View

</button>

</td>

`;

tableBody.appendChild(tr);

});

document.getElementById("pageInfo").textContent=

`Page ${currentPage} of ${Math.ceil(filtered.length/rowsPerPage)||1}`;

}



//======================================================
// BADGE
//======================================================

function statusBadge(status){

if(status==="Verified")

return '<span class="badge verified">Verified</span>';

if(status==="Payment Submitted")

return '<span class="badge submitted">Submitted</span>';

if(status==="Rejected")

return '<span class="badge rejected">Rejected</span>';

return '<span class="badge initiated">Initiated</span>';

}



//======================================================
// DATE
//======================================================

function formatDate(ts){

if(!ts||!ts.seconds)

return "-";

return new Date(

ts.seconds*1000

).toLocaleString();

}
//======================================================
// Module 2B
// Search • Filters • Sorting • Pagination • Drawer
//======================================================

window.openDrawer=openDrawer;

function filterData(){

const search=document
.getElementById("searchBox")
.value
.toLowerCase();

const campaign=document
.getElementById("campaignFilter")
.value
.toLowerCase();

const status=document
.getElementById("statusFilter")
.value;

const todayOnly=document
.getElementById("todayOnly")
.checked;

const pendingOnly=document
.getElementById("pendingOnly")
.checked;

const from=document
.getElementById("fromDate")
.value;

const to=document
.getElementById("toDate")
.value;

filtered=donations.filter(d=>{

const txt=`

${d.name||""}

${d.mobile||""}

${d.donationRef||""}

`.toLowerCase();

if(search && !txt.includes(search))
return false;

if(
campaign &&
(d.campaign||"")
.toLowerCase()!=campaign
)
return false;

if(
status &&
d.status!=status
)
return false;

if(
pendingOnly &&
d.status==="Verified"
)
return false;

if(d.createdAt?.seconds){

const dt=new Date(
d.createdAt.seconds*1000
);

if(todayOnly){

const now=new Date();

if(
dt.toDateString()!=
now.toDateString()
)
return false;

}

if(from){

if(
dt<
new Date(from)
)
return false;

}

if(to){

const end=new Date(to);

end.setHours(
23,
59,
59,
999
);

if(dt>end)
return false;

}

}

return true;

});

sortTable();

currentPage=1;

renderTable();

}





//======================================================
// SORT
//======================================================

document
.querySelectorAll("th")
.forEach(th=>{

th.onclick=()=>{

const key=

th.innerText
.toLowerCase()
.replace(" ","");

switch(key){

case "reference":

sortColumn="donationRef";

break;

case "name":

sortColumn="name";

break;

case "mobile":

sortColumn="mobile";

break;

case "amount":

sortColumn="amount";

break;

case "campaign":

sortColumn="campaign";

break;

case "status":

sortColumn="status";

break;

case "date":

sortColumn="createdAt";

break;

default:

return;

}

sortDirection=

sortDirection==="asc"

?

"desc"

:

"asc";

sortTable();

renderTable();

};

});



function sortTable(){

filtered.sort((a,b)=>{

let x=a[sortColumn];

let y=b[sortColumn];

if(sortColumn==="createdAt"){

x=x?.seconds||0;

y=y?.seconds||0;

}

if(sortColumn==="amount"){

x=parseFloat(x||0);

y=parseFloat(y||0);

}

if(x<y)

return sortDirection==="asc"

?

-1

:

1;

if(x>y)

return sortDirection==="asc"

?

1

:

-1;

return 0;

});

}



//======================================================
// PAGINATION
//======================================================

function nextPage(){

const max=

Math.ceil(

filtered.length/

rowsPerPage

);

if(currentPage<max){

currentPage++;

renderTable();

}

}



function previousPage(){

if(currentPage>1){

currentPage--;

renderTable();

}

}





//======================================================
// DRAWER
//======================================================

function openDrawer(id){

const d=

donations.find(

x=>x.id===id

);

if(!d)

return;

const drawer=

document.getElementById("drawer");

const content=

document.getElementById("drawerContent");

content.innerHTML=`

<div class="detail-group">

<label>Name</label>

<div>${d.name||"-"}</div>

</div>

<div class="detail-group">

<label>Mobile</label>

<div>${d.mobile||"-"}</div>

</div>

<div class="detail-group">

<label>Reference</label>

<div>

${d.donationRef||"-"}

<button onclick="copyText('${d.donationRef||""}')">

Copy

</button>

</div>

</div>

<div class="detail-group">

<label>Amount</label>

<div>

₹ ${Number(d.amount||0).toLocaleString()}

</div>

</div>

<div class="detail-group">

<label>Campaign</label>

<div>${d.campaign||"-"}</div>

</div>

<div class="detail-group">

<label>Status</label>

<div>${d.status||"-"}</div>

</div>

<div class="detail-group">

<label>Date</label>

<div>${formatDate(d.createdAt)}</div>

</div>

<div class="detail-group">

<label>Remarks</label>

<textarea
id="remarks"
style="width:100%;height:90px">${d.remarks||""}</textarea>

</div>

<div class="drawer-actions">

<button
class="verify"
onclick="verifyDonation('${id}')">

Verify

</button>

<button
class="reject"
onclick="rejectDonation('${id}')">

Reject

</button>

<button
class="reset"
onclick="resetDonation('${id}')">

Reset

</button>

<button
class="edit"
onclick="saveRemarks('${id}')">

Save

</button>

</div>

`;

drawer.classList.add("open");

}



document

.getElementById("closeDrawer")

.onclick=()=>{

document

.getElementById("drawer")

.classList

.remove("open");

};





//======================================================
// COPY
//======================================================

window.copyText=function(text){

navigator

.clipboard

.writeText(text);

toastMessage(

"Copied"

);

};

//======================================================
// Module 2C
// Verify • Reject • Reset • Remarks
// Bulk Actions
// Export
//======================================================

window.verifyDonation=verifyDonation;
window.rejectDonation=rejectDonation;
window.resetDonation=resetDonation;
window.saveRemarks=saveRemarks;





//======================================================
// VERIFY
//======================================================

async function verifyDonation(id){

if(!confirm("Verify this donation?"))
return;

showLoading();

try{

await updateDoc(

doc(db,"donations",id),

{

status:"Verified",

verifiedAt:new Date(),

remarks:

document
.getElementById("remarks")
?.value||""

}

);

toastMessage("Donation Verified");

loadDonations();

}
catch(err){

console.error(err);

toastMessage("Verification Failed");

}

hideLoading();

}





//======================================================
// REJECT
//======================================================

async function rejectDonation(id){

if(!confirm("Reject this donation?"))
return;

showLoading();

try{

await updateDoc(

doc(db,"donations",id),

{

status:"Rejected",

rejectedAt:new Date(),

remarks:

document
.getElementById("remarks")
?.value||""

}

);

toastMessage("Donation Rejected");

loadDonations();

}
catch(err){

toastMessage("Error");

console.error(err);

}

hideLoading();

}





//======================================================
// RESET STATUS
//======================================================

async function resetDonation(id){

if(!confirm("Reset donation status?"))
return;

showLoading();

try{

await updateDoc(

doc(db,"donations",id),

{

status:"Initiated"

}

);

toastMessage("Status Reset");

loadDonations();

}
catch(err){

console.error(err);

toastMessage("Failed");

}

hideLoading();

}





//======================================================
// SAVE REMARKS
//======================================================

async function saveRemarks(id){

showLoading();

try{

await updateDoc(

doc(db,"donations",id),

{

remarks:

document
.getElementById("remarks")
.value

}

);

toastMessage("Remarks Saved");

}
catch(err){

console.error(err);

toastMessage("Unable to Save");

}

hideLoading();

}





//======================================================
// DELETE DONATION
//======================================================

window.deleteDonation=async function(id){

if(!confirm("Delete Donation?"))

return;

showLoading();

try{

await deleteDoc(

doc(db,"donations",id)

);

toastMessage("Deleted");

loadDonations();

}
catch(err){

console.error(err);

toastMessage("Delete Failed");

}

hideLoading();

};





//======================================================
// BULK VERIFY
//======================================================

document

.getElementById("verifySelected")

.onclick=async()=>{

const ids=getSelectedRows();

if(ids.length==0){

toastMessage("Nothing Selected");

return;

}

if(!confirm(

"Verify "+ids.length+" Donations?"

))

return;

showLoading();

for(const id of ids){

await updateDoc(

doc(db,"donations",id),

{

status:"Verified"

}

);

}

hideLoading();

toastMessage(

ids.length+

" Donations Verified"

);

loadDonations();

};





//======================================================
// BULK DELETE
//======================================================

document

.getElementById("deleteSelected")

.onclick=async()=>{

const ids=getSelectedRows();

if(ids.length==0){

toastMessage("Nothing Selected");

return;

}

if(!confirm(

"Delete "+ids.length+" Donations?"

))

return;

showLoading();

for(const id of ids){

await deleteDoc(

doc(db,"donations",id)

);

}

hideLoading();

toastMessage(

ids.length+

" Donations Deleted"

);

loadDonations();

};





//======================================================
// CHANGE STATUS
//======================================================

document

.getElementById("changeStatus")

.onclick=async()=>{

const ids=getSelectedRows();

if(ids.length==0){

toastMessage("Nothing Selected");

return;

}

const status=

prompt(

"New Status"

);

if(!status)

return;

showLoading();

for(const id of ids){

await updateDoc(

doc(db,"donations",id),

{

status:status

}

);

}

hideLoading();

toastMessage("Updated");

loadDonations();

};





//======================================================
// CHANGE CAMPAIGN
//======================================================

document

.getElementById("changeCampaign")

.onclick=async()=>{

const ids=getSelectedRows();

if(ids.length==0){

toastMessage("Nothing Selected");

return;

}

const campaign=

prompt(

"Campaign Name"

);

if(!campaign)

return;

showLoading();

for(const id of ids){

await updateDoc(

doc(db,"donations",id),

{

campaign:campaign

}

);

}

hideLoading();

toastMessage("Campaign Changed");

loadDonations();

};





//======================================================
// SELECTED IDS
//======================================================

function getSelectedRows(){

return

[

...document.querySelectorAll(

".rowSelect:checked"

)

]

.map(

x=>x.value

);

}





//======================================================
// SELECT ALL
//======================================================

document

.getElementById("selectAll")

.onchange=e=>{

document

.querySelectorAll(

".rowSelect"

)

.forEach(cb=>{

cb.checked=e.target.checked;

});

};





//======================================================
// CSV EXPORT
//======================================================

document

.getElementById("exportCSV")

.onclick=()=>{

let csv=

"Reference,Name,Mobile,Amount,Campaign,Status\n";

filtered.forEach(d=>{

csv+=

`"${d.donationRef}",`

+

`"${d.name}",`

+

`"${d.mobile}",`

+

`"${d.amount}",`

+

`"${d.campaign}",`

+

`"${d.status}"\n`;

});

const blob=

new Blob(

[csv],

{

type:"text/csv"

}

);

const a=

document.createElement("a");

a.href=

URL.createObjectURL(blob);

a.download=

"donations.csv";

a.click();

toastMessage(

"CSV Downloaded"

);

};

//======================================================
// Module 2D
// Excel • Print • Toast • Loading
// Auto Refresh • Charts
//======================================================





//======================================================
// EXCEL EXPORT
//======================================================

document

.getElementById("exportExcel")

.onclick=()=>{

let table=`

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

filtered.forEach(d=>{

table+=`

<tr>

<td>${d.donationRef||""}</td>

<td>${d.name||""}</td>

<td>${d.mobile||""}</td>

<td>${d.amount||0}</td>

<td>${d.campaign||""}</td>

<td>${d.status||""}</td>

<td>${formatDate(d.createdAt)}</td>

</tr>

`;

});

table+="</table>";

const blob=new Blob(

[table],

{

type:

"application/vnd.ms-excel"

}

);

const link=

document.createElement("a");

link.href=

URL.createObjectURL(blob);

link.download=

"DonationReport.xls";

link.click();

toastMessage(

"Excel Exported"

);

};





//======================================================
// PRINT
//======================================================

document

.getElementById("printBtn")

.onclick=()=>{

window.print();

};





//======================================================
// TOAST
//======================================================

function toastMessage(text){

toast.innerHTML=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove(

"show"

);

},2500);

}





//======================================================
// LOADING
//======================================================

function showLoading(){

loading.classList.add(

"show"

);

}



function hideLoading(){

loading.classList.remove(

"show"

);

}





//======================================================
// AUTO REFRESH
//======================================================

setInterval(()=>{

loadDonations();

const now=

new Date()

.toLocaleTimeString();

const page=

document

.getElementById(

"pageInfo"

);

if(page){

page.innerHTML=

page.innerHTML+

`<br>

<small>

Updated :

${now}

</small>`;

}

},30000);





//======================================================
// OFFLINE
//======================================================

window.addEventListener(

"offline",

()=>{

toastMessage(

"No Internet"

);

}

);



window.addEventListener(

"online",

()=>{

toastMessage(

"Back Online"

);

loadDonations();

}

);





//======================================================
// CHARTS
//======================================================

let dailyChart;

let campaignChart;



function renderCharts(){

renderDailyChart();

renderCampaignChart();

}





//======================================================
// DAILY CHART
//======================================================

function renderDailyChart(){

const map={};

donations.forEach(d=>{

if(!d.createdAt?.seconds)

return;

const day=

new Date(

d.createdAt.seconds*1000

)

.toLocaleDateString();

map[day]=(map[day]||0)

+

Number(d.amount||0);

});

const labels=

Object.keys(map);

const values=

Object.values(map);

if(dailyChart)

dailyChart.destroy();

dailyChart=

new Chart(

document

.getElementById(

"dailyChart"

),

{

type:"line",

data:{

labels,

datasets:[{

label:

"Daily Collection",

data:values,

fill:false,

tension:.3

}]

}

}

);

}





//======================================================
// CAMPAIGN CHART
//======================================================

function renderCampaignChart(){

const map={};

donations.forEach(d=>{

const c=

d.campaign||

"Unknown";

map[c]=(map[c]||0)

+

Number(

d.amount||0

);

});

const labels=

Object.keys(map);

const values=

Object.values(map);

if(campaignChart)

campaignChart.destroy();

campaignChart=

new Chart(

document

.getElementById(

"campaignChart"

),

{

type:"bar",

data:{

labels,

datasets:[{

label:

"Campaign Collection",

data:values

}]

}

}

);

}





//======================================================
// AFTER DATA LOAD
//======================================================

const originalLoad=

loadDonations;

loadDonations=

async function(){

await originalLoad();

renderCharts();

};

//======================================================
// Module 2E
// Analytics • Helpers • Utilities • Final Initialization
//======================================================

//======================================================
// ANALYTICS
//======================================================

function calculateAnalytics(){

    if(!donations.length) return;

    let highest=0;
    let lowest=Infinity;
    let total=0;

    const repeat={};

    donations.forEach(d=>{

        const amount=Number(d.amount||0);

        total+=amount;

        if(amount>highest) highest=amount;

        if(amount<lowest) lowest=amount;

        if(d.mobile){

            repeat[d.mobile]=(repeat[d.mobile]||0)+1;

        }

    });

    const avg=(total/donations.length).toFixed(2);

    const repeatDonors=Object.values(repeat)
        .filter(v=>v>1)
        .length;

    console.log({

        averageDonation:avg,

        highestDonation:highest,

        lowestDonation:lowest,

        repeatDonors

    });

}



//======================================================
// COPY MOBILE
//======================================================

window.copyMobile=function(mobile){

    navigator.clipboard.writeText(mobile);

    toastMessage("Mobile copied");

};



//======================================================
// COPY REFERENCE
//======================================================

window.copyReference=function(ref){

    navigator.clipboard.writeText(ref);

    toastMessage("Reference copied");

};



//======================================================
// SEARCH BY REFERENCE
//======================================================

window.searchReference=function(ref){

    document.getElementById("searchBox").value=ref;

    filterData();

};



//======================================================
// SEARCH BY MOBILE
//======================================================

window.searchMobile=function(mobile){

    document.getElementById("searchBox").value=mobile;

    filterData();

};



//======================================================
// CLEAR FILTERS
//======================================================

window.clearFilters=function(){

    document.getElementById("searchBox").value="";

    document.getElementById("campaignFilter").value="";

    document.getElementById("statusFilter").value="";

    document.getElementById("todayOnly").checked=false;

    document.getElementById("pendingOnly").checked=false;

    document.getElementById("fromDate").value="";

    document.getElementById("toDate").value="";

    filterData();

};



//======================================================
// STATUS HISTORY
//======================================================

async function appendStatusHistory(id,status){

    const donation=donations.find(x=>x.id===id);

    if(!donation) return;

    const history=donation.statusHistory||[];

    history.push({

        status,

        date:new Date().toISOString()

    });

    await updateDoc(

        doc(db,"donations",id),

        {

            statusHistory:history

        }

    );

}



//======================================================
// VERIFY WITH HISTORY
//======================================================

const oldVerify=verifyDonation;

verifyDonation=async function(id){

    await oldVerify(id);

    await appendStatusHistory(

        id,

        "Verified"

    );

};



//======================================================
// REJECT WITH HISTORY
//======================================================

const oldReject=rejectDonation;

rejectDonation=async function(id){

    await oldReject(id);

    await appendStatusHistory(

        id,

        "Rejected"

    );

};



//======================================================
// RESET WITH HISTORY
//======================================================

const oldReset=resetDonation;

resetDonation=async function(id){

    await oldReset(id);

    await appendStatusHistory(

        id,

        "Initiated"

    );

};



//======================================================
// KEYBOARD SHORTCUTS
//======================================================

document.addEventListener(

"keydown",

e=>{

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document

        .getElementById("searchBox")

        .focus();

    }

    if(e.key==="Escape"){

        document

        .getElementById("drawer")

        .classList

        .remove("open");

    }

    if(e.ctrlKey && e.key==="r"){

        e.preventDefault();

        loadDonations();

    }

}

);



//======================================================
// LAST REFRESH
//======================================================

function updateRefreshTime(){

    const page=document.getElementById("pageInfo");

    if(!page) return;

    page.innerHTML=

    `Page ${currentPage}

    <br>

    <small>

    Last Refresh :

    ${new Date().toLocaleTimeString()}

    </small>`;

}



//======================================================
// PATCH LOAD
//======================================================

const previousLoad=loadDonations;

loadDonations=async function(){

    await previousLoad();

    calculateAnalytics();

    renderCharts();

    updateRefreshTime();

};



//======================================================
// INITIALIZE
//======================================================

console.log(

"Donation Admin Pro Loaded"

);

toastMessage(

"Admin Ready"

);
