
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

  axios
    .get('https://api.hubapi.com/crm/v4/associations/groups/contacts/labels', config )
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "fetchLabels" }, statusCode: 200 });
    })
    .then(response => {
      const labels = response.data.results;
      if (typeof(labels) === "undefined") {
        sendResponse({ body: { status: "error", error: "No labels found.", step: "findAssoication" }, statusCode: 200 });
      }

      const groupMemberLabel = labels.find(label => label.label === 'Group Member');

      if (!groupMemberLabel) {
        sendResponse({ body: { status: "error", error: 'Group Member label not found.', step: "findAssoication" }, statusCode: 200 });
      }

      const groupMemberLabelId = groupMemberLabel.typeId;

      const endpoint = `https://api.hubapi.com/crm/v4/objects/groups/${groupId}/associations/contacts/${contactId}`;
      const data = [
        {
          "associationCategory": "USER_DEFINED",
          "associationTypeId": groupMemberLabelId
        }
      ];

      return axios.put( endpoint, JSON.stringify(data), config );
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "addAssociation" }, statusCode: 200 });
    })
    .then(() => {
      const data = {
        "emailId": 136453598106,
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