document.addEventListener('DOMContentLoaded', () => {
    const backGif = document.getElementById('backGif');
    const hotbar = document.getElementById('hotbar');
    const overlay = document.getElementById('transition-overlay');
    const contentArea = document.getElementById('content');
    const contentLoader = document.getElementById('contentLoader');
    
    setTimeout(() => {
        backGif.classList.add('loaded');
    }, 200);
    
    setTimeout(() => {
        hotbar.classList.add('moved');
        contentLoader.classList.add('moved');
    }, 1200);

    const hoverSound = new Audio('/static/home/sound/hover.wav');
    const clickSound = new Audio('/static/home/sound/select.wav');
    hoverSound.volume = 0.2;
    clickSound.volume = 0.4;

    async function navigateTo(url, pageName) {
        console.log('Navigating to:', url, 'Page:', pageName);
        
        clickSound.currentTime = 0;
        clickSound.play().catch(e => {});
        
        overlay.classList.add('slide-out');

        await new Promise(resolve => setTimeout(resolve, 600));
        
        try {
            console.log('Fetching:', url);
            const response = await fetch(url);
            const html = await response.text();
            
            console.log('Received HTML:', html.substring(0, 200)); 
            
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const newContent = newDoc.querySelector('#content');

            if (newContent) {
                contentArea.innerHTML = newContent.innerHTML;
            } else {
                contentArea.innerHTML = html;
            }
            console.log('Content updated');
            
            // Reposition overlay to right
            overlay.classList.add('prepare-slide-in');
            overlay.classList.remove('slide-out');
            contentLoader.classList.add('final');
            overlay.classList.add('slide-in');
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Slide overlay back in
            overlay.classList.remove('prepare-slide-in', 'slide-in');

            const displayUrl = pageName === '' ? '/' : `/${pageName}/`;
            history.pushState({ page: pageName }, '', displayUrl);
            
        } catch (error) {
            console.error('Navigation failed:', error);
            window.location.href = url;
        }
    }

    const buttons = document.querySelectorAll('.hotbarButton');
    
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

    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || '';
        const url = page === '' ? '/' : `/${page}/`;
        navigateTo(url, page);
    });
})