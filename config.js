//======================================================
// config.js
// Module 11
// Enterprise Configuration
//======================================================

const CONFIG={

//======================================================
// APP
//======================================================

APP_NAME:"Anjuman Donation Admin",

VERSION:"2.0.0",

AUTHOR:"AMA Media",

DEFAULT_THEME:"light",

LANGUAGE:"en-IN",

CURRENCY:"INR",

TIMEZONE:"Asia/Kolkata",



//======================================================
// TABLE
//======================================================

TABLE:{

ROWS_PER_PAGE:25,

AVAILABLE_ROWS:[25,50,100,250],

AUTO_SAVE_COLUMNS:true,

STICKY_HEADER:true,

MULTI_SORT:true,

COLUMN_RESIZE:true,

REMEMBER_PAGE:true

},



//======================================================
// REALTIME
//======================================================

REALTIME:{

ENABLE:true,

AUTO_REFRESH:30000,

CONNECTION_CHECK:5000,

SHOW_NOTIFICATIONS:true

},



//======================================================
// DASHBOARD
//======================================================

DASHBOARD:{

SHOW_AVERAGE:true,

SHOW_HIGHEST:true,

SHOW_LOWEST:true,

SHOW_REPEAT_DONORS:true,

SHOW_MONTHLY:true,

SHOW_TODAY:true

},



//======================================================
// EXPORT
//======================================================

EXPORT:{

CSV:true,

EXCEL:true,

PDF:true,

PRINT:true,

DEFAULT_FILENAME:"Donation_Report"

},



//======================================================
// FIREBASE
//======================================================

FIREBASE:{

COLLECTION:"donations",

ENABLE_BATCH:true,

ENABLE_TRANSACTION:true,

ENABLE_HISTORY:true

},



//======================================================
// STATUS
//======================================================

STATUS:{

INITIATED:"Initiated",

SUBMITTED:"Payment Submitted",

VERIFIED:"Verified",

REJECTED:"Rejected"

},



//======================================================
// COLORS
//======================================================

COLORS:{

PRIMARY:"#0d6efd",

SUCCESS:"#198754",

WARNING:"#ffc107",

DANGER:"#dc3545",

INFO:"#0dcaf0"

},



//======================================================
// CHARTS
//======================================================

CHARTS:{

ANIMATION:true,

LEGEND:true,

RESPONSIVE:true

},



//======================================================
// SECURITY
//======================================================

SECURITY:{

CONFIRM_DELETE:true,

CONFIRM_VERIFY:true,

CONFIRM_REJECT:true,

ENABLE_AUDIT_LOG:true

},



//======================================================
// SETTINGS STORAGE
//======================================================

STORAGE:{

THEME:"theme",

ROWS:"rows",

COLUMNS:"columns",

FILTERS:"filters"

}

};



//======================================================
// GET
//======================================================

CONFIG.get=function(path){

const keys=path.split(".");

let value=this;

for(const key of keys){

value=value[key];

if(value===undefined)

return null;

}

return value;

};



//======================================================
// SET
//======================================================

CONFIG.set=function(path,value){

const keys=path.split(".");

let obj=this;

while(keys.length>1){

obj=obj[keys.shift()];

}

obj[keys[0]]=value;

};



//======================================================
// FREEZE
//======================================================

Object.freeze(CONFIG);

window.CONFIG=CONFIG;

console.log(

CONFIG.APP_NAME,

CONFIG.VERSION,

"Loaded"

);
