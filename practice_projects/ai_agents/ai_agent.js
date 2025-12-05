import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

dotenv.config({ path: "../../.env" });

const ai = new GoogleGenAI({ apiKey: process.env.AI_KEY });

// FUNCTIONS

// CRYPTO:

function crypto_value({ currency }) {
  return fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currency}`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log("###################################################", data);
      return data;
    })
    .catch((err) => {
      console.error("ERROR IN CRYPTO FUNCTION: ", err);
    });
}

// CURRENCY:

function currency_value({ amount, currency1, currency2 }) {
  return fetch(`https://api.exchangerate-api.com/v4/latest/${currency1}`)
    .then((result) => result.json())
    .then((data) => {
      console.log("API Response:", data); // Debug to see structure
      const rate = data.rates[currency2];
      console.log("++++++++++++++++", rate);
      if (!rate) {
        throw new Error(`Currency ${currency2} not found`);
      }
      return {
        amount: amount,
        from: currency1,
        to: currency2,
        rate: rate,
        converted: amount * rate,
      };
    })
    .catch((err) => {
      console.error("ERROR IN CURRENCY FUNCTION: ", err);
      return { error: err.message };
    });
}

// TRANSLATOR:

function translator({ text, lang1, lang2 }) {
  return fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: lang1,
      target: lang2,
      format: "text",
    }),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error("ERROR IN LANGUAGE FUNCTION: ", err);
    });
}

// WEATHER:

function weather({ city }) {
  return fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${city}&aqi=yes`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error("ERROR IN WEATHER FUNCTION: ", err);
    });
}

// SEARCH WIKIPEDIA

function searchWikipedia({ query }) {
  return fetch(
    `https://en.wikipedia.org/w/api.php?action=query&search=${query}&format=json`
  )
    .then((r) => r.json())
    .then((data) => {
      return data;
    });
}

// DECLARATIONs

const crypto_valueFunctionDeclaration = {
  name: "crypto_value",
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

const currency_valueFunctionDeclaration = {
  name: "currency_value",
  description:
    "Converts an amount from one currency to another using real-time exchange rates. For example: Convert 2 USD to INR.",
  parameters: {
    type: "object",
    properties: {
      amount: {
        type: "number",
        description: "The amount of money to convert. Example: 2",
      },
      currency1: {
        type: "string",
        description:
          "The source currency code (e.g., USD, EUR, INR, GBP). Example: USD",
      },
      currency2: {
        type: "string",
        description:
          "The target currency code (e.g., USD, EUR, INR, GBP). Example: INR",
      },
    },
    required: ["amount", "currency1", "currency2"],
  },
};

const translatorFunctionDeclaration = {
  name: "translator",
  description: "Translates text from one language to another",
  parameters: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The text to translate",
      },
      lang1: {
        type: "string",
        description:
          "Source language code (e.g., 'en' for English, 'es' for Spanish)",
      },
      lang2: {
        type: "string",
        description:
          "Target language code (e.g., 'en' for English, 'es' for Spanish)",
      },
    },
    required: ["text", "lang1", "lang2"],
  },
};

const weatherFunctionDeclaration = {
  name: "weather",
  description: `Takes, the name of a city and then gives back the weather of that city. Using Fetch function and API.`,
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "The city name. The place weather the user wants to know",
      },
    },
    required: ["city"],
  },
};

const toolFunctions = {
  crypto_value,
  currency_value,
  translator,
  weather,
};

const tools = [
  crypto_valueFunctionDeclaration,
  currency_valueFunctionDeclaration,
  translatorFunctionDeclaration,
  weatherFunctionDeclaration,
];

const history = [];

async function myAgent(question) {
  history.push({
    role: "user",
    parts: [{ text: question }],
  });

  while (true) {
    try {
      console.log(
        "***********************************BEFORE***********************************"
      );
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
          tools: [
            {
              functionDeclarations: tools,
            },
          ],
        },
      });

      console.log(
        "***********************************AFTER***********************************"
      );

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];

        console.log("FUNCTION CALL: ", functionCall);

        const { name, args } = functionCall;
        if (!toolFunctions[name]) {
          throw new Error(`Unknown function call: ${name}`);
        }

        const toolResponse = await toolFunctions[name](args);
        const functionResponsePart = {
          name: functionCall.name,
          response: {
            result: toolResponse,
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
              functionResponse: functionResponsePart,
            },
          ],
        });
      } else {
        history.push({
          role: "model",
          parts: [{ text: response.text }],
        });
        console.log("🤖 -->", response.text);
        break;
      }
    } catch (err) {
      console.error("SOMETHING WENT WRONG HERE: ", err);
      break;
    }
  }
}

async function main() {
  const problem = readlineSync.question("👱 -->");
  await myAgent(problem);

  main();
}

main();
