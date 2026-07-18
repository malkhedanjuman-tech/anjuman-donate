//======================================================
// donationDrawer.js
// Module 7
// Professional Donation Drawer
//======================================================

window.openDrawer=openDrawer;
window.closeDrawer=closeDrawer;
window.saveDonation=saveDonation;
window.updateCampaign=updateCampaign;
window.updateAmount=updateAmount;

let currentDonation=null;

//======================================================
// OPEN
//======================================================

function openDrawer(id){

currentDonation=

donations.find(

d=>d.id===id

);

if(!currentDonation)

return;

const drawer=

document.getElementById("drawer");

const c=

document.getElementById("drawerContent");

c.innerHTML=`

<div class="detail-group">

<label>Donor Name</label>

<input
id="editName"
value="${currentDonation.name||""}">

</div>

<div class="detail-group">

<label>Mobile</label>

<div>

${currentDonation.mobile||""}

<button onclick="copyMobile('${currentDonation.mobile||""}')">

Copy

</button>

</div>

</div>

<div class="detail-group">

<label>Donation Reference</label>

<div>

${currentDonation.donationRef||""}

<button onclick="copyReference('${currentDonation.donationRef||""}')">

Copy

</button>

</div>

</div>

<div class="detail-group">

<label>Campaign</label>

<input

id="campaignInput"

value="${currentDonation.campaign||""}">

</div>

<div class="detail-group">

<label>Amount</label>

<input

id="amountInput"

type="number"

value="${currentDonation.amount||0}">

</div>

<div class="detail-group">

<label>Status</label>

<div>

${statusBadge(currentDonation.status)}

</div>

</div>

<div class="detail-group">

<label>Created</label>

<div>

${formatDate(currentDonation.createdAt)}

</div>

</div>

<div class="detail-group">

<label>Remarks</label>

<textarea

id="remarks"

style="width:100%;height:100px;">

${currentDonation.remarks||""}

</textarea>

</div>

<div id="statusTimeline">

${renderTimeline()}

</div>

<div id="paymentPreview">

${renderPaymentImage()}

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
onclick="saveDonation()">

Save

</button>

</div>

`;

drawer.classList.add("open");

}

//======================================================
// CLOSE
//======================================================

function closeDrawer(){

document

.getElementById("drawer")

.classList

.remove("open");

}

//======================================================
// SAVE
//======================================================

async function saveDonation(){

if(!currentDonation)

return;

showLoading();

try{

await updateDoc(

doc(

db,

"donations",

currentDonation.id

),

{

name:

document

.getElementById("editName")

.value,

campaign:

document

.getElementById("campaignInput")

.value,

amount:Number(

document

.getElementById("amountInput")

.value

),

remarks:

document

.getElementById("remarks")

.value

}

);

toastMessage(

"Donation Updated"

);

loadDonations();

}
catch(e){

console.error(e);

toastMessage(

"Unable to Save"

);

}

hideLoading();

}

//======================================================
// UPDATE CAMPAIGN
//======================================================

async function updateCampaign(){

await saveDonation();

}

//======================================================
// UPDATE AMOUNT
//======================================================

async function updateAmount(){

await saveDonation();

}

//======================================================
// PAYMENT IMAGE
//======================================================

function renderPaymentImage(){

if(!currentDonation.paymentScreenshot)

return `

<div class="detail-group">

<label>Payment Screenshot</label>

<div>

No Screenshot Uploaded

</div>

</div>

`;

return `

<div class="detail-group">

<label>Payment Screenshot</label>

<img

src="${currentDonation.paymentScreenshot}"

style="width:100%;
border-radius:8px;
cursor:pointer"

onclick="window.open('${currentDonation.paymentScreenshot}')">

</div>

`;

}

//======================================================
// STATUS HISTORY
//======================================================

function renderTimeline(){

const history=

currentDonation.statusHistory||[];

if(history.length===0)

return

"<p>No Status History</p>";

let html="<h4>Status Timeline</h4>";

history.forEach(h=>{

html+=`

<div class="timeline-item">

<strong>

${h.status}

</strong>

<br>

<small>

${h.date}

</small>

</div>

`;

});

return html;

}

//======================================================
// ESC
//======================================================

document.addEventListener(

"keydown",

e=>{

if(

e.key==="Escape"

){

closeDrawer();

}

}

//======================================================
// CLICK OUTSIDE
//======================================================

);

document.addEventListener(

"click",

e=>{

const drawer=

document.getElementById("drawer");

if(

drawer.classList.contains("open")

&&

!drawer.contains(e.target)

&&

!e.target.classList.contains("view-btn")

){

closeDrawer();

}

}

);

console.log(

"Donation Drawer Ready"

);
