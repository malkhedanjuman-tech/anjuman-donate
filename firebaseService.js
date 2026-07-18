//======================================================
// firebaseService.js
// Module 9
// Enterprise Firestore Service Layer
//======================================================

import {
db
} from "./firebase.js";

import{
collection,
doc,
getDoc,
getDocs,
setDoc,
addDoc,
updateDoc,
deleteDoc,
writeBatch,
runTransaction,
query,
orderBy,
where,
limit
}from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

class FirebaseService{

constructor(){

this.collection="donations";

}

//======================================================
// COLLECTION
//======================================================

col(){

return collection(

db,

this.collection

);

}

//======================================================
// GET ALL
//======================================================

async getAll(){

const q=query(

this.col(),

orderBy(

"createdAt",

"desc"

)

);

const snap=

await getDocs(q);

return snap.docs.map(d=>({

id:d.id,

...d.data()

}));

}

//======================================================
// GET ONE
//======================================================

async get(id){

const ref=doc(

db,

this.collection,

id

);

const snap=

await getDoc(ref);

if(!snap.exists())

return null;

return{

id:snap.id,

...snap.data()

};

}

//======================================================
// CREATE
//======================================================

async create(data){

data.createdAt=new Date();

data.updatedAt=new Date();

return await addDoc(

this.col(),

data

);

}

//======================================================
// UPDATE
//======================================================

async update(id,data){

data.updatedAt=new Date();

await updateDoc(

doc(

db,

this.collection,

id

),

data

);

}

//======================================================
// DELETE
//======================================================

async remove(id){

await deleteDoc(

doc(

db,

this.collection,

id

)

);

}

//======================================================
// VERIFY
//======================================================

async verify(id,admin){

await this.update(id,{

status:"Verified",

verifiedBy:admin,

verifiedAt:new Date()

});

await this.addHistory(

id,

"Verified",

admin

);

}

//======================================================
// REJECT
//======================================================

async reject(id,admin){

await this.update(id,{

status:"Rejected",

rejectedBy:admin,

rejectedAt:new Date()

});

await this.addHistory(

id,

"Rejected",

admin

);

}

//======================================================
// RESET
//======================================================

async reset(id){

await this.update(id,{

status:"Initiated"

});

await this.addHistory(

id,

"Initiated",

"System"

);

}

//======================================================
// STATUS HISTORY
//======================================================

async addHistory(

id,

status,

user

){

const donation=

await this.get(id);

const history=

donation.statusHistory||[];

history.push({

status,

user,

time:new Date()

});

await this.update(

id,

{

statusHistory:history

}

);

}

//======================================================
// BULK UPDATE
//======================================================

async bulkUpdate(

ids,

data

){

const batch=

writeBatch(db);

ids.forEach(id=>{

batch.update(

doc(

db,

this.collection,

id

),

{

...data,

updatedAt:new Date()

}

);

});

await batch.commit();

}

//======================================================
// BULK DELETE
//======================================================

async bulkDelete(ids){

const batch=

writeBatch(db);

ids.forEach(id=>{

batch.delete(

doc(

db,

this.collection,

id

)

);

});

await batch.commit();

}

//======================================================
// BULK VERIFY
//======================================================

async bulkVerify(ids){

await this.bulkUpdate(

ids,

{

status:"Verified",

verifiedAt:new Date()

}

);

}

//======================================================
// CHANGE CAMPAIGN
//======================================================

async bulkCampaign(

ids,

campaign

){

await this.bulkUpdate(

ids,

{

campaign

}

);

}

//======================================================
// TRANSACTION
//======================================================

async editAmount(

id,

amount

){

await runTransaction(

db,

async tx=>{

const ref=doc(

db,

this.collection,

id

);

const snap=

await tx.get(ref);

if(!snap.exists())

throw "Not Found";

tx.update(

ref,

{

amount,

updatedAt:new Date()

}

);

}

);

}

//======================================================
// SEARCH
//======================================================

async searchReference(ref){

const q=query(

this.col(),

where(

"donationRef",

"==",

ref

),

limit(1)

);

const snap=

await getDocs(q);

return snap.docs.map(x=>({

id:x.id,

...x.data()

}));

}

//======================================================
// PENDING
//======================================================

async pending(){

const q=query(

this.col(),

where(

"status",

"!=",

"Verified"

)

);

const snap=

await getDocs(q);

return snap.docs.map(d=>({

id:d.id,

...d.data()

}));

}

//======================================================
// VERIFIED
//======================================================

async verified(){

const q=query(

this.col(),

where(

"status",

"==",

"Verified"

)

);

const snap=

await getDocs(q);

return snap.docs.map(d=>({

id:d.id,

...d.data()

}));

}

}

const firebaseService=

new FirebaseService();

window.firebaseService=

firebaseService;

console.log(

"Firebase Service Ready"

);
