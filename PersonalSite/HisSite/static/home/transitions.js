document.addEventListener('DOMContentLoaded', () => {
    const backGif = document.getElementById('backGif');
    const hotbar = document.getElementById('hotbar');
    const overlay = document.getElementById('transition-overlay');

    const contentArea = document.getElementById('content');
    const contentLoader = document.getElementById('contentLoader');
    const homeDialogue = document.getElementById('homeDialogue');

    const talk = new Audio('/static/home/dialogue/talk.wav');
    const backMusic = document.getElementById('backMusic');
    const muteButton = document.getElementById('muteButton');
    let playing = false;
    let talking = false

    // typewriter variables
    var i = 0;
    var txt = ''; 
    var speed = 50; 

    // typewriter effect
    function typeWriter() {
        if (i < txt.length) {
            const letter = talk.cloneNode();
            document.getElementById("hisDialogue").innerHTML += txt.charAt(i);
            i++;
            letter.play();
            setTimeout(typeWriter, speed);
            talking = true;
        } else {
            talking = false;
        }
    }

    // initialize dialogue on page load
    function initializeDialogue() {;
        const homeDialogue = document.getElementById('homeDialogue');
        if (homeDialogue) {
            i = 0;
            document.getElementById("hisDialogue").innerHTML = '';
            homeDialogue.addEventListener('mouseover', () => {
                if (!talking && i === 0) {
                    typeWriter();
                }
            });
        }
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

    setTimeout(() => {
        
    }, 200);

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

    // // home dialogue outline
    // document.addEventListener('mouseover', (e) => {
    //     homeDialogue.classList.add('appear');
    //     setTimeout(() => {
    //         txt = '* Hello! Welcome to my website. Feel free to explore around.';
    //     }, 1200);
    // }, { once: true });


    // create hotbar sfx
    const hoverSound = new Audio('/static/home/sound/hover.wav');
    const clickSound = new Audio('/static/home/sound/select.wav');
    hoverSound.volume = 0.1;
    clickSound.volume = 0.4;

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

            const response = await fetch(apiUrl);  // ✅ Changed from 'url' to 'apiUrl'
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

            // initilize text box
            initializeDialogue();   

            history.pushState({ page: pageName }, '', url);
            
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
            sound.volume = 0.3;
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

    // handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || '';
        const url = page === '' ? '/' : `/${page}/`;
        navigateTo(url, page);
    });

    
});
