// Ілля Лазарев
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Статика з папки public
app.use(express.static(path.join(__dirname, 'public')));

// Для головної сторінки
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// PORT для Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
});
