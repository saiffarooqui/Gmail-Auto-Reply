const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const LABEL_NAME = "Auto Replied";

const gmailApiService = {
  async getNewEmails() {
    // Get new emails from Gmail API
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });
    const messages = response.data.messages || [];

    // Get details of each email
    const emailPromises = messages.map((message) =>
      gmail.users.messages.get({
        userId: "me",
        id: message.id,
      })
    );
    const emails = await Promise.all(emailPromises);

    // Check if email has prior reply
    const emailsWithPriorReplyCheck = emails.map((email) => {
      const hasPriorReply =
        email.data.payload.headers.find(
          (header) => header.name === "In-Reply-To"
        ) !== undefined;
      return {
        ...email,
        hasPriorReply,
      };
    });

    return emailsWithPriorReplyCheck;
  },

  async sendReply(email) {
    // Send reply to email using Gmail API
    const messageId = email.data.id;
    const threadId = email.data.threadId;
    const subject = email.data.payload.headers.find(
      (header) => header.name === "Subject"
    ).value;
    const from = email.data.payload.headers.find(
      (header) => header.name === "From"
    ).value;
    const to = email.data.payload.headers.find(
      (header) => header.name === "To"
    ).value;

    // Create reply message
    const replyMessage = `From: ${to}\r\nTo: ${from}\r\nSubject: Re: ${subject}\r\nIn-Reply-To: <${messageId}>\r\nReferences: <${messageId}>\r\n\r\nAuto reply: I'm currently on vacation and will get back to you when I return.`;

    // Send reply
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(replyMessage)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, ""),
        threadId,
      },
    });
  },

  async addLabelToEmail(email) {
    // Add label to email and move it to the label using Gmail API
    const messageId = email.data.id;

    // Check if label exists
    const labelsResponse = await gmail.users.labels.list({
      userId: "me",
    });
    let label = labelsResponse.data.labels.find(
      (label) => label.name === LABEL_NAME
    );

    // Create label if it doesn't exist
    if (!label) {
      const createLabelResponse = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: LABEL_NAME,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      label = createLabelResponse.data;
    }

    // Add label to email
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [label.id],
      },
    });
  },
};

module.exports = gmailApiService;
