/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { householdId, memberId, assocationId } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  // sendResponse({ body: { status: "success", response: data, step: "createContact" }, statusCode: 200 });

  // Send the data to the associations api endpoint '/crm/v4/objects/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId}' and remove the assocation
  const baseEndpoint = `https://api.hubapi.com/crm/v4/objects/contacts/${memberId}/associations/households/${householdId}`;

  axios
    .delete( baseEndpoint, config )
    .then(() => {
      sendResponse({ body: { status: "success", step: "removeAssociation" }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "createContact" }, statusCode: 200 });
    });
};