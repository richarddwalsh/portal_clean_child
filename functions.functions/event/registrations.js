/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  const { eventId } = body;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  const query = {
    limit: 100,
    properties: [
        "name"
    ],
    filterGroups: [
        {
            filters: [
                {
                    propertyName: "event_id",
                    operator: "EQ",
                    value: eventId
                }
            ]
        }
    ]
  }

  const registrationsEndpoint = `https://api.hubapi.com/crm/v3/objects/registrations/search`;

  axios
    .post( registrationsEndpoint, JSON.stringify(query), config )
    .then(response => response.data.results)
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "getEvents" }, statusCode: 200 });
    })
    .then(registrations => {
      // create promise to get contact info for each registration
      // save the contact to attendees array

      const attendess = [];
      const registrationPromises = registrations.map(registration => {
      const { id } = registration;
      const assoicationEndpoint = `https://api.hubapi.com/crm/v4/objects/registrations/${id}/associations/contacts`;
      return axios.get(assoicationEndpoint, config)
        .then(response => {
          const { results } = response.data;
          const { properties } = results[0];
          const { firstname, lastname, email } = properties;
          const attendee = { firstname, lastname, email };
          return attendee;
        })
        .catch(error => {
          sendResponse({ body: { status: "error", error: error.message, step: "getEvents" }, statusCode: 200 });
        })
      });

      
     
    });
};