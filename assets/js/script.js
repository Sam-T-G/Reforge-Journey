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

            // String that displays desired time format
            const formattedTime = `${hours12}:${minutes}:${seconds} ${amOrPm}`;

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
