const form = document.getElementById("generatorForm");
const promptInput = document.getElementById("prompt");
const charCount = document.getElementById("charCount");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("spinner");
const resultCard = document.getElementById("resultCard");
const resultPrompt = document.getElementById("resultPrompt");
const previewText = document.getElementById("previewText");
const themeBtn = document.getElementById("themeBtn");

promptInput.addEventListener("input", () => {
  charCount.textContent = promptInput.value.length;
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prompt = promptInput.value.trim();
  const style = document.getElementById("style").value;
  const duration = document.getElementById("duration").value;
  const ratio = document.getElementById("ratio").value;

  if (!prompt) return;

  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 1200));

  resultPrompt.textContent =
    `${prompt} | Style: ${style} | Duration: ${duration}s | Ratio: ${ratio}`;

  previewText.textContent =
    "Website front end is working. Connect a secure AI video-generation backend for real video generation.";

  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

  setLoading(false);
});

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Preparing..." : "Generate Video";
  spinner.classList.toggle("hidden", !isLoading);
}
