const axios = require('axios');
const util = require('util');

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
    return data;
  } catch (e) {
    console.log(e);
  }
};

exports.readProperties = async (accessToken) => {
  const url =
    'http://api.hubspot.com/crm/v3/objects/2-106219468/331593182?properties=avancement_du_contrat';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.get(url, { headers });
    const data = response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
};

exports.updateProperty = async (accessToken) => {
  let payload = JSON.stringify({
    properties: {
      avancement_du_contrat: '66',
    },
  });
  const config = {
    method: 'patch',
    url: 'http://api.hubspot.com/crm/v3/objects/2-106219468/331593182',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: payload,
  };

  try {
    const response = await axios(config);
    const data = response.data;
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
