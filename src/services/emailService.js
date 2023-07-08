const gmailApiService = require("./gmailApiService");

const emailService = {
  async checkAndReplyToEmails() {
    // Get new emails
    const newEmails = await gmailApiService.getNewEmails();

    // Filter emails that have no prior replies
    const emailsToReply = newEmails.filter((email) => !email.hasPriorReply);

    // Send replies to emails
    const replyPromises = emailsToReply.map((email) =>
      gmailApiService.sendReply(email)
    );
    await Promise.all(replyPromises);

    // Add label to emails and move them to the label
    const labelPromises = emailsToReply.map((email) =>
      gmailApiService.addLabelToEmail(email)
    );
    await Promise.all(labelPromises);

    return {
      success: true,
    };
  },
};

module.exports = emailService;
