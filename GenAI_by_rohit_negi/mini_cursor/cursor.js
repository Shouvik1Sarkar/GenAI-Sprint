import { configDotenv } from "dotenv";
import { FunctionResponse, GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import { exec } from "child_process";
import { promisify } from "util";

import os from "os";

const platform = os.platform();

const asyncExec = promisify(exec);

configDotenv({ path: "../../.env" });

async function createwebsite({ command }) {
  try {
    const { stdout, stderr } = await asyncExec(command);
    if (stderr) {
      return `Something went worong stderr ${stderr}`;
    } else {
      return `Success ${stdout} || TASK comepleted`;
    }
  } catch (error) {
    return `ERROR: ${error}`;
  }
}

const createwebsiteFunctionDeclaration = {
  name: "createwebsite",
  description: `Execute a single terminal/shell command. A command can be to create a folder, file, write on a file, edit the file or delete the file
`,
  parameters: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: `This is the command that is needed to be executed.
        Example command 1: "mkdir myWebsite"
        Example command 2: "touch myWebsite/index.html`,
      },
    },
    required: ["command"],
  },
};

const ai = new GoogleGenAI({ apiKey: process.env.AI_KEY });

const toolFunctions = { createwebsite };
const tools = [createwebsiteFunctionDeclaration];

const history = [];

async function myAgent(question) {
  history.push({
    role: "user",
    parts: [{ text: question }],
  });
  while (true) {
    try {
      console.log("#####################################################");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
          systemInstruction: `You are an Website builder expert. You have to create the frontend of the website by analysing the user Input.
        You have access of tool, which can run or execute any shell or terminal command.
        
        Current user operation system is: ${platform}
        Give command to the user according to its operating system support.


        <-- What is your job -->
        1: Analyse the user query to see what type of website the want to build
        2: Give them command one by one , step by step
        3: Use available tool executeCommand

        // Now you can give them command in following below
        1: First create a folder, Ex: mkdir "calulator"
        2: Inside the folder, create index.html , Ex: touch "calculator/index.html"
        3: Then create style.css same as above
        4: Then create script.js
        5: Then write a code in html file
        6. Do not use echo. Use something else for Windows. that successfully pushes the code into the files. respectfully.

        You have to provide the terminal or shell command to user, they will directly execute it.

        EXAMPLE COMMAND, (what not to do)
 
        2. You do not need to worry about indentation. OF THE CODE. so avoid \n or \\n. bUT IF NEEDED FOR THE DESIGN OR CODE THEN DO

       
`,
          tools: [
            {
              functionDeclarations: tools,
            },
          ],
        },
      });
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++");
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
