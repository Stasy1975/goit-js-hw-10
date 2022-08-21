import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
  inputEl: document.querySelector('#search-box'),
};

const getCountryName = e => e.target.value.trim().toLowerCase();

const renderMarkup = countriesList => {
  if (countriesList.length > 10) {
    return Promise.reject('too many');
  }

  if (countriesList.length > 1) {
    return {
      type: 'list',
      markup: countriesList
        .map(
          country =>
            `<li><span><img  class="flag" src=${country.flags.svg} alt="flag"></span>
            <p>${country.name.official}</p></li>`
        )
        .join(''),
    };
  }
  if (countriesList.length === 1) {
    const country = countriesList[0];
    return {
      type: 'one',
      markup: `
    <span><img class="flag" src=${country.flags.svg} alt="flag"></span>
    <h2>${country.name.official}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${Object.values(country.languages)}</p>    
    `,
    };
  }
};
// ;

const clearResult = () => {
  refs.infoEl.innerHTML = '';
  refs.listEl.innerHTML = '';
};

const addSearchResult = searchResultMarkup => {
  clearResult();

  if (searchResultMarkup.type === 'list') {
    refs.listEl.insertAdjacentHTML('beforeend', searchResultMarkup.markup);
  } else if (searchResultMarkup.type === 'one') {
    refs.infoEl.insertAdjacentHTML('beforeend', searchResultMarkup.markup);
  }
};

const alarmToMany = () => {
  clearResult();
  Notify.warning('Too many matches found. Please enter a more specific name.');
};

const alarmNotFound = () => {
  clearResult();
  Notify.failure('Oops, there is no country with that name');
};

const errorsHandler = error => {
  if (error === 'not found') {
    alarmNotFound();
    return;
  }
  if (error === 'too many') {
    alarmToMany();
    return;
  }
  console.log(error);
};

const doSearch = e => {
  const searchedCountry = getCountryName(e);

  if (searchedCountry === '') {
    clearResult();
    return;
  }

  fetchCountries(searchedCountry)
    .then(renderMarkup)
    .then(addSearchResult)
    .catch(errorsHandler);
};

refs.inputEl.addEventListener('input', debounce(doSearch, DEBOUNCE_DELAY));
