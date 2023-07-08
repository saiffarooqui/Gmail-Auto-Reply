# Gmail Auto Reply

A Node.js app that automatically responds to emails sent to your Gmail mailbox while you're on vacation.

## Features

- Checks for new emails in a given Gmail ID
- Sends replies to emails that have no prior replies
- Adds a label to the email and moves it to the label
- Repeats these steps at random intervals between 45 and 120 seconds

## Technologies Used

- Node.js
- Google APIs (Gmail API)

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your Google API credentials
4. Run the app: `node src/index.js` or `npm start`

## Areas for Improvement

- Error handling: The app could be improved by adding more robust error handling.
- Logging: The app could benefit from more detailed logging to help with debugging and monitoring.
- Testing: The app currently lacks tests. Adding tests would help ensure that the app is working correctly and prevent regressions.
