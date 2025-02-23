//  Vivek Prajapati
const API_KEY ="8696c063f7f5129d4cc294a616da97b9"; // Replace with your valid OpenWeatherMap API key
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feelsLike');
const loading = document.getElementById('loading');

document.getElementById('searchBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) getWeatherByLocation(location);
});

document.getElementById('currentLocationBtn').addEventListener('click', getWeatherByCurrentLocation);

async function getWeatherByLocation(location) {
    showLoading();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
            updateWeatherDisplay(data);
        } else if (data.cod === "404") {
            alert('Location not found! Please enter a valid city name.');
        } else if (data.cod === "401") {
            alert('Error: Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again later.');
    } finally {
        hideLoading();
    }
}

async function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    const data = await response.json();
                    if (data.cod === 200) {
                        updateWeatherDisplay(data);
                    } else if (data.cod === "401") {
                        alert('Error: Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.');
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Error fetching weather:', error);
                    alert('Error fetching weather data');
                } finally {
                    hideLoading();
                }
            },
            (error) => {
                hideLoading();
                alert('Unable to get your location');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function updateWeatherDisplay(data) {
    cityName.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = Math.round(data.main.temp);
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.style.display = 'block';
}

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

// Get weather for default location on load
getWeatherByLocation('London');