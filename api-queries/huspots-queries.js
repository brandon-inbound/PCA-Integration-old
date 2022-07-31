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

exports.apiQueryAndOperations = async (hubspotClient, accessToken) => {
  const objectType = '2-106219468';
  const limit = 10;
  const after = undefined;
  const properties = [
    'date_de_debut_du_contrat',
    'date_releve_kilometrage',
    'duree_du_contrat',
    'date_de_fin_du_contrat',
    'releve_kilometrage',
    'kilometrage_total_prevu_contrat',
  ];
  const propertiesWithHistory = undefined;
  const associations = undefined;
  const archived = false;

  try {
    const apiResponse = await hubspotClient.crm.objects.basicApi.getPage(
      objectType,
      limit,
      after,
      properties,
      propertiesWithHistory,
      associations,
      archived
    );

    // All Operations will take place inside the for loop
    for (res of apiResponse.results) {
      // console.log(res.properties);
      const getProgress = (startDate, endDate) => {
        let progress = '';
        const total = +endDate - +startDate;
        const elaps = Date.now() - startDate;
        progress = Math.round((elaps / total) * 100) + '%';
        return progress;
      };

      let contractStartDate = new Date(res.properties.date_de_debut_du_contrat);
      let contractEndDate = new Date(res.properties.date_de_fin_du_contrat);
      let mileageStatementDate = new Date(
        res.properties.date_releve_kilometrage
      );
      let mileageStatement = res.properties.releve_kilometrage;
      let totalPlannedMileage = res.properties.kilometrage_total_prevu_contrat;
      let contractDuration = parseFloat(res.properties.duree_du_contrat);

      // Contract Progress
      const contractProgress = getProgress(contractStartDate, contractEndDate);
      console.log('Contract Progress: ', contractProgress);

      // Get month difference function
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
      console.log('This is the Projected Kilometers: ', projectedKMs);

      // Mileage gap between Contract KMs and Projected KMs
      const calcMileageGap = (projectedKMs / totalPlannedMileage) * 100;
      const mileageGap = parseFloat(calcMileageGap.toFixed(2)) || 0;
      console.log('Mileage gap: ', mileageGap);

      // Update Properties
      updateProperty(
        res.id,
        accessToken,
        contractProgress,
        projectedKMs,
        mileageGap
      );
    }
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

// exports.readProperties = async (accessToken) => {
//   let contractProgress = '';
//   const url =
//     'http://api.hubspot.com/crm/v3/objects/2-106219468/331593182?properties=date_releve_kilometrage&properties=date_de_debut_du_contrat&properties=duree_du_contrat&properties=date_de_fin_du_contrat&properties=releve_kilometrage&properties=kilometrage_total_prevu_contrat';
//   const headers = {
//     Authorization: `Bearer ${accessToken}`,
//     'Content-Type': 'application/json',
//   };
//   try {
//     const response = await axios.get(url, { headers });
//     const data = response.data;
//     const {
//       date_de_debut_du_contrat,
//       date_releve_kilometrage,
//       duree_du_contrat,
//       date_de_fin_du_contrat,
//       releve_kilometrage,
//       kilometrage_total_prevu_contrat,
//     } = data.properties;

//     const getProgress = (startDate, endDate) => {
//       const total = +endDate - +startDate;
//       const elaps = Date.now() - startDate;
//       contractProgress = Math.round((elaps / total) * 100) + '%';
//       return contractProgress;
//     };

//     let contractStartDate = new Date(date_de_debut_du_contrat);
//     let contractEndDate = new Date(date_de_fin_du_contrat);
//     let mileageStatementDate = new Date(date_releve_kilometrage);
//     let mileageStatement = releve_kilometrage;
//     let totalPlannedMileage = kilometrage_total_prevu_contrat;
//     // let contractDuration = parseFloat(duree_du_contrat);
//     // console.log('Start Month: ', contractStartDate);
//     // console.log('End Month: ', contractEndDate);
//     // console.log(getProgress(contractStartDate, contractEndDate));

//     // Get months difference function
//     const getMonthDifference = (startDate, endDate) => {
//       return (
//         endDate.getMonth() -
//         startDate.getMonth() +
//         12 * (endDate.getFullYear() - startDate.getFullYear())
//       );
//     };

//     console.log(
//       'Months difference',
//       getMonthDifference(mileageStatementDate, contractEndDate)
//     );

//     // Get projected Kilometers
//     let projectedKMs =
//       mileageStatement *
//       getMonthDifference(mileageStatementDate, contractEndDate);
//     console.log('This the Projected Kilometers: ', projectedKMs);

//     // Mileage gap between Contract KMs and Projected KMs
//     const calcMileageGap = (projectedKMs / totalPlannedMileage) * 100;
//     const mileageGap = calcMileageGap.toFixed(2);
//     console.log('Mileage gap: ', mileageGap);

//     // Update Contract Progress
//     updateContractProgress(
//       accessToken,
//       contractProgress,
//       projectedKMs,
//       mileageGap
//     );

//     return data;
//   } catch (e) {
//     console.log(e);
//   }
// };

const updateProperty = async (
  id,
  accessToken,
  contractProgress,
  projectedKMs,
  mileageGap = 0
) => {
  let payload = JSON.stringify({
    properties: {
      avancement_du_contrat: `${contractProgress}`,
      km_theorique_fin_de_contrat: `${projectedKMs}`,
      ecart_kilometrage: `${mileageGap}`,
    },
  });
  const config = {
    method: 'patch',
    url: `http://api.hubspot.com/crm/v3/objects/2-106219468/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: payload,
  };

  try {
    const response = await axios(config);
    const data = response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
};
