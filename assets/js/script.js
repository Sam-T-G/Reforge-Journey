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
const apiUrl = "http://worldtimeapi.org/api/timezone/America/Los_Angeles";

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

// Define your API key
const apiKey = "9b35244b1b7b8578e6c231fd7654c186";

// Function to get real-time weather in LA
async function getCurrentWeather() {
  const city = "Los Angeles";
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(queryURL);
    const data = await response.json();

    // Extract desired weather information
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

     // Update HTML elements with weather data
     document.getElementById("temperature").textContent = temperature;
     document.getElementById("humidity").textContent = humidity;
     document.getElementById("wind-speed").textContent = windSpeed;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

getCurrentWeather().then((weatherData) => {
  if (weatherData) {
    console.log("Current Temperature:", weatherData.temperature, "°F");
    console.log("Humidity:", weatherData.humidity, "%");
    console.log("Wind Speed:", weatherData.windSpeed, "MPH");
  }
});