/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const axios = require('axios');

exports.main = async ({ body }, sendResponse) => {
  
  const { teamId, query } = body;

  if (!teamId) {
    sendResponse({ body: { status: "error", error: "teamId is required" }, statusCode: 400 });
    return;
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  };

  const associationsEndpoint = `https://api.hubapi.com/crm/v4/objects/teams/${teamId}/associations/contact`;
  const batchContactsEndpoint = "https://api.hubapi.com/crm/v3/objects/contacts/batch/read";

  const leaderAssociationId = 345;
  const memberAssociationId = 215;

  try {
    // Step 1: Get all associations
    const associationResponse = await axios.get(associationsEndpoint, config);
    const associations = associationResponse.data.results;

    // Step 2: Separate ids into leader and member arrays
    const leaderIds = new Set();
    const memberIds = new Set();

    associations.forEach(association => {
      const { toObjectId, associationTypes } = association;
      let isLeader = false;

      associationTypes.forEach(type => {
        if (type.typeId === leaderAssociationId) {
          leaderIds.add(toObjectId);
          isLeader = true;
        }
      });

      if (!isLeader) {
        associationTypes.forEach(type => {
          if (type.typeId === memberAssociationId) {
            memberIds.add(toObjectId);
          }
        });
      }
    });

    // Combine all ids into a single array for the batch request
    const allIds = [...new Set([...leaderIds, ...memberIds])];

    const batchRequestData = {
      idProperty: "hs_object_id",
      inputs: allIds.map(id => ({ id })),
      properties: [
        "firstname",
        "lastname",
        "email",
        "phone",
        "completed_one_fam",
        "birthday",
        "background_check_status"
      ]
    };

    // Step 3: Post the batch request to retrieve contact details
    const contactResponse = await axios.post(batchContactsEndpoint, batchRequestData, config);
    const contacts = contactResponse.data.results;

    // Step 4: Attach role information to each contact
    const contactsWithRole = contacts.map(contact => {
      let role = 'member';
      if (leaderIds.has(parseInt(contact.id))) {
        role = 'lead';
      }
      return {
        ...contact.properties,
        role
      };
    });

    // Return the final result
    sendResponse({ body: { status: "success", contacts: contactsWithRole }, statusCode: 200 });
  } catch (error) {
    sendResponse({ body: { status: "error", error: error.message }, statusCode: 200 });
  }
};
