document.addEventListener('DOMContentLoaded', () => {
    const backGif = document.getElementById('backGif');
    const hotbar = document.getElementById('hotbar');
    const overlay = document.getElementById('transition-overlay');

    const contentArea = document.getElementById('content');
    const contentLoader = document.getElementById('contentLoader');
    // const homeDialogue = document.getElementById('homeDialogue');

    const errorSound = new Audio('/static/home/sound/error.wav');

    const talk = new Audio('/static/home/dialogue/talk.wav');
    const backMusic = document.getElementById('backMusic');
    const muteButton = document.getElementById('muteButton');
    let playing = false;
    let talking = false

    const resumeButton = document.getElementById('resumeButton');

    function initializeResumeButton() {
        resumeButton.addEventListener('mouseenter', () => {
            const sound = hoverSound.cloneNode();
            sound.volume = 0.07;
            sound.play().catch(e => {});
        });
        resumeButton.addEventListener('click', (e) => {
            resumeButton.classList.remove('notWorking');
            void resumeButton.offsetWidth; // reflow to reset animation
            resumeButton.classList.add('notWorking');

            const error = errorSound.cloneNode();
            error.volume = 0.07;
            error.play().catch(e => {});
        });
    }

    let introPlayed = false;

    // initialize dialogue on page load
    async function initializeFirstDialogue() {
        let page = window.location.pathname.replaceAll('/', '')
        const homeDialogue = document.getElementById('homeDialogue');

        console.log('page: ', page);
        console.log('introplayed: ', introPlayed);
        if (!introPlayed && (page === 'home' || page === '')) {
            async function firstDialogueSeq() {
                await typeWriter(page, 50, '* Hello! Welcome to my website. `You can use the hotbar below to navigate to other pages.', 2000);
                await typeWriter(page, 50, '* If the music is too loud `the button in the top right will pause it...', 2000);
                await typeWriter(page, 50, '* And if I\'m boring you, `click on any text box to finish the current dialogue and again to skip to the next. ``But you wouldn\'t do that...', 2000);
                await typeWriter(page, 100, '* Right...?', 2000);
                await typeWriter(page, 350, '. . .', 100);
                setTimeout(() => {
                    homeDialogue.classList.remove('appear');
                }, 1000);
            }
            setTimeout(() => {
                homeDialogue.classList.add('appear');
                firstDialogueSeq()
            }, 1500);
            introPlayed = true;
        }
    }

    // initialize first visit stuff
    initializeResumeButton()
    initializeProjects();
    initializeAbout();
    initializeFirstDialogue();
    initializeLinks();

    // typewriter effect
    async function typeWriter(currentPage, speed, text, waitTime) {
        // variable prep
        var i = 0;
        talking = true;
        let skip = false;
        let cancel = false;
        document.getElementById("hisDialogue").innerHTML = "";
        const homeDialogue = document.getElementById("homeDialogue");
        
        // skip dialogue function
        const skipDialogue = () => {
            if (skip) {
                cancel = true;
            } else {
                skip = true;
            }
        };

        // // time between messages
        // function wait(ms) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // wait and check for cancel
        function checkWait(ms, checkFn, interval = 50) {
            return new Promise(resolve => {
                const start = Date.now();
                const check = () => {
                    if (checkFn()) {
                        resolve(); // stop waiting early
                    } else if (Date.now() - start >= ms) {
                        resolve(); // full time passed
                    } else {
                        setTimeout(check, interval); // check again soon
                    }
                };
                check();
            });
        }

        if (!homeDialogue) { return; }

        // check if box has been clicked
        homeDialogue.addEventListener('click', skipDialogue);

        while (i < text.length) {

            // check for skip
            if (skip) {
                talk.volume = 0.15;
                talk.play();
                console.log('skipping to end of dialogue')
                talking = false;
                document.getElementById("hisDialogue").innerHTML = text.replaceAll('`', '');;
                await checkWait(waitTime, () => cancel);
                skip = false;
                return;
            }

            // check if page change
            let page = window.location.pathname.replaceAll('/', '');
            if (currentPage !== page) {
                talking = false;
                return;
            }

            // create sound for letter
            const letter = talk.cloneNode();
            letter.volume = 0.15;
            
            // add character
            if (text.charAt(i) != '`') {
                document.getElementById("hisDialogue").innerHTML += text.charAt(i);
                // talk
                if (text.charAt(i) !== ' ') {
                    letter.play();
                }
            } else {
                await checkWait(250, () => cancel);
            }
            i++;

            // wait for next character
            await checkWait(speed, () => cancel);
        }

        // stop typing
        talking = false;
        await checkWait(waitTime, () => cancel);

        homeDialogue.removeEventListener('click', skipDialogue);
    }

    // load background 
    setTimeout(() => {
        backGif.classList.add('loaded');
    }, 200);
    
    // load hotbar and page contents
    setTimeout(() => {
        hotbar.classList.add('moved');
        contentLoader.classList.add('moved');
        muteButton.classList.add('moved');
        
    }, 1200);
    
    // start music on first interaction
    document.addEventListener('mousedown', (e) => {
        backMusic.volume = 0.02;
        backMusic.muted = false;
        backMusic.play().catch(e => {});
        muteButton.style.backgroundImage = "url('/static/home/images/paused.svg')";
    }, { once: true });

    // pause/unpause music button
    muteButton.addEventListener('click', (e) => {
        clickSound.play().catch(e => {});
        playing = !playing;
        i = 0;

        if (playing) {
            muteButton.style.backgroundImage = "url('/static/home/images/play.svg')";
            backMusic.pause();
        } else {
            muteButton.style.backgroundImage = "url('/static/home/images/paused.svg')";
            backMusic.play().catch(e => {});
        }
    });

    // create hotbar sfx
    const hoverSound = new Audio('/static/home/sound/hover.wav');
    const clickSound = new Audio('/static/home/sound/select.wav');
    hoverSound.volume = 0.07;
    clickSound.volume = 0.2;

    // hotbar navigation
    async function navigateTo(url, pageName) {
        console.log('Navigating to:', url, 'Page:', pageName);
        
        clickSound.currentTime = 0;
        clickSound.play().catch(e => {});
        
        overlay.classList.add('slide-out');

        await new Promise(resolve => setTimeout(resolve, 600));
        
        try {
            // get api point from url
            const apiUrl = `/api/${pageName}/`;
            console.log('Fetching from API:', apiUrl);

            const response = await fetch(apiUrl);
            const html = await response.text();
            
            console.log('Received HTML:', html.substring(0, 200));

            // update html with api contents
            contentArea.innerHTML = html;
            console.log('Content updated');
            
            // prepare transition
            overlay.classList.add('prepare-slide-in');
            overlay.classList.remove('slide-out');
            contentLoader.classList.add('final');
            overlay.classList.add('slide-in');
            
            // wait for transition
            await new Promise(resolve => setTimeout(resolve, 50));
            
            overlay.classList.remove('prepare-slide-in', 'slide-in');

            // update url
            history.pushState({ page: pageName }, '', url);

            // initialize page specific scripts
            initializeAbout();
            initializeProjects();
            initializeFirstDialogue();
            initializeLinks();

        } catch (error) {
            console.error('Navigation failed:', error);
            window.location.href = url;
        }
    }

    const buttons = document.querySelectorAll('.hotbarButton');
    // hotbar button hover sound and click sound/navigation
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const sound = hoverSound.cloneNode();
            sound.volume = 0.07;
            sound.play().catch(e => {});
            
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Button clicked:', button.id);
            
            const url = button.getAttribute('href');
            const page = button.getAttribute('data-page');
            
            console.log('URL:', url, 'Page:', page);
            
            navigateTo(url, page);
        });
    });


    // about page item interactions
    function initializeAbout() {;
        const aboutItems = document.querySelectorAll('.aboutItem');
        aboutItems.forEach(button => {
            const item = button.getAttribute('id');
            button.addEventListener('mouseenter', () => {
                const sound = hoverSound.cloneNode();
                sound.volume = 0.07;
                sound.play().catch(e => {});
                
            });
            let selected;
            button.addEventListener('click', (e) => {
                const sound = clickSound.cloneNode();
                sound.volume = 0.2;
                sound.play().catch(e => {});

                if (item == "info") {
                    document.getElementById('description').innerText = "Hi! I'm Liam and I'm a developer of about 4 years. I'm very passionate about technology and have been around computers for virtually my entire life.\n\nWhile the vast majority of my experience is spent on back-end, I'd hope its clear I believe one of the biggest parts of programming, beyond mere problem solving, is being at least a little bit creative.";
                } else if (item == "skills") {
                    document.getElementById('description').innerText = "I have a sizeable amount of experience in Python, Java, CSS/HTML and SQL. I also have experience with C, C++ and a limited familiarity with JavaScript.\n\nI also have experience with software such as Blender, Aseprite and Photoshop and some light usage of video editing software like Adobe After Effects and Premiere Pro.";
                } else if (item == "exp") {
                    document.getElementById('description').innerText = "I'm currently a third year Computer Science student as Arizona State University. You can find some of the projects I've worked on here! ( press projects button :D )";

                } else if (item == "extra") {
                    document.getElementById('description').innerText = "Extra information if you're curious :D. Up until college, I had played football for nearly 14 years and while I may or may not be able to stand it anymore, I still enjoy working out in my free time.\n\nI also enjoy video games (clearly), music and art. My all time favorite game is Elden Ring and my current favorite artists are Kmoe and Jane Remover.";

                } else {
                    document.getElementById('description').innerText = "";
                }
            });
        });
    }

    function initializeProjects() {
        const projectItems = document.querySelectorAll('.projectItem');
        
        projectItems.forEach(button => {
            const item = button.getAttribute('id');
            button.addEventListener('mouseenter', () => {
                const sound = hoverSound.cloneNode();
                sound.volume = 0.07;
                sound.play().catch(e => {});
                
            });
            button.addEventListener('click', (e) => {
                const sound = clickSound.cloneNode();
                sound.volume = 0.2;
                sound.play().catch(e => {});

                if (item == "fManip") {
                    document.getElementById('projDescTitle').innerText = "File Manipulator";
                    document.getElementById('projDescTitle').onclick = () => { window.open("https://github.com/RipHooni/Simple-GUI-File-Format-Converter", "_blank"); };
                    document.getElementById('projDescText').innerText = "Incredibly basic image format manipulator built with Tkinter. It is capable of conversion between PNG, JPG and PDF formats. It is also capable of merging any number of PDFs into a single file. Was made mostly to make turning in school assignments easier.";
                } else if (item == "thissite") {
                    document.getElementById('projDescTitle').innerText = "This website!";
                    document.getElementById('projDescTitle').onclick = () => { window.open("https://github.com/RipHooni/HisSite", "_blank"); };
                    document.getElementById('projDescText').innerText = "Suprise! Who would've guess I made the website. It's been built with Django for the backend api calls and potential future database queries as well as vanilla JS/CSS for the frontend interaction/display. All assets are heavily inspired by Toby Fox and replicated or outright made by me in Aseprite!";
                } else if (item == "stuqa") {
                    document.getElementById('projDescTitle').innerText = "Student Q&A Platform ( WIP )";
                    document.getElementById('projDescTitle').onclick = () => { 
                        document.getElementById('projDescTitle').classList.remove('notWorkingText');
                        void document.getElementById('projDescTitle').offsetWidth;
                        document.getElementById('projDescTitle').classList.add('notWorkingText');

                        const error = errorSound.cloneNode();
                        error.volume = 0.07;
                        error.play().catch(e => {});
                    };
                    document.getElementById('projDescText').innerText = "Java based application using JavaFX for GUI and MySQL for database queries. The program aims to allow students a collaborative space to ask questions and receive answers from their peers or others. The platforms administration is powered by both staff and peer allocated permissions to ensure a productive and \"even\" environment.";
                } else {
                    document.getElementById('projDescText').innerText = "";
                    document.getElementById('projDescPreview').innerText = "";
                }
            });
        });
    }

    function initializeLinks() {
        const links = document.querySelectorAll('.linkItem');
        links.forEach(button => {
            const item = button.getAttribute('id');
            button.addEventListener('mouseenter', () => {
                const sound = hoverSound.cloneNode();
                sound.volume = 0.07;
                sound.play().catch(e => {});
                
            });
            button.addEventListener('click', (e) => {
                const sound = clickSound.cloneNode();
                sound.volume = 0.2;
                sound.play().catch(e => {});

                if (item == "githubLink") {
                    window.open("https://github.com/RipHooni", "_blank");
                } else if (item == "linkedinLink") {
                    window.open("https://www.linkedin.com/in/liam-vi-kennedy/", "_blank");
                } else if (item == "twitterLink") {
                    window.open("https://twitter.com/riphooni", "_blank");
                } else if (item == "instagramLink") {
                    window.open("https://www.instagram.com/_liam.kennedy_/", "_blank");
                } else if (item == "twitchLink") {
                    window.open("https://www.twitch.tv/riphooni", "_blank");
                } else if (item == "youtubeLink") {
                    window.open("https://www.youtube.com/@riphooni", "_blank");
                } else if (item == "spotifyLink") {
                    window.open("https://open.spotify.com/user/q1vlihwqa40psd872co23hlen", "_blank");
                } else if (item == "malLink") {
                    window.open("https://myanimelist.net/profile/RipHooni", "_blank");
                } else if (item == "discordLink") {
                    window.open("https://discord.com/users/332934899134889984", "_blank");
                }
            });
        });
    }
        

    // handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || '';
        const url = page === '' ? '/' : `/${page}/`;
        navigateTo(url, page);
    });

    
});
