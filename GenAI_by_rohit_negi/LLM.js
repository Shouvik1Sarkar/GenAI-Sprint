//AIzaSyDE6dk9Laoem0YUzOztnI1a8Tuw7dSdGVk
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDE6dk9Laoem0YUzOztnI1a8Tuw7dSdGVk",
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
