document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        const offset = 80; // Offset for other links

        if (targetElement) {
            if (this.getAttribute('href') === "#home") {
                // If it's the "Home" link, no offset is applied
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollToWithRamping(targetElement, offset);
            }
        }
    });
});

function scrollToWithRamping(targetElement, offset) {
    const start = window.scrollY;
    const targetPosition = targetElement.offsetTop - offset;
    const distance = targetPosition - start;
    // Adjustable, 750 seems to be the desired animation duration in milliseconds
    const duration = 750; 
    // This custom ease function I've created with the help of AI in order to create my desired effect of easing the navigation scroll effect to give a more modernized feel.
    const easingFunction = (t) => {
         // This conditional statement checks the value of 't' and because it's less than 0.5, it targets the first part of the animation
    return t < 0.5
        // This formula targets the first half of the animation and creates a cubic easing function that starts slowly but gradually accelerates multiplicatively
        ? 4 * t * t * t
        // This segment targets the second half of the animation from 0.5 to 1 and is a mirror to the first half in order to smoothen out deceleration of the animation.
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    //keeps tract of starting time of animation
    let startTime = null;
    //main animation function
    function scroll(currentTime) {
        if (!startTime) {
            startTime = currentTime;
        }

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easingFunction(progress);

        window.scrollTo(0, start + distance * easedProgress);
        //makes animation persistent
        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

//Typing animation for JavaScript Header
const header = document.getElementById('typing-header');
const textElement = document.getElementById('typing-text');
const typingSpeed = 75; // Adjust the typing speed in milliseconds
//Set default viewport value to false so element is empty on page load
let isElementInViewport = false;

function typeTextEffect() {
  const textToType = "Integrating JavaScript";
  //Clears text element to an empty string by default when not in viewport
  textElement.textContent = '';
    //typeCharacter element checks to see if the if the header is in the viewport, and if not, halts the animation
  function typeCharacter(charIndex = 0) {
    if (!isElementInViewport || charIndex >= textToType.length) return;
    //if the header is within the viewport, it appends the letters to be typed one by one according to the set delay in milliseconds dicated under typingSpeed variable
    textElement.textContent += textToType.charAt(charIndex);
    setTimeout(() => typeCharacter(charIndex + 1), typingSpeed);
  }
  //calls typeCharacter function
  typeCharacter();
}
//Utilize IntersectionObserver to check if the header element is within the viewport
const observer = new IntersectionObserver(entries => {
  isElementInViewport = entries[0].isIntersecting;
  //Clears text element if it is out of the viewport
  isElementInViewport ? typeTextEffect() : (textElement.textContent = '');
});
//Set the IntersectionObserver to observe the header element
observer.observe(header);
typeTextEffect();


// API url with call to fetch time based off of user IP location
const apiUrl = "http://worldtimeapi.org/api/ip";

// fetch and display clock data from API
function fetchClockData() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Fetch time from API response
            const datetime = data.datetime;

            const date = new Date(datetime);

            // Fetch the desired time components
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            // Determine if it's AM or PM
            const amOrPm = hours >= 12 ? 'PM' : 'AM';

            // Convert to 12-hour format
            const hours12 = hours % 12 || 12;

            // padStart adds padding so that the value always has two integers. If value provided has only one integer, adds a 0 to the start
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            // String that displays desired time format
            const formattedTime = `${hours12}:${formattedMinutes}:${formattedSeconds} ${amOrPm}`;

            // populate the correct div with appropriate information
            document.getElementById("clock-container").textContent = formattedTime;
        })
        .catch((error) => {
            console.error("Error fetching clock data: " + error);
        });
}

fetchClockData()

setInterval(function () {
    fetchClockData()
},1000);

const apiKey = "9b35244b1b7b8578e6c231fd7654c186";
const searchHistoryList = [];

// function for current condition
async function currentWeather(city) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(queryURL);
    const cityWeatherValue = await response.json();
    
    console.log(cityWeatherValue);

    document.getElementById("weatherContent").style.display = "block";
    document.getElementById("cityDetail").innerHTML = '';

    const iconCode = cityWeatherValue.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

    // displays temp, humidity, and wind speed
    const today = moment().format("L");
    const currentCity = `
      <h4 id="currentCity">
        ${cityWeatherValue.name} ${today} <img src="${iconURL}" alt="${cityWeatherValue.weather[0].description}" />
      </h4>
      <p>Temperature: ${cityWeatherValue.main.temp} °F</p>
      <p>Humidity: ${cityWeatherValue.main.humidity}%</p>
      <p>Wind Speed: ${cityWeatherValue.wind.speed} MPH</p>
    `;

    document.getElementById("cityDetail").innerHTML = currentCity;

    // UVI API
    const lat = cityWeatherValue.coord.lat;
    const lon = cityWeatherValue.coord.lon;
    const uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const uviResponse = await (await fetch(uviURL)).json();
    console.log(uviResponse);

    const uvIndex = uviResponse.value;
    const uvIndexColor = document.createElement("span");
    uvIndexColor.id = "uvIndexColor";
    uvIndexColor.className = "px-2 py-2 rounded";
    uvIndexColor.textContent = uvIndex;
    const uvIndexP = document.createElement("p");
    uvIndexP.innerHTML = "UV Index: ";
    uvIndexP.appendChild(uvIndexColor);

    document.getElementById("cityDetail").appendChild(uvIndexP);

    forecast(lat, lon, apiKey, cityWeatherValue.name);
  } catch (error) {
    console.error(error);
  }
}

// Search button that retrieves search history and enters the city of choice
document.getElementById("searchBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const city = document.getElementById("enterCity").value.trim();
  currentWeather(city);
  if (!searchHistoryList.includes(city)) {
    searchHistoryList.push(city);
    const searchedCity = document.createElement("li");
    searchedCity.className = "list-group-item";
    searchedCity.textContent = city;
    document.getElementById("searchHistory").appendChild(searchedCity);
  }

  localStorage.setItem("city", JSON.stringify(searchHistoryList));
  console.log(searchHistoryList);
});

// function for 5-day forecast
async function forecast(lat, lon, apiKey, cityName) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

  try {
    const response = await fetch(forecastURL);
    const forecastInfo = await response.json();
    console.log(forecastInfo);
    
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = '';

    for (let i = 1; i < 6; i++) {
      const cityInfo = {
        date: forecastInfo.daily[i].dt,
        icon: forecastInfo.daily[i].weather[0].icon,
        temp: forecastInfo.daily[i].temp.day,
        humidity: forecastInfo.daily[i].humidity,
      };

      const currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
      const iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${forecastInfo.daily[i].weather[0].main}" />`;

      // shows current date, icon, temperature, and humidity
      const forecastDisplay = `
        <div class="pl-3">
          <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;">
            <div class="card-body">
              <h5>${currDate}</h5>
              <p>${iconURL}</p>
              <p>Temp: ${cityInfo.temp} °F</p>
              <p>Humidity: ${cityInfo.humidity}%</p>
            </div>
          </div>
        </div>
      `;

      forecastElement.insertAdjacentHTML("beforeend", forecastDisplay);
    }
  } catch (error) {
    console.error(error);
  }
}

// Click function to display the current and future weather in the selected city
document.getElementById("searchHistory").addEventListener("click", function (event) {
  if (event.target && event.target.matches("li.list-group-item")) {
    const displayCity = event.target.textContent;
    currentWeather(displayCity);
  }
});

// Grabs the previously searched city from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  const searchHistoryArr = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null && searchHistoryArr.length > 0) {
    const lastSearchedCity = searchHistoryArr[searchHistoryArr.length - 1];
    currentWeather(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
  }
});