/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ params, body }, sendResponse) => {

  // get the params from the request body
  const { regId } = params;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  const endpoint = `https://api.hubapi.com/crm/v4/objects/registrations/${regId}/associations/contacts`

  axios
    .get(endpoint, config)
    .then(response => {
      const { results } = response.data;
      const attendees = [];
      results.forEach(result => {
        const { toObjectId } = result;
        attendees.push(toObjectId);
      });

      sendResponse({ body: { status: "success", data: attendees }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "getEvents" }, statusCode: 200 });
    });
};