require("dotenv").config();
const emailController = require("./controllers/emailController");

async function main() {
  // Run email controller at random intervals
  setInterval(async () => {
    await emailController.handleNewEmails();
  }, getRandomInterval());
}

function getRandomInterval() {
  // Get random interval between 45 and 120 seconds
  // return Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000;
  return 20000;
}

main();
