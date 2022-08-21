export const fetchCountries = searchKey => {
  return fetch(
    `https://restcountries.com/v3.1/name/${searchKey}?fields=name,capital,population,languages,flags`
  ).then(res => {
    if (res.status === 200) {
      return res.json();
    }

    if (res.status === 404) {
      return Promise.reject('not found');
    }
  });
};
