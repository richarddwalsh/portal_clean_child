/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { 
    family_name,
    contact_id
  } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  // Prepare the data set for creating the contact and setting the household association
  const householdData = {
    family_name
  };

  const householdAssociationData = {
    to: {
      id: contact_id
    },
    types: [
      {
        associationCategory: "USER_DEFINED",
        associationTypeId: 309
      }
    ]
  };

  const data = {
    properties: householdData,
    associations: [ householdAssociationData ]
  };

  // sendResponse({ body: { status: "success", response: data, step: "createContact" }, statusCode: 200 });

  // Send the data to the contact api endpoint '/crm/v3/objects/households/'
  const baseEndpoint = "https://api.hubapi.com/crm/v3/objects/households/";

  axios
    .post( baseEndpoint, JSON.stringify(data), config )
    .then(response => {
      sendResponse({ body: { status: "success", response: response.data, step: "createContact" }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "createContact" }, statusCode: 200 });
    });
};