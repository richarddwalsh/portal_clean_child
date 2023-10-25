const axios = require('axios');

exports.main = ({ context }, sendResponse) => {
  
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const ownersEndpoint = `https://api.hubapi.com/crm/v3/owners/`;
  const contactsEndpoint = `https://api.hubapi.com/contacts/v1/lists/717/contacts/all`;

  let ownerInfo = [];

  axios.get(ownersEndpoint, config)
    .then((ownersResponse) => {
      ownerInfo = ownersResponse.data.results.map(owner => ({ email: owner.email, id: Number(owner.id) }));
      return axios.get(contactsEndpoint, config);
    })
    .then((contactsResponse) => {
      const contactEmails = contactsResponse.data.contacts.map(contact => 
        contact['identity-profiles'][0].identities.find(identity => identity.type === "EMAIL").value
      );

      const matchingOwners = ownerInfo.filter(owner => contactEmails.includes(owner.email)).map(owner => ({
        label: owner.email,
        value: Number(owner.id)
      }));

      sendResponse({ body: { status: "success", results: matchingOwners, step: "get" }, statusCode: 200 });
    })
    .catch((error) => {
      sendResponse({ body: { status: "error", error: error.message, step: "get", config }, statusCode: 200 });
    });
};
