// Ілля Лазарев
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const DATA_FILE = path.join(__dirname, 'data.json');

let dogs = [];
try {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  dogs = JSON.parse(raw);
} catch {
  dogs = [];
}

function saveDogs() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(dogs, null, 2), 'utf8');
}

app.post('/api/adopt', (req, res) => {
  const { dogId, adopter } = req.body;
  if (!dogId || !adopter?.name)
    return res.status(400).json({ error: 'dogId та adopter.name обовʼязкові' });

  const dog = dogs.find(d => Number(d.id) === Number(dogId));
  if (!dog) return res.status(404).json({ error: 'Собаку не знайдено' });
  if (dog.adopted) return res.status(400).json({ error: 'Собака вже усиновлена' });

  dog.adopted = true;
  dog.adoptedBy = adopter;
  dog.adoptedAt = new Date().toISOString();

  saveDogs();
  res.json({ success: true, dog });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API для усиновлення працює: http://localhost:${PORT}`));
