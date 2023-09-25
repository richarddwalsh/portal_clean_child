
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  axios
    .get('https://api.hubapi.com/crm/v4/associations/groups/contacts/labels', config )
    .then(response => {
      const labels = response.data.results;
      const groupMemberLabel = labels.find(label => label.label === 'Group Member');

      if (!groupMemberLabel) {
        sendResponse({ body: { error: 'Group Member label not found.' }, statusCode: 500 });
      }

      const groupMemberLabelId = groupMemberLabel.typeId;

      const { groupId, contactId } = body;

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
      sendResponse({ body: { error: error.message }, statusCode: 500 });
    })
    .then(response => {
      sendResponse({ body: { response: response.data }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { error: error.message }, statusCode: 500 });
    })

  // sendResponse({ body: { group_id, contact_id, headers }, statusCode: 200 })
  
};