import { configDotenv } from "dotenv";
import { FunctionResponse, GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

configDotenv({ path: "../../.env" });

//#########################################################################################//
//#                           TOOLS / FUNCTIONS for AI Agents:                            #//
//#########################################################################################//

function crypto({ currency }) {
  //   const data = await fetch(
  //     `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currency}`
  //   );
  //   const value = await data.json();
  //   return value;
  return fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currency}`
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      return data;
    });
}

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
  if (num < 2) return false;

  for (let i = 2; i <= Math.sqrt(num); i++) if (num % i == 0) return false;

  return true;
}

//#########################################################################################//
//#                           TOOL DESCRIPTION                                            #//
//#########################################################################################//

const cryptoFunctionDeclaration = {
  name: "crypto",
  description:
    "takes Crypto Currency name as parameter. Fetches the information using the API URL. And return the value of the crypto currency asked by user.",
  parameters: {
    type: "object",
    properties: {
      currency: {
        type: "string",
        description:
          "Name of the crypto currency, the user wants to know the price of. Example Question: what is the price of bitcoin today?",
      },
    },
    required: ["currency"],
  },
};
const sumFunctionDeclaration = {
  name: "sum",
  description:
    "takes two numbers as parameters. Runs the functions and calculates the sum of two numbers proided",
  parameters: {
    type: "object",
    properties: {
      num1: {
        type: "number",
        description: "First number of the calculation",
      },
      num2: {
        type: "number",
        description: "2nd number of the calculation",
      },
    },
    required: ["num1", "num2"],
  },
};
const primeFunctionDeclaration = {
  name: "prime",
  description:
    "takes a number as a parameter and returns if the number is prime",
  parameters: {
    type: "object",
    properties: {
      num: {
        type: "number",
        description: "The number, the user wants to know if it's prime or not.",
      },
    },
    required: ["num"],
  },
};

const ai = new GoogleGenAI({ apiKey: process.env.AI_KEY });

const toolFunctions = {
  crypto,
  sum,
  prime,
};
const tools = [
  cryptoFunctionDeclaration,
  sumFunctionDeclaration,
  primeFunctionDeclaration,
];

const history = [];

async function myAgent(question) {
  history.push({
    role: "user",
    parts: [{ text: question }],
  });
  while (true) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
          systemInstruction: `You are an AI agent equipped with three tools:

            getCryptoPrice – returns the current price of a specified cryptocurrency.

            sum – returns the sum of two numbers.

            prime – determines whether a given number is prime.

            Your job is to decide when a tool is needed.

            If the user asks a question that can be answered using one of the tools, you MUST call the appropriate tool.
            Examples:

            “What is the price of bitcoin?” → call getCryptoPrice

            “Add 5 and 7” → call sum

            “Is 17 prime?” → call prime

            If the question does NOT require using any tool, answer it directly using your own reasoning.
            Do not call any tool when the answer is purely general knowledge or conversational.

            After receiving the tool result, use it to produce the final natural-language answer for the user.

            Always choose the most relevant tool when appropriate, and fall back to normal LLM responses when no tool is needed.`,
          tools: [{ functionDeclarations: tools }],
        },
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        console.log("####IFFFF######");

        const functionCall = response.functionCalls[0];

        console.log("FUNCTION CALL: ", functionCall);

        const { name, args } = functionCall;

        if (!toolFunctions[name]) {
          throw new Error(`Unknown function call: ${name}`);
        }
        const toolResponse = await toolFunctions[name](args);

        const functionResponePart = {
          name: functionCall.name, // function name example: sum
          response: {
            result: toolResponse, // result. ex: sum == 8
          },
        };
        history.push({
          role: "model",
          parts: [
            {
              functionCall: functionCall,
            },
          ],
        });

        history.push({
          role: "user",
          parts: [
            {
              functionResponse: functionResponePart,
            },
          ],
        });

        console.log("NAME: ", name);
        console.log("ARGS: ", args);
      } else {
        console.log("------------");
        history.push({
          role: "model",
          parts: [{ text: response.text }],
        });
        console.log("\n", response.text, "\n");
        break;
      }
    } catch (error) {
      console.error("ERROR WHILE PERFORMING YOUR QUERY: ", error);
      break;
    }
  }
}

async function main() {
  const problem = readlineSync.question("Question--->");
  await myAgent(problem);
  main();
}

await main();
