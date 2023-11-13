/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  // Create the Event Custom Object & Assoiciate it with the To Object
  const { payload } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }
  
  const endpint = `https://api.hubapi.com/crm/v3/objects/events`;
  
  axios
    .post( endpint, JSON.stringify(payload), config )
    .then(response => {
      sendResponse({ body: { status: "success", response: response.data, step: "createEvent" }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "createEvent" }, statusCode: 200 });
    });
};