const {apiKey, apiLimit} = require('../env');
const fetch = require('node-fetch');
const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=simpsons`;

function home(req, res){
  return res.send('Haha what are you looking for?');
};

function getGifs(req, res) {
  try {

    /* Slack slash commands have an invocation structure that includes:
        - response_url: a hook/url that a POST request can be sent to for sending, editing or deleting messages
        - user_id: a Slack code that represents the invoking user's Display Name
    */
    const { response_url: responseUrl, user_id: userID,  } = req.body;
    const text = generateBody(userID);
    postToChannel(responseUrl, text);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const postToChannel = async (responseUrl, gif) => {
  console.log("responseUrl: ", responseUrl);
  return fetch(responseUrl, {
    method: 'POST',
    /* Slack slash commands and apps generally expect a body with the following attributes:
        - "text" (required) which is the data that would be sent to Slack
        - "response_type": ephemeral/in_channel.
           By default (i.e if not explicitly set), it is "ephemeral";
           this means, the response from the command is visible to just the invoking user.
           It can also be set to "in_channel" which means the response from the command is visible in whatever channel it is invoked.      
    */
    body: JSON.stringify({ gif, response_type: 'in_channel' }),
    headers: { 'Content-Type': 'application/json' }
  });
}

const generateBody = async (userID) => {
  const randomGif = await fetch(apiUrl, {
    method: 'GET'
  })
  .then(res => res.json())
  .then(json => json.data.map(gif => gif.images.fixed_height.url)[getRandomInt(json.data.length)])
  .catch(err => console.error("Error retrieving gifs: ", err));

  /* Slack formats text in special ways:
      For URLS: <https://paystack.com| paystack> returns a hyperlinked "paystack" text to https://paystack.com.
      For Display Names: The user_id sent from the Slash command looks like this - Q016JVU6XFD
      To get the display name, the ID has to be formatted: <@Q016JVU6XFD> would return @userxyz for example
      Note: There is a user_name field but that can many times be different from the user's actual display name.
  */
  return `<${randomGif}| good job> by <@${userID}>`

}

module.exports = {
  home,
  getGifs
};