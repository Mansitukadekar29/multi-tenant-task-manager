export const applyTheme = () => {
  const tenant = JSON.parse(localStorage.getItem("tenant"));

  if (!tenant || !tenant.theme_color) return;

  document.body.style.background = `linear-gradient(
    135deg,
    ${tenant.theme_color}20,
    #ffffff
  )`;
};