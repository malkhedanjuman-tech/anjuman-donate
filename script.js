import {
    db,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";

const form = document.getElementById("donationForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const campaign = document.getElementById("campaign").value;

    // Donation Reference
    const donationRef =
        "MDA-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

    try {

        await addDoc(collection(db, "donations"), {

            donationRef,
            name,
            mobile,
            amount: Number(amount),
            campaign,

            status: "Initiated",

            createdAt: serverTimestamp()

        });

        const upi = "makbarali.005@oksbi";
        const payee = "Anjuman";

        const note = `${campaign} | Ref:${donationRef}`;

        const params = new URLSearchParams({
    pa: upi,
    pn: payee,
    am: amount,
    cu: "INR",
    tn: note
});

const upiLink = `upi://pay?${params.toString()}`;

console.log(upiLink);

alert(upiLink);

window.open(upiLink, "_blank");

    }
    catch(err){

        console.error(err);

        alert("Unable to save donation. Please try again.");

    }

});
