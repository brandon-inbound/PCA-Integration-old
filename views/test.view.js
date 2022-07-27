const hubspot = require('@hubspot/api-client');
let hubspotClient;

const util = require('util');
const {
  resContacts,
  getCustomObjects,
  getVehicleObject,
  updateObjectProperty,
  createProperty,
  readProperties,
  readPropertiesAxios,
  getProperties,
  getObjectsAPI,
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
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2>HubSpot OAuth 2.0 PCA Services App</h2>`);
  let authorized = await isAuthorized(req.sessionID);
  if (authorized) {
    const accessToken = await getAccessToken(req.sessionID);
    const contact = await resContacts(accessToken);

    const objects = await getCustomObjects(accessToken);
    hubspotClient = new hubspot.Client({ accessToken: `${accessToken}` });
    const propRead = await readProperties(accessToken);
    // console.log(util.inspect(objects, false, null, true /* enable colors */));
    console.log(util.inspect(propRead, false, null, true /* enable colors */));
    // console.log(util.inspect(contact, false, null, true /* enable colors */));
    // getVehicleObject(hubspotClient);
    // updateObjectProperty(hubspotClient);
    // createProperty(hubspotClient);
    // getProperties(hubspotClient);
    // getObjectsAPI(hubspotClient);
    // res.write(`<h4>Access token: ${accessToken}</h4>`);
    // displayContactName(res, contact);
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
};
