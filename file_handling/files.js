import fs from "fs";

// writeFileSync - writes Synchronously. Over rides the last content with the latest one.

// fs.writeFileSync("./first.txt", "I am building something with cline cli");

// fs.writeFile("./first.txt", " I am doing it", (err) => {});

// const result = fs.readFileSync("./first.txt", "utf-8");
// console.log(result);

// const result = fs.readFileSync("./first.txt"); // without utf-8 it is onot converted into text but some codes are written.
// console.log(result);

// append lines to the file synchronously

// fs.appendFileSync("./first.txt", "\nThis is data here");

// fs.cpSync("./first.txt", "./copied.txt");
// fs.unlinkSync("./copied.txt");

console.log(fs.statSync("./first.txt"));

// fs.readFile("./first.txt", "utf-8", (err, result) => {
//   if (err) {
//     console.error("There is an error", err);
//   } else {
//     console.log(result);
//   }
// });

// fs.mkdirSync("myfolder");
fs.mkdirSync("myfolder/a/b", { recursive: true });
