
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { groupId, contactId, firstname, contactEmail, groupUrl, groupName, groupBannerUrl } = body;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }
  

  const endpoint = `https://api.hubapi.com/crm/v4/objects/groups/${groupId}/associations/contacts/${contactId}`;

  axios
    .delete(endpoint, config)
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "deleteAssociation" }, statusCode: 200 });
    })
    .then(() => {
      const data = {
        "emailId": 136441277755,
        "message": {
          "to": `${contactEmail}`,
          "bcc": [
            "23169086@bcc.hubspot.com"
          ]
        },
        "contactProperties": {
          "firstname": `${firstname}`,
          "email": `${contactEmail}`
        },
        "customProperties": {
          "groupUrl": `${groupUrl}`,
          "groupName": `${groupName}`,
          "groupBannerUrl": `${groupBannerUrl}`
        } 
      }      
      const emailEndpoint = `https://api.hubapi.com/marketing/v3/transactional/single-email/send`;
      return axios.post( emailEndpoint, data, config );
    })
    .catch((error) => {
      sendResponse({ body: { status: "error", error: error.message, step: "sendEmail" }, statusCode: 200 });
    })
    .then(response => {
      sendResponse({ body: { status: "success", response: response.data, step: "sendEmail" }, statusCode: 200 });
    })  
};