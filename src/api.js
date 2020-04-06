const axios = require('axios');

const getCountryHistorical = function (countryCode) {
    const url = `https://corona.lmao.ninja/v2/historical/${countryCode}?lastdays=all`;
    return axios.get(url).then(res => {
        return res.data;
    });
}

module.exports = {
    getCountryHistorical
};