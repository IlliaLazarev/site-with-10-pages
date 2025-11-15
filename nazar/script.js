/* === Цьось Назар === */
document.addEventListener('DOMContentLoaded', () => {
  const dogsContainer = document.getElementById('dogs');
  const searchInput = document.getElementById('searchDog');
  if (!dogsContainer) return;

  let allDogs = [];

  fetch('/data.json')
    .then(r => {
      if (!r.ok) throw new Error('Не вдалося завантажити data.json: ' + r.status);
      return r.json();
    })
    .then(dogs => {
      allDogs = dogs;
      renderDogs(allDogs);
    })
    .catch(err => {
      console.error('Помилка завантаження собак:', err);
      dogsContainer.innerHTML = '<div class="card small">❌ Не вдалося завантажити собак</div>';
    });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = allDogs.filter(d => d.name.toLowerCase().includes(query));
      renderDogs(filtered);
    });
  }

  function renderDogs(dogs) {
    if (!dogs || dogs.length === 0) {
      dogsContainer.innerHTML = `<div class="card small">🐾 Нічого не знайдено</div>`;
      return;
    }
    dogsContainer.innerHTML = dogs.map(renderDogCard).join('');
    addAdoptListeners();
  }
});

function renderDogCard(d) {
  const imgSrc = d.image || 'images/default-dog.png';
  const adopted = d.adopted
    ? `<div class="adopted">🐾 Усиновлено</div>`
    : `<button class="adopt-btn" data-id="${d.id}">Усиновити</button>`;
  return `
    <div class="card dog" id="dog-${d.id}">
      <img src="${imgSrc}" alt="${escapeHtml(d.name)}" class="dog-photo">
      <h4>${escapeHtml(d.name)}</h4>
      <div class="small">${escapeHtml(d.description || '')}</div>
      <div class="small">Вік: ${d.age || ''}</div>
      ${adopted}
    </div>
  `;
}

function addAdoptListeners() {
  document.querySelectorAll('.adopt-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const dogId = btn.dataset.id;
      if (!dogId) {
        console.error('Не знайдено dogId на кнопці', btn);
        alert('Неможливо усиновити — відсутній ідентифікатор собаки.');
        return;
      }

      const name = prompt('Введіть ваше ім’я:');
      if (!name) return;

      const phone = prompt('Ваш телефон (необовʼязково):');

      try {
        const resp = await fetch('/api/adopt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dogId, adopter: { name, phone } })
        });

        if (!resp.ok) {
          let errText = `HTTP ${resp.status}`;
          try {
            const errJson = await resp.json();
            errText = errJson.error || JSON.stringify(errJson);
          } catch {
            try { errText = await resp.text(); } catch {}
          }
          throw new Error(errText);
        }

        const res = await resp.json().catch(() => ({ error: 'Некоректна відповідь сервера' }));

        if (res.success) {
          const card = document.getElementById(`dog-${dogId}`);
          if (card) {
            const adoptBtn = card.querySelector('.adopt-btn');
            if (adoptBtn) adoptBtn.outerHTML = `<div class="adopted">🐾 Усиновлено</div>`;
          }
          alert('Дякуємо! Заявка на усиновлення успішно відправлена.');
        } else {
          throw new Error(res.error || 'Сервер повідомив про помилку при усиновленні.');
        }

      } catch (err) {
        console.error('Помилка при усиновленні:', err);
        alert('Помилка при усиновленні: ' + (err.message || 'перевірте консоль та сервер'));
      }
    });
  });
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
