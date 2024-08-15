/* eslint-disable import/no-unresolved */
const axios = require('axios');

exports.main = ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 500 });
    return;
  }

  const { teamId, contactId, firstname, contactEmail, teamUrl, teamName, teamBannerUrl } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  };
  
  // Step 1: Remove all associations
  const removeAssociationsEndpoint = `https://api.hubapi.com/crm/v4/objects/teams/${teamId}/associations/contacts/${contactId}`;

  axios.delete(removeAssociationsEndpoint, config)
    .then(() => 
      // Step 2: Get all labels to find the 'Team Member' label
      axios.get('https://api.hubapi.com/crm/v4/associations/teams/contacts/labels', config)
    )
    .then(response => {
      const labels = response.data.results;
      if (typeof(labels) === "undefined" ) {
        sendResponse({ body: { status: "error", error: "No labels found.", step: "findAssociation" }, statusCode: 200 });
        return;
      }
      
      const teamMemberLabel = labels.find(item => item.label === 'Team Member');

      if (!teamMemberLabel) {
        sendResponse({ body: { status: "error", error: 'Team Member label not found.', step: "findAssociation" }, statusCode: 200 });
        return;
      }

      const teamMemberLabelId = teamMemberLabel.typeId;
      
      // Step 3: Create the 'Team Member' association
      const createAssociationEndpoint = `https://api.hubapi.com/crm/v4/objects/teams/${teamId}/associations/contacts/${contactId}`;
      const data = [
        {
          "associationCategory": "USER_DEFINED",
          "associationTypeId": teamMemberLabelId
        }
      ];

      return axios.put(createAssociationEndpoint, JSON.stringify(data), config);
    })
    .then(response => {
      if (!response.data) {
        sendResponse({ body: { status: "error", error: "Error creating association.", step: "createAssociation" }, statusCode: 200 });
        return;
      }

      // Step 4: Send an email notification
      const emailData = {
        emailId: 175564456355,  // Update this to the correct email template ID
        message: {
          to: contactEmail,
          bcc: [
            "23169086@bcc.hubspot.com"
          ]
        },
        contactProperties: {
          firstname,
          email: contactEmail
        },
        customProperties: {
          teamUrl,
          teamName,
          teamBannerUrl
        }
      };

      const emailEndpoint = `https://api.hubapi.com/marketing/v3/transactional/single-email/send`;
      return axios.post(emailEndpoint, emailData, config);
    })
    .then(response => {
      sendResponse({ body: { status: "success", response: response.data, step: "sendEmail" }, statusCode: 200 });
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message}, statusCode: 500 });
    });
};
