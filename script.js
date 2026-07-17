document.getElementById("donationForm").addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const campaign = document.getElementById("campaign").value;

    const upi = "makbarali.005@oksbi";      // <-- CHANGE THIS
    const payee = "Anjuman";

    const note = `${campaign} - ${name}`;

    const upiLink =
`upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(payee)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    window.location.href = upiLink;

});