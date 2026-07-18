//======================================================
// app.js
// Module 14
// Enterprise Application Bootstrap
//======================================================

class App{

constructor(){

this.version="2.0.0";
this.initialized=false;
this.modules={};
this.intervals=[];
this.listeners=[];
this.startTime=performance.now();

}

//======================================================
// INIT
//======================================================

async init(){

if(this.initialized)
return;

console.log("Initializing Admin Panel...");

try{

await this.loadModules();

this.registerGlobalEvents();

this.initializeSettings();

this.initializeRealtime();

await this.initializeData();

this.initializeCharts();

this.initializeDashboard();

this.initializePerformanceMonitor();

this.initializeOfflineQueue();

this.initializeCleanup();

this.initialized=true;

console.log(

`Application Ready (${this.version})`

);

toastMessage(

"Admin Panel Ready"

);

}
catch(error){

console.error(error);

this.handleError(error);

}

}

//======================================================
// MODULES
//======================================================

async loadModules(){

this.modules={

firebaseService:window.firebaseService,

activityLog:window.activityLog,

settings:window.Settings,

utils:window.Utils

};

}

//======================================================
// DATA
//======================================================

async initializeData(){

if(typeof loadDonations==="function"){

await loadDonations();

}

}

//======================================================
// DASHBOARD
//======================================================

initializeDashboard(){

if(typeof updateDashboard==="function"){

updateDashboard();

}

}

//======================================================
// CHARTS
//======================================================

initializeCharts(){

if(typeof renderCharts==="function"){

renderCharts();

}

}

//======================================================
// SETTINGS
//======================================================

initializeSettings(){

if(window.Settings){

Settings.load();

}

}

//======================================================
// REALTIME
//======================================================

initializeRealtime(){

if(typeof initializeRealtime==="function"){

initializeRealtime();

}

}

//======================================================
// GLOBAL EVENTS
//======================================================

registerGlobalEvents(){

const resize=()=>{

if(typeof renderCharts==="function"){

renderCharts();

}

};

window.addEventListener(

"resize",

resize

);

this.listeners.push({

event:"resize",

handler:resize

});

const online=()=>{

toastMessage("Connection Restored");

};

const offline=()=>{

toastMessage("Offline Mode");

};

window.addEventListener(

"online",

online

);

window.addEventListener(

"offline",

offline

);

this.listeners.push({

event:"online",

handler:online

});

this.listeners.push({

event:"offline",

handler:offline

});

}

//======================================================
// ERROR
//======================================================

handleError(error){

console.error(

"Application Error",

error

);

toastMessage(

"Unexpected Error"

);

}

//======================================================
// PERFORMANCE
//======================================================

initializePerformanceMonitor(){

const timer=setInterval(()=>{

const memory=

performance.memory;

if(memory){

console.log(

"Memory:",

Math.round(

memory.usedJSHeapSize/

1024/

1024

),

"MB"

);

}

},60000);

this.intervals.push(timer);

}

//======================================================
// OFFLINE QUEUE
//======================================================

initializeOfflineQueue(){

window.addEventListener(

"online",

()=>{

const queue=

JSON.parse(

localStorage.getItem(

"offlineQueue"

)||"[]"

);

if(queue.length){

console.log(

"Syncing Offline Queue"

);

localStorage.removeItem(

"offlineQueue"

);

}

});

}

//======================================================
// DESTROY
//======================================================

destroy(){

this.intervals.forEach(

clearInterval

);

this.listeners.forEach(x=>{

window.removeEventListener(

x.event,

x.handler

);

});

console.log(

"Application Destroyed"

);

}

//======================================================
// REFRESH
//======================================================

async refresh(){

if(typeof loadDonations==="function"){

await loadDonations();

}

if(typeof updateDashboard==="function"){

updateDashboard();

}

if(typeof renderCharts==="function"){

renderCharts();

}

}

//======================================================
// RESTART
//======================================================

async restart(){

this.destroy();

this.initialized=false;

await this.init();

}

//======================================================
// ABOUT
//======================================================

about(){

console.table({

Application:"Donation Admin",

Version:this.version,

Initialized:this.initialized,

Started:new Date().toLocaleString(),

Runtime:

Math.round(

performance.now()-this.startTime

)+" ms"

});

}

}

const app=new App();

window.App=app;

//======================================================
// GLOBAL ERROR HANDLER
//======================================================

window.onerror=function(

message,

source,

line,

column,

error

){

console.error(

message,

source,

line,

column,

error

);

toastMessage(

"Application Error"

);

return false;

};

//======================================================
// UNHANDLED PROMISES
//======================================================

window.addEventListener(

"unhandledrejection",

e=>{

console.error(e.reason);

toastMessage(

"Unhandled Promise Error"

);

});

//======================================================
// START APPLICATION
//======================================================

document.addEventListener(

"DOMContentLoaded",

()=>{

App.init();

});

console.log(

"Bootstrap Ready"

);
