let isBroken = false;
let workingInterval = 1000;
let brokenInterval = 100;
let transitionDelay = 1000;
let intervalId;
let position = 'translate(-0%, -100%)';
var transitionTime = 1000;
let isTransitioning = false;

const clockConfigurations = [
    { type: 'analog', effect: 'foggy', backgroundUrl: 'assets/images/1.png' },
    { type: 'analog', effect: 'opacity', backgroundUrl: 'assets/images/3.png' },
    { type: 'digital', effect: 'foggy', backgroundUrl: 'assets/images/2.png' },
    { type: 'digital', effect: 'stuck', backgroundUrl: 'assets/videos/active.mp4' },
    { type: 'digital', effect: 'glitch', backgroundUrl: 'assets/images/4.png' },
    { type: 'analog', effect: 'foggy', backgroundUrl: 'assets/images/6.png' },
    { type: 'analog', effect: 'rusty', backgroundUrl: 'assets/images/7.png' },
];

// Define behaviors
const behaviors = ['rusty', 'opacity', 'flicker', 'stuck', 'glitch', 'foggy'];

// Create a clock hand with the clock-item class
function createClockHand(className, width, height, backgroundColor) {
    const hand = document.createElement('div');
    hand.classList.add('clock-hand', className);
    hand.style.width = width;
    hand.style.height = height;
    hand.style.backgroundColor = backgroundColor;
    hand.style.position = 'absolute';
    hand.style.top = '50%';
    hand.style.left = '50%';
    hand.style.transformOrigin = '0% 100%';
    hand.style.transform = `${position} rotate(0deg)`;
    return hand;
}

// Create a wrapper for the clock hands
function createClockHandWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('clock-hand-wrapper');
    wrapper.style.position = 'relative';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.transform = 'translate(-50%, -50%)';
    return wrapper;
}

// Create a digital clock display
function createDigitalClock() {
    const digitalClock = document.createElement('div');
    digitalClock.classList.add('digital-clock');
    digitalClock.style.position = 'absolute';
    digitalClock.style.top = '50%';
    digitalClock.style.left = '50%';
    digitalClock.style.transform = 'translate(-50%, -50%)';

    const hourSpan = document.createElement('span');
    hourSpan.classList.add('hour');
    digitalClock.appendChild(hourSpan);

    const colonSpan = document.createElement('span');
    colonSpan.textContent = ':';
    colonSpan.classList.add('colon');
    digitalClock.appendChild(colonSpan);

    const minuteSpan = document.createElement('span');
    minuteSpan.classList.add('minute');
    digitalClock.appendChild(minuteSpan);

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('date');

    digitalClock.append(dateSpan);
    return digitalClock;
}

function initializeClocks(clockConfigurations) {
    const clockItems = document.querySelectorAll('.clock-item');
    clockItems.forEach((clock, index) => {
        if (index >= clockConfigurations.length) {
            return;
        }

        const config = clockConfigurations[index];
        const borderRadius = window.getComputedStyle(clock).borderRadius;

       

        // Assign the effect and background image to each clock
        clock.dataset.effect = config.effect;

        clock.classList.add(config.effect);
        if (config.backgroundUrl) {
            if (config.backgroundUrl.endsWith('.mp4')) {
                // Create a video element for the clock
                const video = document.createElement('video');
                video.src = config.backgroundUrl;
                video.id = 'vid';

                video.style.width = '100%';
                video.style.height = '100%';
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.zIndex = '-1';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.src = 'assets/videos/idle.mp4';
                video.id = 'vidIdle';

                const video1 = document.createElement('video');
                video1.src = 'assets/videos/active.mp4';
                video1.style.width = '100%';
                video1.style.height = '100%';
                video1.style.position = 'absolute';
                video1.style.top = '0';
                video1.style.left = '0';
                video1.style.zIndex = '-1';
                video1.autoplay = true;
                video1.loop = true;
                video1.muted = true;
                video1.id = 'vidActive';

                clock.appendChild(video);
                clock.appendChild(video1);

            } else {
                // Create an image element for the clock
                const img = document.createElement('img');
                img.src = config.backgroundUrl;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.zIndex = '-1';
                img.classList.add('background-image');

                if (index === 0) {
                    img.style.height = '104%';
                    img.style.top = '-25px';
                }

                clock.appendChild(img);
            }
        }

         if (config.type === 'analog') {
            const wrapper = createClockHandWrapper();
            const clockWidth = clock.offsetWidth;

            const hourHand = createClockHand('hour-hand', `${clockWidth * 0.4}px`, '8px', 'black');
            const minuteHand = createClockHand('minute-hand', `${clockWidth * 0.45}px`, '6px', 'black');
            const secondHand = createClockHand('second-hand', `${clockWidth * 0.5}px`, '4px', 'red');

            wrapper.appendChild(hourHand);
            wrapper.appendChild(minuteHand);
            wrapper.appendChild(secondHand);
            clock.appendChild(wrapper);
        } else if (config.type === 'digital') {
            if (config.backgroundUrl.endsWith('.mp4')) {
                return;
            }
            const digitalClock = createDigitalClock();
            clock.appendChild(digitalClock);
        }
    });
}


function updateClocks() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedTime = now.toLocaleTimeString([], options);
    const [formattedHour, formattedMinute] = formattedTime.split(':');

    const dateOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    let formattedDate = now.toLocaleDateString('en-US', dateOptions);
    

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12 || 12;

    // console.log(`Current Time: ${hours}:${minutes}:${seconds}`);

    // Second Hand
    let secondDegrees = ((seconds / 60) * 360) - 90;
    if (secondDegrees < 0) {
        secondDegrees += 360;
    }

    // Minute Hand
    let minuteDegrees = ((minutes / 60) * 360 + (seconds / 60) * 6) - 90;
    if (minuteDegrees < 0) {
        minuteDegrees += 360;
    }

    // Hour Hand
    let hourDegrees = ((hours / 12) * 360 + (minutes / 60) * 30 + (seconds / 3600) * 30) - 90;
    if (hourDegrees < 0) {
        hourDegrees += 360;
    }

    if (isTransitioning) {
        // During transition, use normal behavior
        document.querySelectorAll('.second-hand').forEach(hand => {
            const transformValue = `${position} rotate(${secondDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms, opacity ${transitionTime}ms`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });

        document.querySelectorAll('.minute-hand').forEach(hand => {
            const transformValue = `${position} rotate(${minuteDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms ease-in-out, opacity ${transitionTime}ms ease-in-out`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });

        document.querySelectorAll('.hour-hand').forEach(hand => {
            const transformValue = `${position} rotate(${hourDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms ease-in-out, opacity ${transitionTime}ms ease-in-out`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });

         document.querySelectorAll('.digital-clock').forEach(clock => {
            clock.style.transition = `opacity ${transitionTime}ms ease-in-out`;
            clock.style.opacity = '1';
        
            // Select existing span elements for hour and minute
            const hourSpan = clock.querySelector('.hour');
            const minuteSpan = clock.querySelector('.minute');
        
            // Update the content of the existing spans
            if (hourSpan) {
                hourSpan.textContent = formattedHour;
            }
        
            if (minuteSpan) {
                minuteSpan.textContent = formattedMinute;
            }
        });

        document.querySelectorAll('.clock-item').forEach(clock => {
            clock.style.transition = `opacity ${transitionTime}ms ease-in-out, background-image ${transitionTime}ms ease-in-out`;
            clock.style.opacity = '1';
            clock.style.backgroundImage = ''; // Remove rust image
        });
    } else if (isBroken) {
        document.querySelectorAll('.clock-item').forEach(clock => {
            const effect = clock.dataset.effect;
            if (effect === 'random') {
                // Randomly rotate hands
                clock.querySelectorAll('.second-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 360}deg)`;
                });
                clock.querySelectorAll('.minute-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 360}deg)`;
                });
                clock.querySelectorAll('.hour-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 360}deg)`;
                });
            } else if (effect === 'stuck') {
                // Stuck hands
                const stuckDegrees = Math.random() * 360;
                clock.querySelectorAll('.second-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${stuckDegrees}deg)`;
                });
                clock.querySelectorAll('.minute-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${stuckDegrees}deg)`;
                });
                clock.querySelectorAll('.hour-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${stuckDegrees}deg)`;
                });
            } else if (effect === 'foggy') {
                clock.style.transition = 'transform 0.1s ease-in-out, filter 0.1s ease-in-out, background-image 3s ease-in-out';
                clock.querySelectorAll('.second-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });
                clock.querySelectorAll('.minute-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });
                clock.querySelectorAll('.hour-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });

                if (!clock.classList.contains('foggy-effect-added')) {
                    // Add glass img
                    const glass = document.createElement('img');
                    glass.src = 'assets/images/glass.jpg';
                    glass.classList.add('glass-image');
                    glass.style.animationDelay = '0s';
                    clock.appendChild(glass);

                    const fogImages = ['fog1.png', 'fog1.png', 'fog3.png'];
                    fogImages.forEach((src, index) => {
                        const img = document.createElement('img');
                        img.src = `assets/images/fog/${src}`;
                        img.classList.add('fog-image');
                        img.style.animationDelay = `${index * 0.5}s`;
                        clock.appendChild(img);
                    });

                    // Add rain effect
                    for (let i = 0; i < 100; i++) {
                        const raindrop = document.createElement('div');
                        raindrop.classList.add('raindrop');
                        raindrop.style.left = `${Math.random() * 100}%`;
                        raindrop.style.animationDelay = `${Math.random() * 2}s`;
                        clock.appendChild(raindrop);
                    }

                    // Mark that the fog images have been added
                    clock.classList.add('foggy-effect-added');

                    const colonSpan = clock.querySelector('.colon');
                    if (colonSpan) {
                        colonSpan.style.animation = 'blink 0.2s infinite';
                    }
                }
            } else if (effect === 'opacity') {
                clock.style.transition = 'opacity 0.5s ease-in-out'; // Reduced transition duration
                clock.style.opacity = '0.5';

                clock.querySelectorAll('.second-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`;
                });
                clock.querySelectorAll('.minute-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`;
                });
                clock.querySelectorAll('.hour-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`;
                });
            } else if (effect === 'flicker') {
                // Flickering clock
                clock.style.transition = 'opacity 0.05s ease-in-out'; // Reduced transition duration
                clock.style.opacity = Math.random() > 0.1 ? '1' : '0';
            } else if (effect === 'rusty') {
                // Rusty behavior: erratic movement and shaking effect
                clock.style.transition = 'transform 0.1s ease-in-out, filter 0.1s ease-in-out, background-image 3s ease-in-out';
                clock.querySelectorAll('.second-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });
                clock.querySelectorAll('.minute-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });
                clock.querySelectorAll('.hour-hand').forEach(hand => {
                    hand.style.transform = `${position} rotate(${Math.random() * 3600}deg)`; // Spin wildly
                });
            } else if (effect === 'glitch') {
                // Glitch behavior: random transformations and opacity changes for the whole clock
                clock.style.transition = 'none';
                clock.style.opacity = Math.random() > 0.5 ? '1' : '0.5';
            }
            clock.querySelectorAll('.digital-clock').forEach(clock => {
                const hours = Math.floor(Math.random() * 12) + 1; // Random hour between 1 and 12
                const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0'); // Random minute between 00 and 59

                // Select existing span elements for hour and minute
                const hourSpan = clock.querySelector('.hour');
                const minuteSpan = clock.querySelector('.minute');

                // Update the content of the existing spans
                if (hourSpan) {
                    hourSpan.textContent = hours.toString().padStart(2, '0');
                }

                if (minuteSpan) {
                    minuteSpan.textContent = minutes;
                }

                const randomDate = new Date(Date.now() + Math.floor(Math.random() * 10000000000));
    
                // Format the random date
                const dateOptions = { month: 'short', day: 'numeric', weekday: 'short' };
                let formattedDate = randomDate.toLocaleDateString('en-US', dateOptions);
                
                // Find the .date element and set its text content
                const dateSpan = clock.querySelector('.date');
                if (dateSpan) {
                    dateSpan.textContent = formattedDate;
                }
            });
        });
    } else {

        document.querySelectorAll('.second-hand').forEach(hand => {
            const transformValue = `${position} rotate(${secondDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms, opacity ${transitionTime}ms`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });
        document.querySelectorAll('.minute-hand').forEach(hand => {
            const transformValue = `${position} rotate(${minuteDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms ease-in-out, opacity ${transitionTime}ms ease-in-out`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });
        document.querySelectorAll('.hour-hand').forEach(hand => {
            const transformValue = `${position} rotate(${hourDegrees}deg)`;
            hand.style.transition = `transform ${transitionTime}ms ease-in-out, opacity ${transitionTime}ms ease-in-out`;
            hand.style.transform = transformValue;
            hand.style.opacity = '1';
        });

             document.querySelectorAll('.digital-clock').forEach(clock => {
            clock.style.transition = `opacity ${transitionTime}ms ease-in-out`;
            clock.style.opacity = '1';
        
            // Select existing span elements for hour and minute
            const hourSpan = clock.querySelector('.hour');
            const minuteSpan = clock.querySelector('.minute');
        
            // Update the content of the existing spans
            if (hourSpan) {
                hourSpan.textContent = formattedHour;
            }
        
            if (minuteSpan) {
                minuteSpan.textContent = formattedMinute;
            }


            const colonSpan = clock.querySelector('.colon');
            if (colonSpan) {
                colonSpan.style.animation = 'none';
            }

            const dateSpan = clock.querySelector('.date');

            if(dateSpan) {
                dateSpan.textContent = formattedDate;
            }
            
        });

        document.querySelectorAll('.clock-item').forEach(clock => {
            clock.style.transition = `opacity ${transitionTime}ms ease-in-out, background-image ${transitionTime}ms ease-in-out`;
            clock.style.opacity = '1';
            clock.style.transform = 'translate(0, 0) rotate(0)'; // Reset transform
            clock.style.filter = 'none'; // Reset filter

            // Remove fog effect
            if (clock.classList.contains('foggy-effect-added')) {
                clock.querySelectorAll('.fog-image').forEach(img => {
                    img.style.transition = 'opacity 5s ease-in-out';
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.remove();
                    }, 1000); // Remove after transition
                });
                clock.classList.remove('foggy-effect-added');
            }

            // Remove rain effect
            clock.querySelectorAll('.raindrop').forEach(raindrop => {
                raindrop.remove();
            });

            //remove glass image
            clock.querySelectorAll('.glass-image').forEach(glass => {
                glass.remove();
            });

            // Reset background image
            const background = clock.querySelector('.background-image');
            if (background) {
                background.style.filter = 'none';
            }
        });
    }
}

function toggleBrokenState(shouldBeBroken) {
    if (shouldBeBroken) {
        isTransitioning = true;
        setTimeout(() => {
            const idle = document.getElementById('vidIdle');
            const active = document.getElementById('vidActive');
            idle.style.display = 'block';
            active.style.display = 'none';

            isBroken = true;
            isTransitioning = false;
            clearInterval(intervalId);
            intervalId = setInterval(updateClocks, Math.random() * (brokenInterval - 1000) + 1000);
            updateClocks();
        }, transitionTime);
    } else {
        isBroken = false;
        
        clearInterval(intervalId);
        setTimeout(() => {
            const idle = document.getElementById('vidIdle');
            const active = document.getElementById('vidActive');
            idle.style.display = 'none';
            active.style.display = 'block';
            intervalId = setInterval(updateClocks, workingInterval);
            updateClocks();
        }, transitionDelay);
    }
    updateClocks();
}



initializeClocks(clockConfigurations);
intervalId = setInterval(updateClocks, workingInterval);
updateClocks();