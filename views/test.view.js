const util = require('util');
const {
  resContacts,
  getCustomObjects,
} = require('../api-queries/huspots-queries');
const { isAuthorized, getAccessToken } = require('../oauth/oauth');

//========================================//
//   Displaying information to the user   //
//========================================//

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
    res.write(`<h4>Access token: ${accessToken}</h4>`);
    // console.log(objects);
    let propertyNames = [];
    for (let obj of objects) {
      propertyNames.push(obj.name);
      // console.log(util.inspect(objects, false, null, true /* enable colors */));
    }
    const obj1 = Object.assign({}, propertyNames);
    console.log(propertyNames[41]);
    // console.log(util.inspect(objects, false, null, true /* enable colors */));
    // console.log(JSON.stringify(objects, null, 2));
    displayContactName(res, contact);
  } else {
    res.write(`<a href="/install"><h3>Install the app</h3></a>`);
  }
  res.end();
};
