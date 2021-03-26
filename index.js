const express = require('express');
const {apiKey} = require('env')
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { WebClient, LogLevel } = require("@slack/web-api");
app.use(bodyParser());

// Home
app.get('/', (req, res) => res.send('Haha what are you looking for?'));

// Endpoint that sends media to Slack
app.post('/get-gif', async (req, res) => {
  const apiUrl = `api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=simpsons&limit=10`;
  try {

    /* Slack slash commands have an invocation structure that includes:
        - response_url: a hook/url that a POST request can be sent to for sending, editing or deleting messages
        - user_id: a Slack code that represents the invoking user's Display Name
    */
    const { response_url: responseUrl, user_id: userID,  } = req.body;
    console.log(responseUrl);
    const text = generateBody(apiUrl, userID);
    postToChannel(responseUrl, text);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
  }
});

const postToChannel = async (responseUrl, gif) => {
  
  return fetch(responseUrl, {
    method: 'POST',
    /* Slack slash commands and apps generally expect a body with the following attributes:
        - "text" (required) which is the data that would be sent to Slack
        - "response_type": ephemeral/in_channel.
           By default (i.e if not explicitly set), it is "ephemeral";
           this means, the response from the command is visible to just the invoking user.
           It can also be set to "in_channel" which means the response from the command is visible in whatever channel it is invoked.      
    */
    body: JSON.stringify({ text: "hello world", response_type: 'in_channel' }),
    headers: { 'Content-Type': 'application/json' },
  });
}

const generateBody = (url, userID) => {
  /* Slack formats text in special ways:
      For URLS: <https://paystack.com| paystack> returns a hyperlinked "paystack" text to https://paystack.com.
      For Display Names: The user_id sent from the Slash command looks like this - Q016JVU6XFD
      To get the display name, the ID has to be formatted: <@Q016JVU6XFD> would return @userxyz for example
      Note: There is a user_name field but that can many times be different from the user's actual display name.
  */
  return `<${url}| good job> by <@${userID}>`
}

app.listen(port, () => console.log(`App listening at ${process.env.HOST}:${port}`));