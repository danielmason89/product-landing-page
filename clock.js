const clock = document.querySelector(".clock");

const tick = () => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  const html = `
  <span>${h}</span> :
  <span>${m}</span>
  `;

  clock.innerHTML = html;
};

setInterval(tick, 1000);
