//AIzaSyDE6dk9Laoem0YUzOztnI1a8Tuw7dSdGVk

import readlineSync from "readline-sync";

import { configDotenv } from "dotenv";

import { GoogleGenAI } from "@google/genai";

configDotenv({ path: "../../.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.AI_KEY,
});
const history = [];

async function chatting(prompt) {
  history.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
  });
  history.push({
    role: "user",
    parts: [{ text: response.text }],
  });
  console.log("AI assistant--->", response.text);
}

async function main() {
  const prompt = readlineSync.question("User--->");
  await chatting(prompt);
  main();
}

await main();
