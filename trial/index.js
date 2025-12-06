import { exec } from "child_process";

const command = "mkdir exp_folder";

function runcommand(command) {
  const { stdout, stderr } = exec(command);
  console.log("STD OUT: ", stdout);
}
runcommand(command);
