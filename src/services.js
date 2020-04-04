const saveSearched = function (countryCode) {
    const searchedCountries = JSON.parse(localStorage.getItem('searched_countries')) || [];

    const searchedItem = searchedCountries.find(s => s.countryCode == countryCode);

    const withoutSearched = searchedCountries.filter(s => s.countryCode != countryCode);
    
    withoutSearched.push({
        countryCode: countryCode,
        count: searchedItem ? searchedItem.count + 1 : 1
    });
    
    localStorage.setItem('searched_countries', JSON.stringify(withoutSearched));
}

const clearSearched = function () {
    localStorage.setItem('searched_countries', JSON.stringify([]));
}

const getSearched = function () {
    let searchedCountries = JSON.parse(localStorage.getItem('searched_countries')) || [];

    searchedCountries = searchedCountries.sort(function (a, b) {
        return b.count - a.count;
    });

    return searchedCountries.slice(0, 5);
}

module.exports = {
    saveSearched,
    clearSearched,
    getSearched
};