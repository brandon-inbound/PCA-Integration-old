const axios = require('axios');

// ==================================================== //
//    Using an Access Token to Query the HubSpot API    //
// ==================================================== //

// Get Contacts
exports.resContacts = async (accessToken) => {
  const contacts = 'http://api.hubspot.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get(contacts, { headers });
  const data = response.data.results;
  return data;
};

// Get custom objects from HubSpot
exports.getCustomObjects = async (accessToken) => {
  const objects = 'http://api.hubspot.com/crm/v3/schemas';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.get(objects, { headers });
    const data = response.data.results;
    return data[0].properties;
  } catch (e) {
    console.log(e);
  }
};
