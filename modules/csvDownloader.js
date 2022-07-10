const axios = require('axios').default;
const fsPromises = require("fs/promises");

module.exports = async function getInterestsCSV() {
  try {
    const file = await axios.get('https://www.bde.es/webbde/es/estadis/infoest/series/be1901.csv');
    await fsPromises.writeFile('./assets/rates.csv', file.data);
    return './assets/rates.csv';
  } catch(error) {
    console.log('%c La actualización de los índices de interéses no está disponible.', 'color: red');
  }
}
