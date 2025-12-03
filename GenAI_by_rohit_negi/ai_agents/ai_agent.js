import { configDotenv } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

configDotenv({ path: "../../.env" });

const ai = new GoogleGenAI({ apiKey: process.env.AI_KEY });
const history = [];

// All the tool functions here --->
const available_functions = {
  sum: sum,
  prime: prime,
  odd_even: odd_even,
  getCryptoPrice: getCryptoPrice,
};

// give the structured instruction:

const sumDeclaration = {
  name: "sum",
  description: ` This function returns the sum of two numbers. It takes two parameters and both are type numbers. And then return their mathematical sum.`,
  parameters: {
    type: "object",
    properties: {
      num1: {
        type: "number",
        description:
          "this is the first number for adding two numbers. Example: 10",
      },
      num2: {
        type: "number",
        description:
          "this is the second number for adding two numbers. Example: 10",
      },
    },
    required: ["num1", "num2"],
  },
};

const primeDeclaration = {
  name: "prime",
  description:
    "This takes one input as a parameter and says if a number is prime number or not.",
  parameters: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description:
          "a number is taken as an input and checked if it is prime or not",
      },
    },
    required: ["a"],
  },
};
const oddevenDeclaration = {
  name: "odd_even",
  description:
    "This takes one input as a parameter and says if a number is odd or even",
  parameters: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description:
          "a number is taken as an input and checked if it is odd or even",
      },
    },
    required: ["a"],
  },
};

const cryptoDeclaration = {
  name: "getCryptoPrice",
  description: "Get the current price of any crypto Currency like bitcoin",
  parameters: {
    type: "object",
    properties: {
      coin: {
        type: "string",
        description: "It will be the crypto currency name, like bitcoin",
      },
    },
    required: ["coin"],
  },
};

// const tools_a = [
//   {
//     functionDeclaration: [
//       sumDeclaration,
//       primeDeclarations,
//       oddevenDeclarations,
//     ],
//   },
// ];

async function chatting(question) {
  history.push({
    role: "user",
    parts: [{ text: question }],
  });

  let i = 0;
  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        tools: [
          {
            functionDeclarations: [
              sumDeclaration,
              primeDeclaration,
              oddevenDeclaration,
              cryptoDeclaration,
            ],
          },
        ],
      },
    });

    try {
      //   console.log("---------------", response);
      console.log("---------------", response.functionCalls);
      if (response.functionCalls && response.functionCalls.length > 0) {
        console.log("////////////////////////////////////////");
        const { name, args } = response.functionCalls[0];

        const functionCall = available_functions[name];
        const result = await functionCall(args);

        const functionResponsePart = {
          name: name,
          response: {
            result: result,
          },
        };

        history.push({
          role: "model",
          parts: [
            {
              functionCall: response.functionCalls[0],
            },
          ],
        });

        history.push({
          role: "user",
          parts: [
            {
              functionResponse: functionResponsePart,
            },
          ],
        });
        console.log("RESULT: ", result);
        i += 1;
      } else {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        if (i > 0) {
          console.log("yes it is more than one");
          i = 0;
          return;
        }
        history.push({
          role: "model",
          parts: [{ text: response.text }],
        });
        console.log("----", response.text);
        break;
      }
    } catch (error) {
      console.error("Error happened: ", error);
      break;
    }
  }
}

async function main() {
  const problem = readlineSync.question("Question--->");
  await chatting(problem);
  main();
}

await main();

// FUNCTIONS DEFINED

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ a }) {
  for (let i = 2; i < a; i++) {
    if (a % i == 0) {
      return "not a prime number";
    }
  }

  return "prime number.";
}

function odd_even({ a }) {
  if (a % 2 == 0) {
    return "even";
  } else {
    return "odd";
  }
}
async function getCryptoPrice({ coin }) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`
  );
  const data = await response.json();

  return data;
}
