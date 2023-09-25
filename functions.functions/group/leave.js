
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  const { groupId, contactId } = body;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }
  

  const endpoint = `https://api.hubapi.com/crm/v4/objects/groups/${groupId}/associations/contacts/${contactId}`;

  axios
    .delete(endpoint, config)
    .then(response => {
      sendResponse({ body: { success: true, response: response.data }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { error: error.message }, statusCode: 500 });
    })

  // sendResponse({ body: { groupId, contactId, config }, statusCode: 200 })
  
};