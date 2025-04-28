const API_KEY = 'dd6f451e5f753f3ca0a2e6c8a192d0f6'; // Tu clave de OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

// Mostrar error
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  weatherResult.innerHTML = '';
}

// Ocultar error
function hideError() {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
}

// Mostrar clima
function displayWeather(data) {
  hideError();
  if (!data || data.cod !== 200) {
    displayError(data?.message || 'No se encontró la ciudad o hubo un error.');
    return;
  }
  const cityName = data.name;
  const temperature = (data.main.temp - 273.15).toFixed(1);
  const description = data.weather[0].description;
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherResult.innerHTML = `
    <h2 class="text-2xl font-semibold mb-2">${cityName}</h2>
    <img src="${iconUrl}" alt="${description}" class="mx-auto mb-2">
    <p class="text-xl mb-2">${temperature}°C</p>
    <p class="capitalize">${description}</p>
  `;
}

// Llamar API
async function fetchWeather(city) {
  if (!city) {
    displayError('Por favor, introduce el nombre de una ciudad.');
    return;
  }
  try {
    const apiUrl = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    displayError(error.message.includes('404') ? `Ciudad "${city}" no encontrada.` : 'Error al obtener los datos. Inténtalo luego.');
  }
}

// Eventos
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  fetchWeather(city);
});
cityInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const city = cityInput.value.trim();
    fetchWeather(city);
  }
});
