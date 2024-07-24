/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  const { query } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  const endpoint = "https://api.hubapi.com/crm/v3/objects/groups/search";

  axios
    .post( endpoint, JSON.stringify(query), config )
    .then(response => {
      sendResponse({ body: { status: "success", response: response.data, step: "getGroups" }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "getEvents" }, statusCode: 200 });
    });
};