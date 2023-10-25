
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { objectType, objectId, updateAssociation, associations, properties } = body;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }
  
  const endpoint = `https://api.hubapi.com/crm/v4/objects/${objectType}/${objectId}`;

  axios
    .patch(
      endpoint, 
      {
        "properties": properties
      },
      config
    )
    .then((response) => {
      if (updateAssociation) {
        // TODO: REPLACE WITH ASSOCIATION UPDATE
        sendResponse({ body: { status: "success", response: response.data, step: "patch" }, statusCode: 200 });
      } else {
        sendResponse({ body: { status: "success", response: response.data, step: "patch" }, statusCode: 200 });
      }
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "patch", config, endpoint }, statusCode: 200 });
    })
      
};