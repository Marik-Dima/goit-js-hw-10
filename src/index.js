
import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries'; // імпорт функції пошуку країни на API
const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const searchResultsList = document.querySelector('.country-list');
const searchResultsInfo = document.querySelector('.country-info');

// створюємо функцію для очистки переліку країн та інформації про них
const clearCountryElements = () => {
  searchResultsList.innerHTML = '';
  searchResultsInfo.innerHTML = '';
};

// функція створення  елементів списку для кожної країни в масиві
const createCountryListItems = countries => {
  const listItems = countries.map(country => {
    const listItem = document.createElement('li');
    listItem.className = 'country-list__item';
    listItem.innerHTML = `
      <img class="country-list__image" src="${country.flags.svg}" alt="Flag of ${country.name}">
      <span>${country.name}</span>
    `;
    return listItem;
  });
  return listItems;
};

// функція створення елементу списку для отриманного імені та значення
const createCountryInfoListItem = (name, value) => {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<strong>${name}:</strong> ${value}`;
  return listItem;
};

// функція створення елементів інформації про країну
const createCountryInfo = country => {
  const header = document.createElement('div');
  header.className = 'country-info__header';
  header.innerHTML = `
    <img class="country-info__image" src="${country.flags.svg}" alt="Flag of ${country.name}">
    <span>${country.name}</span>
  `;

  const list = document.createElement('ul');
  list.className = 'country-info__list';

  const capitalItem = createCountryInfoListItem('Capital', country.capital);
  const populationItem = createCountryInfoListItem('Population', country.population);
  const languagesItem = createCountryInfoListItem(
    'Languages',
    country.languages.map(language => language.name).join(', ')
  );

  list.append(capitalItem, populationItem, languagesItem);
  return [header, list];
};

// Функція debounced для отримання та відображення даних про країну на основі запиту користувача
const populateCountryHtml = debounce(event => {
  const searchString = event.target.value.trim();
  if (!searchString) {
    clearCountryElements();
    return;
  }
    
// чистимо перелік
    clearCountryElements();
    

// фетцч функція запиту та виводу інформації про країну
  fetchCountries(event.target.value)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (data.length > 1) {
        clearCountryElements();
        searchResultsList.append(...createCountryListItems(data));
      } else {
        const [header, list] = createCountryInfo(data[0]);
        searchResultsInfo.innerHTML = '';
        searchResultsInfo.append(header, list);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}, DEBOUNCE_DELAY);

//прослуховувач подій інпуту для виконання функції populateCountryHtml
searchInput.addEventListener('input', populateCountryHtml);
