import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST requests only" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Please enter a video prompt." });
    }

    const video = await client.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: prompt.trim()
    });

    const buffer = Buffer.from(await video.arrayBuffer());

    res.setHeader("Content-Type", video.type || "video/mp4");
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Video generation error:", error);

    return res.status(500).json({
      error: error?.message || "Video generation failed."
    });
  }
}
