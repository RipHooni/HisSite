document.addEventListener('DOMContentLoaded', () => {
    const backGif = document.getElementById('backGif');
    const hotbar = document.getElementById('hotbar');
    
    setTimeout(() => {
        backGif.classList.add('loaded');
    }, 200);
    console.log('test');
    setTimeout(() => {
        hotbar.classList.add('moved');
    }, 1200);

    const hoverSound = new Audio('/static/home/sound/hover.wav');
    const selectSound = new Audio('/static/home/sound/select.wav');
    hoverSound.volume = 0.3;
    selectSound.volume = 0.3;

    const hotbarButtons = [
        document.getElementById('homeButton'),
        document.getElementById('aboutButton'),
        document.getElementById('projectButton'),
        // document.getElementById('linkButton')
    ];

    hotbarButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });
    });

    hotbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectSound.currentTime = 0;
            selectSound.play();

        });
        
    });
});