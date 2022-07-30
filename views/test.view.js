const hubspot = require('@hubspot/api-client');
let hubspotClient;

const util = require('util');
const {
  resContacts,
  getCustomObjects,
  getVehicleObject,
  updateObjectProperty,
  readProperties,
  readPropertiesAxios,
  getProperties,
  getObjectsAPI,
  updateProperty,
  readPropertiesII,
  updateProperties,
  testProperties,
  queryObjects,
} = require('../api-queries/huspots-queries');
const { isAuthorized, getAccessToken } = require('../oauth/oauth');

//======================================================//
//   Displaying test information info to the browser   //
//======================================================//

const displayContactName = (res, contact) => {
  for (val of contact) {
    res.write(
      `<p>Contact name: ${val.properties.firstname} ${val.properties.lastname}</p>`
    );
  }
};

exports.renderView = async (req, res) => {
  // res.setHeader('Content-Type', 'text/html');
  // res.write(`<h2>HubSpot OAuth 2.0 PCA Services App</h2>`);
  let authorized = await isAuthorized(req.sessionID);
  if (authorized) {
    const accessToken = await getAccessToken(req.sessionID);
    hubspotClient = new hubspot.Client({ accessToken: `${accessToken}` });
    const contact = await resContacts(accessToken);

    // displayContactName(res, contact);
    // readProperties(accessToken);
    // testProperties(accessToken);
    queryObjects(hubspotClient, accessToken);
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
};
