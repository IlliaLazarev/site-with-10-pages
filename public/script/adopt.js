// Ілля Лазарев
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const dogs = await fetch("../data/data.json").then(r => r.json());
  const dog = dogs.find(d => String(d.id) === id);

  const info = document.getElementById("dog-details");
  const form = document.getElementById("adoptForm");

  if (!dog) {
    info.innerHTML = "<p>Собаку не знайдено 🐾</p>";
    form.style.display = "none";
    return;
  }

  info.innerHTML = `
    <img src="./static/img/${dog.image}" alt="${dog.name}" class="dog-photo" />
    <h2>${dog.name}</h2>
    <p>${dog.description}</p>
    <p><strong>Вік:</strong> ${dog.age}</p>
  `;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const adopter = {
      name: form.querySelector("#name").value,
      phone: form.querySelector("#phone").value,
      email: form.querySelector("#email").value
    };

    const res = await fetch("/api/adopt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dogId: id, adopter })
    }).then(r => r.json());

    if (res.success) {
      form.innerHTML = `
        <div class="success">
          ✅ Дякуємо, ${adopter.name}! Ви усиновили ${dog.name}.
        </div>`;
    } else {
      alert(res.error || "Помилка при усиновленні");
    }
  });
});
  