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

exports.getVehicleObject = async (hubspotClient) => {
  const objectType = 'p25582274_Vehicule';
  const archived = false;

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(
      objectType,
      archived
    );
    // console.log(
    //   util.inspect(apiResponse, false, null, true /* enable colors */)
    // );
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

const PropertyUpdate = {
  label: 'Calculated Update',
  type: 'calculation_equation',
  fieldType: 'calculation_equation',
  groupName: 'vehicule_information',
  options: [],
  displayOrder: -1,
  hidden: false,
  formField: false,
  calculationFormula: 'avancement_du_contrat * avancement_du_contrat',
};
const objectType = 'p25582274_Vehicule';
const propertyName = 'calculated_update';

exports.updateObjectProperty = async (hubspotClient) => {
  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.update(
      objectType,
      propertyName,
      PropertyUpdate
    );
    console.log(JSON.stringify(apiResponse.body, null, 2));
    console.log(
      util.inspect(apiResponse, false, null, true /* enable colors */)
    );
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};
