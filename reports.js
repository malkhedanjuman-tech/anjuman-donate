//======================================================
// reports.js
// Module 3A
// Enterprise Reports Engine
//======================================================

class Reports{

constructor(data){

this.data=data;

}



//======================================================
// DAILY REPORT
//======================================================

daily(){

const report={};

this.data.forEach(d=>{

if(!d.createdAt?.seconds) return;

const date=new Date(

d.createdAt.seconds*1000

).toLocaleDateString();

if(!report[date]){

report[date]={

count:0,

amount:0

};

}

report[date].count++;

report[date].amount+=

Number(d.amount||0);

});

return report;

}



//======================================================
// MONTHLY REPORT
//======================================================

monthly(){

const report={};

this.data.forEach(d=>{

if(!d.createdAt?.seconds)

return;

const dt=new Date(

d.createdAt.seconds*1000

);

const key=

dt.getFullYear()

+

"-"

+

(dt.getMonth()+1);

if(!report[key]){

report[key]={

count:0,

amount:0

};

}

report[key].count++;

report[key].amount+=

Number(d.amount||0);

});

return report;

}



//======================================================
// CAMPAIGN REPORT
//======================================================

campaign(){

const report={};

this.data.forEach(d=>{

const c=

d.campaign||

"Unknown";

if(!report[c]){

report[c]={

count:0,

amount:0

};

}

report[c].count++;

report[c].amount+=

Number(d.amount||0);

});

return report;

}



//======================================================
// STATUS REPORT
//======================================================

status(){

const report={};

this.data.forEach(d=>{

const s=

d.status||

"Unknown";

report[s]=(report[s]||0)+1;

});

return report;

}



//======================================================
// DONOR REPORT
//======================================================

repeatDonors(){

const users={};

this.data.forEach(d=>{

const mobile=

d.mobile||

"";

if(!users[mobile]){

users[mobile]=[];

}

users[mobile].push(d);

});

return Object.values(users)

.filter(x=>x.length>1);

}



//======================================================
// TODAY
//======================================================

today(){

const today=

new Date()

.toDateString();

return this.data.filter(d=>{

if(!d.createdAt?.seconds)

return false;

return new Date(

d.createdAt.seconds*1000

)

.toDateString()

===today;

});

}



//======================================================
// THIS MONTH
//======================================================

thisMonth(){

const now=new Date();

return this.data.filter(d=>{

if(!d.createdAt?.seconds)

return false;

const dt=new Date(

d.createdAt.seconds*1000

);

return dt.getMonth()

===now.getMonth()

&&

dt.getFullYear()

===now.getFullYear();

});

}



//======================================================
// SUMMARY
//======================================================

summary(){

let total=0;

let highest=0;

let lowest=999999999;

this.data.forEach(d=>{

const amt=

Number(d.amount||0);

total+=amt;

if(amt>highest)

highest=amt;

if(amt<lowest)

lowest=amt;

});

return{

donations:this.data.length,

amount:total,

average:

this.data.length

?

total/

this.data.length

:0,

highest,

lowest

};

}

}



//======================================================
// CREATE INSTANCE
//======================================================

const reportEngine=

new Reports(

donations

);



//======================================================
// BUTTONS
//======================================================

window.showDailyReport=()=>{

console.table(

reportEngine.daily()

);

};



window.showMonthlyReport=()=>{

console.table(

reportEngine.monthly()

);

};



window.showCampaignReport=()=>{

console.table(

reportEngine.campaign()

);

};



window.showSummary=()=>{

console.table(

reportEngine.summary()

);

};



window.showRepeatDonors=()=>{

console.table(

reportEngine.repeatDonors()

);

};
