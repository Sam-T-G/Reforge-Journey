// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function(e) {
//         e.preventDefault();

//         const targetId = this.getAttribute('href').substring(1);
//         const targetElement = document.getElementById(targetId);
//         const offset = 80; //offsets the navigation link so that the persistent navigation bar at the top does not cut into the next segment.

//         if (targetElement) {
//             // Added a smooth scroll behavior for a more modern feel to the page
//             if (this.getAttribute('href') === "#home") {
//                 // This conditional check makes it so that the home link takes you all the way to the top of the page
//                 window.scrollTo({
//                     top: 0,
//                     behavior: 'smooth'
//                 });
//             } else {
//                 const targetPosition = targetElement.offsetTop - offset;
//                 window.scrollTo({
//                     top: targetPosition,
//                     behavior: 'smooth'
//                 });
//             }
//         }
//     });
// });

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
    const start = window.pageYOffset;
    const targetPosition = targetElement.offsetTop - offset;
    const distance = targetPosition - start;
    const duration = 750;
    const easingFunction = customEase;

    let startTime = null;

    function step(currentTime) {
        if (!startTime) {
            startTime = currentTime;
        }

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easingFunction(progress);

        window.scrollTo(0, start + distance * easedProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// This custom ease function I've created with the help of AI in order to create my desired effect of easing the navigation scroll effect to give a more modernized feel.
function customEase(t) {
    // This conditional statement checks the value of 't' and because it's less than 0.5, it targets the first part of the animation
    return t < 0.5
    // This formula targets the first half of the animation and creates a cubic easing function that starts slowly but gradually accelerates multiplicatively
        ? 4 * t * t * t
    // This segment targets the second half of the animation from 0.5 to 1 and is a mirror to the first half in order to smoothen out deceleration of the animation.
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

