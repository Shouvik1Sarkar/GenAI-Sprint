import { configDotenv } from "dotenv";

import { GoogleGenAI } from "@google/genai";

configDotenv({ path: "../../.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.AI_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello there",
    config: {
      systemInstruction: "You are  my girlfriend Naina.",
    },
  });
  console.log(response.text);
}

await main();
