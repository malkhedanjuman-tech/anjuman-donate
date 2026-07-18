//======================================================
// realtime.js
// Module 6
// Firestore Real-Time Sync Engine
//======================================================

import {
db
} from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let unsubscribeRealtime=null;

let lastSnapshotSize=0;

//======================================================
// START REALTIME
//======================================================

function startRealtime(){

    if(unsubscribeRealtime){

        unsubscribeRealtime();

    }

    const q=query(

        collection(db,"donations"),

        orderBy("createdAt","desc")

    );

    unsubscribeRealtime=onSnapshot(

        q,

        snapshot=>{

            donations=[];

            snapshot.forEach(doc=>{

                donations.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            filtered=[...donations];

            calculateDashboard();

            calculateAnalytics();

            renderCharts();

            renderTable();

            updateRefreshTime();

            detectRealtimeEvents(snapshot);

        },

        err=>{

            console.error(err);

            toastMessage("Realtime Disconnected");

        }

    );

}

//======================================================
// DETECT EVENTS
//======================================================

function detectRealtimeEvents(snapshot){

    if(snapshot.size>lastSnapshotSize){

        toastMessage("New Donation Received");

    }

    if(snapshot.size<lastSnapshotSize){

        toastMessage("Donation Removed");

    }

    lastSnapshotSize=snapshot.size;

}

//======================================================
// STOP
//======================================================

function stopRealtime(){

    if(unsubscribeRealtime){

        unsubscribeRealtime();

        unsubscribeRealtime=null;

    }

}

//======================================================
// RECONNECT
//======================================================

window.addEventListener(

"online",

()=>{

    toastMessage("Realtime Connected");

    startRealtime();

}

);

window.addEventListener(

"offline",

()=>{

    toastMessage("Realtime Paused");

    stopRealtime();

}

);

//======================================================
// PAGE VISIBILITY
//======================================================

document.addEventListener(

"visibilitychange",

()=>{

    if(document.hidden){

        stopRealtime();

    }

    else{

        startRealtime();

    }

});

//======================================================
// CONNECTION STATUS
//======================================================

function updateConnectionBadge(){

    let badge=document.getElementById("connectionStatus");

    if(!badge) return;

    badge.innerHTML=navigator.onLine

        ? "🟢 Live"

        : "🔴 Offline";

}

setInterval(

updateConnectionBadge,

2000

);

//======================================================
// AUTO START
//======================================================

startRealtime();

updateConnectionBadge();

//======================================================
// MANUAL RELOAD
//======================================================

document

.getElementById("refreshBtn")

.onclick=()=>{

    stopRealtime();

    startRealtime();

    toastMessage("Reloaded");

};

//======================================================
// LIVE COUNTERS
//======================================================

setInterval(()=>{

    document

    .getElementById("totalDonations")

    .innerHTML=donations.length;

},1000);

//======================================================
// CLEANUP
//======================================================

window.addEventListener(

"beforeunload",

()=>{

    stopRealtime();

});

console.log("Realtime Engine Ready");
