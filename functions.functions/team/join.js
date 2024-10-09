/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
  }

  const { teamId, contactId, firstname, contactEmail, teamUrl, teamName, teamBannerUrl } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  axios
    .get('https://api.hubapi.com/crm/v4/associations/teams/contacts/labels', config )
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "fetchLabels" }, statusCode: 200 });
    })
    .then(response => {
      const labels = response.data.results;
      if (typeof(labels) === "undefined") {
        sendResponse({ body: { status: "error", error: "No labels found.", step: "findAssoication" }, statusCode: 200 });
      }

      const teamMemberLabel = labels.find(label => label.label === 'Team Member');

      if (!teamMemberLabel) {
        sendResponse({ body: { status: "error", error: 'team Member label not found.', step: "findAssoication" }, statusCode: 200 });
      }

      const teamMemberLabelId = teamMemberLabel.typeId;

      const endpoint = `https://api.hubapi.com/crm/v4/objects/teams/${teamId}/associations/contacts/${contactId}`;
      const data = [
        {
          "associationCategory": "USER_DEFINED",
          "associationTypeId": teamMemberLabelId
        }
      ];

      return axios.put( endpoint, JSON.stringify(data), config );
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "addAssociation" }, statusCode: 200 });
    })
    .then(() => {
      const data = {
        "emailId": 180567991639,
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
          "teamUrl": `${teamUrl}`,
          "teamName": `${teamName}`,
          "teamBannerUrl": `${teamBannerUrl}`
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