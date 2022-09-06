const toolTips = document.querySelectorAll(".tt");

toolTips.forEach((t) => {
  new bootstrap.Tooltip(t);
});
