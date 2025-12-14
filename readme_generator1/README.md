# 🤖 AI-Powered README Generator

> Automatically generate **professional README files** for your JavaScript projects using **Cline CLI's AI capabilities**.

<p align="center">
  <strong>Built for AI Agents Assemble Hackathon 2024</strong><br/>
  <em>Infinity Build Award Track</em>
</p>

---

## 🎯 The Problem

Developers waste hours writing and maintaining README files. Most projects ship with **incomplete or outdated documentation**, leading to:

* Poor project adoption
* Confused contributors
* Increased support burden

### 💡 Our Solution

An **AI-powered CLI tool** that analyzes your codebase and generates **clear, structured READMEs in seconds**.

---

## ✨ Features

* 🔍 **Smart Code Analysis** — Scans JavaScript files while ignoring `node_modules` and `.env`
* 🧠 **AI-Powered Generation** — Uses Cline CLI for intelligent documentation
* 🚀 **One-Command Operation** — Interactive CLI with real-time feedback
* 📝 **Professional Output** — Structured READMEs with all essential sections

---

## 🛠️ Tech Stack

| Tool              | Purpose                       |
| ----------------- | ----------------------------- |
| **Cline CLI**     | AI code analysis & generation |
| **Node.js (ES6)** | Runtime environment           |
| **Prompts**       | Interactive CLI interface     |
| **fs / path**     | File system operations        |

---

## 📦 Installation

```bash
# Install Cline CLI
npm install -g cline

# Configure Cline
cline config

# Clone and install
git clone https://github.com/Shouvik1Sarkar/ai-readme-generator
cd ai-readme-generator
npm install
```

---

## 🚀 Usage

```bash
node readme.js
```

Enter your project path when prompted:

```text
? Enter the path to your project: › ./my-project
```

### Output

* Scans all `.js` files
* Analyzes code with Cline AI
* Generates `README.md` in your project folder

---

## 📖 How It Works

```
User Input
   ↓
Scan .js Files
   ↓
Send to Cline CLI
   ↓
Extract AI Response
   ↓
Generate README.md
```

### Breakdown

* **Scan** — Reads JavaScript files from the project directory
* **Analyze** — Sends code to Cline CLI with a structured prompt
* **Generate** — Receives AI-generated README content
* **Save** — Creates `README.md` in the project folder

---

## 🏗️ Project Structure

```
ai-readme-generator/
├── readme.js          # Main application
├── package.json       # Dependencies
└── README.md          # This file
```

### Key Functions

* `readProjectfile()` — Scans directory for `.js` files
* `call_cline()` — Interfaces with Cline CLI
* `generateReadMe()` — Orchestrates README generation
* `main()` — Handles user interaction

---

## 🎯 Hackathon: Infinity Build Award

### Why This Qualifies

* ✅ Built on Cline CLI
* ✅ Autonomous coding workflow
* ✅ Meaningful developer tool
* ✅ Production-ready implementation

---

## 🧪 Quick Test

```bash
# Create test project
mkdir test-project
echo "console.log('Hello');" > test-project/index.js

# Run generator
node readme.js
# Enter: ./test-project

# Check output
cat test-project/README.md
```

---

## 🚧 Roadmap

* JavaScript support
* Cline CLI integration
* Multi-language support (Python, Java)
* Custom templates
* GitHub integration

---

## 🐛 Troubleshooting

### "No instances available"

```bash
cline start
```

### "Insufficient credits"

* Add credits at OpenRouter
* Run `cline config`

### "Empty response"

```bash
cline restart
```

---

## 📄 License

MIT License — See `LICENSE`

---

## 👨‍💻 Author

**Your Name**

* GitHub: `@Shouvik1Sarkar`
* Email: `shouvik3501@gmail.com`

---

## 🙏 Acknowledgments

* Cline Team for the amazing AI CLI
* AI Agents Assemble Hackathon organizers
* Open-source community
