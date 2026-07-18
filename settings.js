//======================================================
// settings.js
// Module 12
// Enterprise Settings Manager
//======================================================

window.Settings=new(class{

constructor(){

this.keys={

theme:"admin_theme",

filters:"admin_filters",

pageSize:"admin_page_size",

columns:"admin_columns",

dashboard:"admin_dashboard",

compact:"admin_compact_mode",

animations:"admin_animations",

autoRefresh:"admin_auto_refresh"

};

this.load();

}

//======================================================
// LOAD
//======================================================

load(){

this.theme=

localStorage.getItem(this.keys.theme)||"light";

this.compact=

localStorage.getItem(this.keys.compact)==="true";

this.animations=

localStorage.getItem(this.keys.animations)!=="false";

this.autoRefresh=

Number(

localStorage.getItem(

this.keys.autoRefresh

)||30000

);

this.applyTheme();

this.applyCompact();

this.applyAnimations();

}

//======================================================
// SAVE
//======================================================

save(key,value){

localStorage.setItem(key,value);

}

//======================================================
// THEME
//======================================================

setTheme(theme){

this.theme=theme;

this.save(

this.keys.theme,

theme

);

this.applyTheme();

toastMessage(

"Theme Updated"

);

}

applyTheme(){

document.body.setAttribute(

"data-theme",

this.theme

);

}

//======================================================
// TOGGLE THEME
//======================================================

toggleTheme(){

this.setTheme(

this.theme==="dark"

?

"light"

:

"dark"

);

}

//======================================================
// COMPACT MODE
//======================================================

setCompact(value){

this.compact=value;

this.save(

this.keys.compact,

value

);

this.applyCompact();

}

applyCompact(){

document.body.classList.toggle(

"compact",

this.compact

);

}

//======================================================
// ANIMATIONS
//======================================================

setAnimations(value){

this.animations=value;

this.save(

this.keys.animations,

value

);

this.applyAnimations();

}

applyAnimations(){

document.body.classList.toggle(

"no-animation",

!this.animations

);

}

//======================================================
// AUTO REFRESH
//======================================================

setAutoRefresh(ms){

this.autoRefresh=ms;

this.save(

this.keys.autoRefresh,

ms

);

if(window.autoRefreshTimer)

clearInterval(

window.autoRefreshTimer

);

window.autoRefreshTimer=

setInterval(

()=>{

if(typeof loadDonations==="function")

loadDonations();

},

ms

);

}

//======================================================
// PAGE SIZE
//======================================================

setPageSize(size){

localStorage.setItem(

this.keys.pageSize,

size

);

rowsPerPage=size;

renderTable();

}

//======================================================
// SAVE FILTERS
//======================================================

saveFilters(filters){

localStorage.setItem(

this.keys.filters,

JSON.stringify(filters)

);

}

//======================================================
// LOAD FILTERS
//======================================================

loadFilters(){

const f=

localStorage.getItem(

this.keys.filters

);

if(!f)

return null;

return JSON.parse(f);

}

//======================================================
// RESET FILTERS
//======================================================

resetFilters(){

localStorage.removeItem(

this.keys.filters

);

}

//======================================================
// DASHBOARD
//======================================================

saveDashboard(config){

localStorage.setItem(

this.keys.dashboard,

JSON.stringify(config)

);

}

loadDashboard(){

const c=

localStorage.getItem(

this.keys.dashboard

);

return c

?

JSON.parse(c)

:

null;

}

//======================================================
// RESET ALL
//======================================================

reset(){

Object.values(this.keys)

.forEach(k=>{

localStorage.removeItem(k);

});

location.reload();

}

//======================================================
// EXPORT SETTINGS
//======================================================

export(){

const data={};

Object.values(this.keys)

.forEach(k=>{

data[k]=

localStorage.getItem(k);

});

Utils.download(

"admin-settings.json",

new Blob(

[

JSON.stringify(

data,

null,

2

)

],

{

type:"application/json"

}

)

);

}

//======================================================
// IMPORT SETTINGS
//======================================================

import(file){

const reader=

new FileReader();

reader.onload=e=>{

const data=

JSON.parse(

e.target.result

);

Object.entries(data)

.forEach(([k,v])=>{

localStorage.setItem(

k,

v

);

});

location.reload();

};

reader.readAsText(file);

}

//======================================================
// KEYBOARD SHORTCUTS
//======================================================

bindShortcuts(){

document.addEventListener(

"keydown",

e=>{

if(e.ctrlKey&&e.key==="d"){

e.preventDefault();

this.toggleTheme();

}

if(e.ctrlKey&&e.key==="m"){

e.preventDefault();

this.setCompact(

!this.compact

);

}

if(e.ctrlKey&&e.key==="r"){

e.preventDefault();

loadDonations();

}

}

);

}

})();

//======================================================
// INIT
//======================================================

Settings.bindShortcuts();

console.log(

"Settings Manager Ready"

);
