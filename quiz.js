form.addEventListener("submit", (e) => {
  e.preventDefault();

  let score = 0;
  const userAnswers = [
    form.q1.value,
    form.q2.value,
    form.q3.value,
    form.q4.value,
  ];
  // Check answer
  userAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += 25;
    }
  });
  // show result
  scrollTo(0, 0);

  result.classList.remove("d-none");
  let userResult = 0;
  const timer = setInterval(() => {
    {
      result.querySelector("span").textContent = `${userResult}%`;
      if (userResult === score) {
        clearInterval(timer);
      } else {
        userResult++;
      }
    }
  }, 10);
});
