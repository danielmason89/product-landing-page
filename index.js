const toolTips = document.querySelectorAll(".tt");
const form = document.querySelector(".quiz-form");
const correctAnswers = ["B", "B", "B", "B"];
const result = document.querySelector(".result");

toolTips.forEach((t) => {
  new bootstrap.Tooltip(t);
});
