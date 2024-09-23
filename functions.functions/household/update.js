/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = async ({ body }, sendResponse) => {
  
  if (typeof(body) === "undefined") {
    return sendResponse({ body: { status: "error", error: "No body provided.", step: "validateBody" }, statusCode: 400 });
  }

  const { 
    householdId,
    hs_object_id,
    first_name,
    last_name,
    email,
    phone,
    birthday,
    member_type,
    using_household_email,
    household_contact_type
  } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  };

  const contactData = {
    firstname: first_name,
    lastname: last_name,
    email,
    phone,
    birthday,
    using_household_email,
    household_contact_type
  };

  const householdAssociationData = [
    {
      associationCategory: "USER_DEFINED",
      associationTypeId: member_type
    }
  ];

  try {
    // First, update the contact properties
    const updateContactResponse = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${hs_object_id}`,
      { properties: contactData },
      config
    );

    // Then, update the association
    const updateAssociationResponse = await axios.put(
      `https://api.hubapi.com/crm/v4/objects/contacts/${hs_object_id}/associations/households/${householdId}`,
      householdAssociationData,
      config
    );

    return sendResponse({ 
      body: { 
        status: "success",
        originalData: body, 
        contactResponse: updateContactResponse.data,
        associationResponse: updateAssociationResponse.data,
        step: "updateHousehold" 
      }, 
      statusCode: 200 
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return sendResponse({ 
      body: { 
        status: "error", 
        error: error.response ? error.response.data : error.message, 
        step: "updateHousehold" 
      }, 
      statusCode: error.response ? error.response.status : 500 
    });
  }
};