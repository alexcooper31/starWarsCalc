const axios = require('axios');

const getShips = async () => {
  try {
    const data = await axios.get('https://swapi.dev/api/starships/');
    return data.data.results;
  } catch (e) {
    console.error(e);
  }
};

exports = module.exports = {
  getShips,
};
