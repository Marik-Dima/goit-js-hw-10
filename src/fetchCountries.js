
// Модуль експортує функцію пошуку країни у вказаному ресурсі
// - Приймає імя країни як параметр
// - Робить GET запит на  API restcountries  з пошуком імя країни переданої у вхідному параметрі 
// - Якщо запит не успішний, викидає помилку зі статусом запиту
// - Якщо запит успішний , повертає відповіть в JSON форматі

const fetchCountryFields = 'name,capital,population,flags,languages'; // обєкт з полями які необхідно витягнути
export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}?fields=${fetchCountryFields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}