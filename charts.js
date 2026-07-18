//======================================================
// charts.js
// Module 5A
// Enterprise Analytics Dashboard
//======================================================

// Requires Chart.js
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

class AnalyticsEngine{

constructor(data){

this.data=data;

this.dailyChart=null;
this.monthChart=null;
this.campaignChart=null;
this.statusChart=null;

}

//======================================================
// REFRESH
//======================================================

refresh(data){

this.data=data;

this.daily();

this.monthly();

this.campaign();

this.status();

this.statistics();

}

//======================================================
// DAILY COLLECTION
//======================================================

daily(){

const map={};

this.data.forEach(d=>{

if(!d.createdAt?.seconds)return;

const day=new Date(
d.createdAt.seconds*1000
).toLocaleDateString();

map[day]=(map[day]||0)+Number(d.amount||0);

});

if(this.dailyChart)
this.dailyChart.destroy();

this.dailyChart=new Chart(

document.getElementById("dailyChart"),

{

type:"line",

data:{

labels:Object.keys(map),

datasets:[{

label:"Daily Collection",

data:Object.values(map),

borderWidth:2,

fill:false,

tension:.4

}]

}

}

);

}

//======================================================
// MONTHLY
//======================================================

monthly(){

const map={};

this.data.forEach(d=>{

if(!d.createdAt?.seconds)return;

const dt=new Date(
d.createdAt.seconds*1000
);

const key=dt.toLocaleString(
"default",
{
month:"short",
year:"numeric"
}
);

map[key]=(map[key]||0)+Number(d.amount||0);

});

if(this.monthChart)
this.monthChart.destroy();

this.monthChart=new Chart(

document.getElementById("monthlyChart"),

{

type:"bar",

data:{

labels:Object.keys(map),

datasets:[{

label:"Monthly Collection",

data:Object.values(map)

}]

}

}

);

}

//======================================================
// CAMPAIGN
//======================================================

campaign(){

const map={};

this.data.forEach(d=>{

const c=d.campaign||"Unknown";

map[c]=(map[c]||0)+Number(d.amount||0);

});

if(this.campaignChart)
this.campaignChart.destroy();

this.campaignChart=new Chart(

document.getElementById("campaignChart"),

{

type:"doughnut",

data:{

labels:Object.keys(map),

datasets:[{

data:Object.values(map)

}]

}

}

);

}

//======================================================
// STATUS
//======================================================

status(){

const map={};

this.data.forEach(d=>{

const s=d.status||"Unknown";

map[s]=(map[s]||0)+1;

});

if(this.statusChart)
this.statusChart.destroy();

this.statusChart=new Chart(

document.getElementById("statusChart"),

{

type:"pie",

data:{

labels:Object.keys(map),

datasets:[{

data:Object.values(map)

}]

}

}

);

}

//======================================================
// STATISTICS
//======================================================

statistics(){

let total=0;

let highest=0;

let lowest=Infinity;

let repeat={};

this.data.forEach(d=>{

const amt=Number(d.amount||0);

total+=amt;

if(amt>highest)
highest=amt;

if(amt<lowest)
lowest=amt;

if(d.mobile){

repeat[d.mobile]=(repeat[d.mobile]||0)+1;

}

});

const avg=this.data.length
?
(total/this.data.length).toFixed(2)
:
0;

const repeatCount=

Object.values(repeat)

.filter(x=>x>1)

.length;

setText(

"averageDonation",

"₹"+avg

);

setText(

"highestDonation",

"₹"+highest

);

setText(

"lowestDonation",

"₹"+lowest

);

setText(

"repeatDonors",

repeatCount

);

}

}



//======================================================
// HELPER
//======================================================

function setText(id,value){

const el=document.getElementById(id);

if(el)

el.innerHTML=value;

}



//======================================================
// INSTANCE
//======================================================

const analytics=

new AnalyticsEngine(donations);



//======================================================
// PATCH LOAD
//======================================================

const oldLoadAnalytics=

loadDonations;

loadDonations=

async function(){

await oldLoadAnalytics();

analytics.refresh(donations);

};



//======================================================
// LIVE REFRESH
//======================================================

setInterval(()=>{

analytics.refresh(donations);

},30000);



//======================================================
// QUICK FILTERS
//======================================================

window.showVerifiedOnly=()=>{

filtered=

donations.filter(

d=>d.status==="Verified"

);

renderTable();

};



window.showPendingOnly=()=>{

filtered=

donations.filter(

d=>

d.status!=="Verified"

);

renderTable();

};



window.showTodayOnly=()=>{

const today=

new Date()

.toDateString();

filtered=

donations.filter(d=>{

if(!d.createdAt?.seconds)

return false;

return new Date(

d.createdAt.seconds*1000

).toDateString()

===today;

});

renderTable();

};



//======================================================
// END
//======================================================

console.log(

"Analytics Engine Ready"

);
