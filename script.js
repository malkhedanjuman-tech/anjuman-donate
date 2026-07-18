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

        window.location.href =
            `payment.html?ref=${encodeURIComponent(donationRef)}&amount=${encodeURIComponent(amount)}&campaign=${encodeURIComponent(campaign)}`;

    } catch (err) {

        console.error(err);
        alert("Unable to save donation. Please try again.");

    }

});
