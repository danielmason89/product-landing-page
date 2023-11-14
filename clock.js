const clock = document.querySelector(".clock");
const now = new Date();

const tick = () => {
  const now = new Date();

  const html = `
  <span>${dateFns.format(now, "MMMM dddd Do / YY")}</span>
  <span>${dateFns.format(now, "h:mm a")}</span>
  `;

  clock.innerHTML = html;
};

setInterval(tick, 1000);
