/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { eventId, attendeeId, properties } = body;

  // First we create the registration payload, 
  // Then we associate the registration payload with the event object and contact object
  const payload = {
    associations: [
      {
        types: [
          {
            associationCategory: "USER_DEFINED",
            associationTypeId: 323 // registrations_to_contacts with participant label
          }
        ],
        to: {
          id: attendeeId
        }
      },
      {
        types: [
          {
            associationCategory: "USER_DEFINED",
            associationTypeId: 325 // registrations_to_events
          }
        ],
        to: {
          id: eventId
        }
      }
    ],
    properties: {
      ...properties
    }
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }    
  }

  const endpoint = `https://api.hubapi.com/crm/v3/objects/registrations`;

  axios
    .post(endpoint, JSON.stringify(payload), config)
    .then((response) => {
      sendResponse({ body: { status: "success", data: response.data, step: "createRegistration" }, statusCode: 200 });
    })
    .catch((error) => {
      console.log(error);
      sendResponse({ body: { status: "error", error: error.message, step: "createRegistration" }, statusCode: 500 });
    });  
};