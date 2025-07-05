const apiKey = "76433b9819a0c3904646ae80b46b9db4";

// DOM Elements
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const sectionMessage = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherImg = document.querySelector(".weather-summary-img");
const forecastContainer = document.querySelector(".forecast-scroll-container");

// Search event
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    fetch(weatherURL)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) throw new Error(data.message);

            // Show weather section
            weatherInfoSection.style.display = "flex";
            sectionMessage.style.display = "none";

            // Fill in weather data
            countryTxt.textContent = data.name;
            tempTxt.textContent = `${Math.round(data.main.temp)} °C`;
            conditionTxt.textContent = data.weather[0].main;
            humidityValueTxt.textContent = `${data.main.humidity}%`;
            windValueTxt.textContent = `${data.wind.speed} M/s`;

            // Use OpenWeather icon
            const iconCode = data.weather[0].icon;
            weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // Format date
            currentDateTxt.textContent = formatDate(new Date());
        })
        .catch(err => {
            alert("City not found!");
        });

    // Fetch 5-day forecast
    fetch(forecastURL)
        .then(res => res.json())
        .then(data => {
            forecastContainer.innerHTML = "";

            const forecastMap = {};

            data.list.forEach(item => {
                const date = item.dt_txt.split(" ")[0];
                if (!forecastMap[date] && item.dt_txt.includes("12:00:00")) {
                    forecastMap[date] = item;
                }
            });

            const forecastItems = Object.values(forecastMap).slice(0, 5);

            forecastItems.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("forecast-card");

                const date = new Date(item.dt * 1000);
                const shortDate = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("default", { month: "short" })}`;

                const iconCode = item.weather[0].icon;

                card.innerHTML = `
                    <p class="forecast-date">${shortDate}</p>
                    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon" class="forecast-icon">
                    <p class="forecast-temp">${Math.round(item.main.temp)} °C</p>
                `;
                forecastContainer.appendChild(card);
            });
        });
}

// Format date like Wed, 07 Aug
function formatDate(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]},${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}`;
}
