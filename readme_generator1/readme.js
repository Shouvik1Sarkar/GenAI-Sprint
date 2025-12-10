import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import prompts from "prompts";
import { Console } from "console";

const execPromise = promisify(exec)

// This function takes the prompt with the codefile itself and then generates the readme content using Cline
// async function call_cline(prompt)
// {
//     try {
//         console.log("🤖Asking Cline...")
//         console.log("FIRST DEBUG IN CLINE")
//         // console.log("PROMPT", typeof prompt) // string
//         const {stdout, stderr} = await exec(`cline task new ${prompt}`);
//         console.log("FIRST DEBUG IN CLINE")
//         if (stderr) {
//             console.error("Error in Call Cline function stderr: ", stderr);
//             return;
//         }
//         console.log("2ND DEBUG IN CLINE")
//         console.log("THIS IS DATA: ", stdout)
//         return stdout;
//     } catch (error) {
//         console.error("Error in Call Cline function: ", error)
//     }
// }

// async function call_cline(prompt) {
//     return new Promise((resolve, reject) => {
//         const child = exec("cline task new -y -m plan", (err, stdout, stderr) => {
//             if (err) return reject(err);
//             if (stderr) return reject(stderr);
//             resolve(stdout.trim());
//         });

//         child.stdin.write(prompt);
//         child.stdin.end();
//     });
// }

async function call_cline(prompt) {
    try {
        console.log("🤖 Asking Cline...");
        
        // Escape quotes in prompt to avoid shell issues
        const escapedPrompt = prompt.replace(/"/g, '\\"');
        
        // Call Cline with the prompt directly
        // const { stdout, stderr } = await execPromise(`cline "${escapedPrompt}"`);
        const { stdout, stderr } = await execPromise(`cline "${escapedPrompt}"`);
        
        if (stderr) {
            console.warn("⚠️ Cline warning:", stderr);
        }
        
        if (!stdout || stdout.trim() === "") {
            throw new Error("Cline returned empty response");
        }
        
        console.log("✅ Got response from Cline!");
        // const outpt = stdout.replace(escapedPrompt, "")
        return stdout.trim();
        
    } catch (error) {
        console.error("❌ Error calling Cline:", error.message);
        throw error;
    }
}

// async function call_cline(prompt) {
//     const child = exec("cline -F plain -y -m plan", {
//         maxBuffer: 1024 * 500,
//     });

//     return new Promise((resolve, reject) => {
//         let output = "";
//         let error = "";

//         child.stdout.on("data", chunk => output += chunk);
//         child.stderr.on("data", chunk => error += chunk);
//         child.on("close", () => {
//             if (error.trim()) console.warn("cline stderr:", error);
//             resolve(output.trim());
//         });

//         child.stdin.write(prompt);
//         child.stdin.end();
//     });
// }


 
 function readProjectfile(dirpath)
{
    const files = [];
    try {
        const items = fs.readdirSync(dirpath)
        items.forEach(item=>{
            const fullPath = path.join(dirpath, item)
            const stat = fs.statSync(fullPath);

            if (item == "node_modules" || item.startsWith(".") ) {
                return 
            }

            if (stat.isFile() && item.endsWith(".js")) {
                const content = fs.readFileSync(fullPath, "utf-8")
                files.push({
                    name: item,
                    content: content,
                })
            }
        })
    } catch (error) {
        console.error("Error occured in readProjectfile: ", error)
    }

    return files;
}

async function generateReadMe(projectPath){
    const files = readProjectfile(projectPath);
    if ( files.length == 0) {
        console.log("No JS files were found")
        return;
    }

    console.log(`There are ${files.length} js files.`)
    let codeOverview = 'Here are the files in this project:\n\n';
    files.forEach(file=>{
        codeOverview += `File: ${file.name}\n`
        codeOverview += `Content: ${file.content}\n`
    })

     const prompt = `
You are generating a README.md for this project.

STRICT RULES (do not violate):
- Do NOT include this prompt text in the README.
- Do NOT include the code itself in the README.
- Do NOT include "codeOverview" or any file contents.
- Do NOT explain your reasoning.
- Output ONLY the final README in clean Markdown.

Your task:
1. Analyze the provided JavaScript project.
2. From the analysis, infer:
   - Project Title
   - Project Description
   - Features
   - Installation Instructions
   - Usage Examples
   - File Structure Summary
3. Write a polished, human-friendly README.md.

Context for analysis ONLY (do NOT include in final output):
${codeOverview}

Output:
ONLY the final README.md content in Markdown.
`.trim();

    
        const getClineResponse = await call_cline(prompt);
        console.log("CLINE RESPONSE", getClineResponse)

        if (!getClineResponse) {
            console.error("Cline Respone was not gotten")
            return;
        }
        const completePath = path.join(projectPath, "README.md")

        fs.writeFileSync(completePath, getClineResponse)
        console.log('✨ README.md generated successfully!');
  console.log(`📄 Saved to: ${completePath}`);
  
  return getClineResponse;

}

async function main(){
    console.log("Generate README for your peojwct using Cline AI")
    const userPath = await prompts({
         type: "text",
            name: "projectPath",
            message: "Enter the path to your project:",
            initial: ".", // Default value if user just presses Enter
    })
    if (userPath.projectPath == ".") {
        console.error("Please enter a path");
        return;
  }
      // Handle if user cancelled (Ctrl+C)
    if (!userPath.projectPath) {
        console.log("\n❌ Cancelled!");
        process.exit(0);
    }

    const projectPath = userPath.projectPath;

    // Validate path exists
    if (!fs.existsSync(projectPath)) {
        console.error(`\n❌ Error: Path "${projectPath}" does not exist!`);
        process.exit(1);
    }

    console.log(`\nAnalyzing project at: ${projectPath}\n`);



    console.log("🚀 Auto README Generator");
    console.log("========================\n");
    console.log(`Analyzing project at: ${userPath.projectPath}\n`);

    try {
        await generateReadMe(userPath.projectPath);
        console.log('\n✅ Done! Check your README.md file.');
    } catch (error) {
        console.error('\n❌ Error in main Function:', error.message);
        console.log('\n💡 Make sure Cline CLI is installed: npm install -g @cline/cli');
    }

 
}

main()