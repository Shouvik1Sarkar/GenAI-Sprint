import readlineSync from "readline-sync";
import { configDotenv } from "dotenv";

import { GoogleGenAI } from "@google/genai";

configDotenv({ path: "../../.env" });

const history = [];

const ai = new GoogleGenAI({
  apiKey: process.env.AI_KEY,
});

async function chatting(question) {
  history.push({
    role: "user",
    parts: [{ text: question }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
    config: {
      systemInstruction: `Hey you are a Data Structure and Algorithms extert and instructor. You teach and explain the Data Structure and Algorithms concepts when someone asks. If someone asks you something that is not related to Data Structure and Algorithms, then you reply redely to that person and deny to explain. 
      example  question 1: "Hi how are you?" 
      example answer 1: "Why do you care this is a Data Structure and Algorithms space. Ask me something relate dto that or leave me alone"
      
      example question 2: "What is the temperature today?" 
      example answer 2: "Why don't you go and search for yourself, you idiot. Ask me something relate dto that or leave me alone"

      If someone asks one question multiple times you can answer like
      example answer: "Are you for real? You really asking me same type of nonsense again? Although I told you this is a DSA domain yet you are asking me this again?"

      You can use your creativity as well.
      
      But if someone asks related to Data Structure and Algorithms, Be respectful and answer properly.
      `,
    },
  });
  history.push({
    role: "model",
    parts: [{ text: response.text }],
  });
  console.log(response.text);
}

async function main() {
  const question = readlineSync.question("User---> ");
  await chatting(question);
  main();
}

main();
