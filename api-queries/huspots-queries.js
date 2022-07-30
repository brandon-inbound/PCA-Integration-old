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

exports.readProperties = async (accessToken) => {
  let contractProgress = '';
  const url =
    'http://api.hubspot.com/crm/v3/objects/2-106219468/331593182?properties=date_releve_kilometrage&properties=date_de_debut_du_contrat&properties=duree_du_contrat&properties=date_de_fin_du_contrat&properties=releve_kilometrage';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.get(url, { headers });
    const data = response.data;
    const {
      date_de_debut_du_contrat,
      date_releve_kilometrage,
      duree_du_contrat,
      date_de_fin_du_contrat,
      releve_kilometrage,
    } = data.properties;

    const getProgress = (startDate, endDate) => {
      const total = +endDate - +startDate;
      const elaps = Date.now() - startDate;
      contractProgress = Math.round((elaps / total) * 100) + '%';
      return contractProgress;
    };

    let contractStartDate = new Date(date_de_debut_du_contrat);
    let contractEndDate = new Date(date_de_fin_du_contrat);
    let mileageStatementDate = new Date(date_releve_kilometrage);
    let mileageStatement = releve_kilometrage;
    // let contractDuration = parseFloat(duree_du_contrat);
    // console.log('Start Month: ', contractStartDate);
    // console.log('End Month: ', contractEndDate);
    // console.log(getProgress(contractStartDate, contractEndDate));

    // Get months difference function
    const getMonthDifference = (startDate, endDate) => {
      return (
        endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear())
      );
    };

    console.log(
      'Months difference',
      getMonthDifference(mileageStatementDate, contractEndDate)
    );

    // Get projected Kilometers
    let projectedKMs =
      mileageStatement *
      getMonthDifference(mileageStatementDate, contractEndDate);
    console.log('This the Projected Kilometers: ', projectedKMs);

    // Testing
    let startDateFormat = new Date(2018, 11, 24);

    let addDate = startDateFormat.setMonth(startDateFormat.getMonth() + 45);

    console.log(
      `${new Date(addDate).getFullYear()}-${
        new Date(addDate).getMonth() + 1
      }-${new Date(addDate).getUTCDate()}`
    );
    // Update Contract Progress
    updateContractProgress(accessToken, contractProgress, projectedKMs);

    return data;
  } catch (e) {
    console.log(e);
  }
};

const updateContractProgress = async (
  accessToken,
  contractProgress,
  projectedKMs
) => {
  let payload = JSON.stringify({
    properties: {
      avancement_du_contrat: `${contractProgress}`,
      km_theorique_fin_de_contrat: `${projectedKMs}`,
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
    // console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
