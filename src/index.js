import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';

const inputEl = document.querySelector("#search-box");
const listEl = document.querySelector(".country-list");
const countryBox = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener("input", debounce(() => {
    const query = inputEl.value.trim();
    if (!query) {
        listEl.innerHTML = "";
        countryBox.innerHTML = "";
        return;
    }
    fetchCountries(query)
        .then((countries) => renderResult(countries))
        .catch((error) => Notify.failure(error.message));        
}, DEBOUNCE_DELAY))

// Функція рендеру результату пошуку
function renderResult(arrOfCountries) {
    if (arrOfCountries.length > 10) {
        return Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (arrOfCountries.length > 1 && arrOfCountries.length <= 10) {
        countryBox.innerHTML = "";
        renderList(arrOfCountries);
        return;
    } else {
        listEl.innerHTML = "";
        renderBox(arrOfCountries);
        return;
    }    
}

// Функція рендеру СПИСКУ країн
function renderList(array) {
    const markup = array.map(({ name, flags }) => 
     `<li class="list-item">
      <img src="${flags.svg}" alt="Country Flag" width="20" height="20">
      <span>${name.official}</span>
    </li>`).join("");

    listEl.innerHTML = markup;
}

// Функція рендеру КАРТКИ країни
function renderBox(array) {    
    const markup = array.map(({ name, capital, population, flags, languages }) => 
    `<div class="title-box">
      <img src="${flags.svg}" alt="flag" width="20" height="20">
      <h2>${name.official}</h2>
    </div>
    <ul>
      <li class="box-item">
        <p>Capital:</p>
        <span>${capital}</span>
      </li>
      <li class="box-item">
        <p>Population:</p>
        <span>${population}</span>
      </li>
      <li class="box-item">
        <p>Languages:</p>
        <span>${Object.values(languages).join(", ")}</span>
      </li>
    </ul>`).join("");

    countryBox.innerHTML = markup;
}