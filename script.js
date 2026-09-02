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

let currentVideoUrl = null;

promptInput.addEventListener("input", () => {
  charCount.textContent = promptInput.value.length;
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent =
    document.body.classList.contains("light") ? "☀️" : "🌙";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prompt = promptInput.value.trim();
  const style = document.getElementById("style").value;
  const duration = document.getElementById("duration").value;
  const ratio = document.getElementById("ratio").value;

  if (!prompt) return;

  setLoading(true);

  previewText.textContent = "Generating your AI video...";
  resultCard.classList.remove("hidden");

  try {
    const fullPrompt =
      `${prompt}. Style: ${style}. Duration: ${duration}. Aspect ratio: ${ratio}.`;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: fullPrompt
      })
    });

    if (!response.ok) {
      let message = "Video generation failed.";

      try {
        const errorData = await response.json();
        if (errorData.error) message = errorData.error;
      } catch (e) {}

      throw new Error(message);
    }

    const videoBlob = await response.blob();

    if (currentVideoUrl) {
      URL.revokeObjectURL(currentVideoUrl);
    }

    currentVideoUrl = URL.createObjectURL(videoBlob);

    resultPrompt.textContent =
      `${prompt} | Style: ${style} | Duration: ${duration}s | Ratio: ${ratio}`;

    previewText.textContent = "";

    const video = document.createElement("video");
    video.src = currentVideoUrl;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.maxWidth = "100%";
    video.style.borderRadius = "14px";

    previewText.appendChild(video);

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    console.error(error);

    previewText.textContent =
      "Error: " + (error.message || "Video generation failed.");

    resultCard.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Generating..." : "Generate Video";
  spinner.classList.toggle("hidden", !isLoading);
}
