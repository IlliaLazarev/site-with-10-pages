// Ілля Лазарев
const bg = document.querySelector('.water-bg');

document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  bg.style.background = `radial-gradient(circle at ${x}% ${y}%, #ebe98e, #f8bc84, #f3a45b)`;
});
