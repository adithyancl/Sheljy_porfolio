const form = document.getElementById("consultation-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      goal: form.goal.value,
      message: form.message.value,
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwWZpAqpPKgHyzDogkO5PrPY5_ZXkPtBRAvW2M1-ctl_HkGankD106GcEsJD2jxpr5xXg/exec", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log(result);

      alert("Application submitted successfully!");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Submission failed.");
    }
  });
}