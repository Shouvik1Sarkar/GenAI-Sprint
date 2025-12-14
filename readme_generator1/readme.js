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
//     try {
//         console.log("🤖 Asking Cline...");
        
//         // First, ensure Cline is running
//         try {
//             const { stdout: statusOut } = await execPromise('cline status');
//             if (!statusOut.includes('Running') && !statusOut.includes('instance')) {
//                 console.log('⚠️  Starting Cline instance...');
//                 await execPromise('cline start');
//                 // Wait a bit for it to start
//                 await new Promise(resolve => setTimeout(resolve, 2000));
//             }
//         } catch (err) {
//             console.log('⚠️  Attempting to start Cline...');
//             try {
//                 await execPromise('cline start');
//                 await new Promise(resolve => setTimeout(resolve, 2000));
//             } catch (startErr) {
//                 console.warn('Could not start Cline automatically');
//             }
//         }
        
//         // Write prompt to a temporary file
//         const tempFile = path.join(process.cwd(), '.temp-prompt.txt');
//         fs.writeFileSync(tempFile, prompt);
        
//         // Use echo and pipe to send the prompt
//         const command = `echo "${prompt.replace(/"/g, '\\"').replace(/\n/g, ' ')}" | cline -y -m plan`;
        
//         const { stdout, stderr } = await execPromise(command, {
//             maxBuffer: 1024 * 1024 * 5, // 5MB buffer
//             timeout: 60000 // 60 second timeout
//         });
        
//         // Clean up temp file
//         if (fs.existsSync(tempFile)) {
//             fs.unlinkSync(tempFile);
//         }
        
//         if (stderr) {
//             console.warn("⚠️ Cline warning:", stderr);
//         }
        
//         if (!stdout || stdout.trim() === "") {
//             throw new Error("Cline returned empty response");
//         }
        
//         // Debug: Save raw output to see what we got
//         console.log('\n--- RAW CLINE OUTPUT (first 500 chars) ---');
//         console.log(stdout.substring(0, 500));
//         console.log('--- END RAW OUTPUT ---\n');
        
//         // Try multiple extraction strategies
//         let cleanResponse = '';
        
//         // Strategy 1: Look for markdown headers
//         const lines = stdout.split('\n');
//         const markdownStart = lines.findIndex(line => line.trim().startsWith('#'));
        
//         if (markdownStart !== -1) {
//             // Found markdown! Take everything from there
//             cleanResponse = lines.slice(markdownStart).join('\n').trim();
//         }
        
//         // Strategy 2: If no markdown found, look for any substantial text after system messages
//         if (!cleanResponse) {
//             let capturing = false;
//             let response = [];
            
//             for (const line of lines) {
//                 // Skip system/prompt lines
//                 if (line.includes('*Using instance*') ||
//                     line.includes('*Press Ctrl+C*') ||
//                     line.includes('Checkpoint created') ||
//                     line.includes('[plan mode]') ||
//                     line.startsWith('┃') ||
//                     line.includes('API Request Failed')) {
//                     continue;
//                 }
                
//                 // Start capturing after we see actual content
//                 if (line.trim().length > 20 && !line.includes('STRICT RULES')) {
//                     capturing = true;
//                 }
                
//                 if (capturing) {
//                     response.push(line);
//                 }
//             }
            
//             cleanResponse = response.join('\n').trim();
//         }
        
//         // Strategy 3: If still nothing, just clean the output
//         if (!cleanResponse || cleanResponse.length < 50) {
//             // Remove common system messages but keep everything else
//             cleanResponse = stdout
//                 .split('\n')
//                 .filter(line => {
//                     return !line.includes('*Using instance*') &&
//                            !line.includes('*Press Ctrl+C*') &&
//                            !line.includes('Checkpoint created') &&
//                            !line.startsWith('┃') &&
//                            line.trim().length > 0;
//                 })
//                 .join('\n')
//                 .trim();
//         }
        
//         if (!cleanResponse || cleanResponse.length < 50) {
//             console.error('\n❌ Could not extract README. Full output:');
//             console.error(stdout);
//             throw new Error("Could not extract valid README from Cline response. Check output above.");
//         }
        
//         console.log("✅ Got response from Cline!");
//         console.log(`📝 Response length: ${cleanResponse.length} characters\n`);
//         return cleanResponse;
        
//     } catch (error) {
//         console.error("❌ Error calling Cline:", error.message);
        
//         // Check for specific error types
//         if (error.message.includes('Insufficient credits')) {
//             console.error('\n💳 CLINE API ERROR: No credits available!');
//             console.error('You need to:');
//             console.error('1. Go to https://openrouter.ai/settings/credits');
//             console.error('2. Purchase credits for your account');
//             console.error('3. Make sure Cline is using the correct API key');
//             console.error('\nAlternatively, configure Cline to use a different provider:');
//             console.error('Run: cline config');
//         }
        
//         throw error;
//     }
// }

function systemInstruction(codeOverview)
{
        const prompt = `
You are an AI agent who is specialized in generating readme files and readme content for code files.

If an user gives you the url or link of a project. Basically a directory. you analyse the folder. ignore the files which should be, like node_modules, .env etc.
see the .js files. analyze the code. Understand what the code does. And then generate a proper readme file with readme content in it.

Task:
1. Analyze the provided project.
2. Ignore unnecessery files.
3. analyze the js files and the codes.
3. From the analysis, write
   - Project Title
   - Project Description
   - Features
   - Installation Instructions
   - Usage Examples
   - File Structure Summary
3. Write a polished, human-friendly README.md.

Example:
User Input: A project folder that consists js file/project
output: {{step: "analyze", content:"So the user is interested in getting a readme file for this project."}}
output: {{step: "think", content: "The project does a ceritain thing, has certain features, has certain tools",}}
output: {{step: "output", content: "So according to the project generate a certain readme."}}
output: {{step: "validate", content: "This is the generated readme. Does this go according ly with the project? If yes then validated. If no then redo the entire process"}}
output: {{step: "result", content: "return the content"}}



Context for analysis ONLY (do NOT include in final output):
${codeOverview}

Output:
ONLY the final README.md content in Markdown.
`.trim();


return prompt;
}

 
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

 
    const prompt = systemInstruction(codeOverview)
    
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