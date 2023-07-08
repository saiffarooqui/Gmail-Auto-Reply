const emailService = require("../services/emailService");

const emailController = {
  async handleNewEmails() {
    try {
      await emailService.checkAndReplyToEmails();
      console.log("Checked and replied to emails");
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = emailController;
