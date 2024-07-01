const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const video1 = document.getElementById("myVideo");
const video2 = document.getElementById("myVideo2");
const apiKey = "98fa083a2e0bb3bdae39351a8f1de2bf";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    //destructure json file for the data I want
    const { name: city, 
           main: { temp, humidity },
           weather: [{ description, id }] } = data;
    //reset text content
    card.textContent = "";
    //make card visible again
    card.style.display = "flex";

    //create new elements
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    // setting the video source and transitioning
    setWeatherBackground(id);

    //set text content to new elements
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    //add styles to new elements
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    //append new elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

//get different weather emoji based on id
function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

//get different video background based on id
function getWeatherBackground(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "/images/stormy.mp4";
        case (weatherId >= 300 && weatherId < 400):
            return "/images/rainy.mp4";
        case (weatherId >= 500 && weatherId < 600):
            return "/images/rainy.mp4";
        case (weatherId >= 600 && weatherId < 700):
            return "/images/snowy.mp4";
        case (weatherId >= 700 && weatherId < 800):
            return "/images/foggy.mp4";
        case (weatherId === 800):
            return "/images/sunny.mp4";
        case (weatherId >= 801 && weatherId < 810):
            return "/images/cloudy.mp4";
        default:
            return "/images/default-weather.mp4";
    }
}

//set video background and add transition effect using two video sources
function setWeatherBackground(weatherId) {
    const newSrc = getWeatherBackground(weatherId);
    const currentVideo = video1.style.opacity === "1" ? video1 : video2;
    const newVideo = currentVideo === video1 ? video2 : video1;

    newVideo.src = newSrc;
    newVideo.addEventListener("loadeddata", () => {
        currentVideo.style.opacity = "0";
        newVideo.style.opacity = "1";
    }, { once: true });
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}