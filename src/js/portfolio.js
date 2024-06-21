const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', ()=> {
        nav.classList.toggle('nav-active');

        navLinks.forEach((link, index) => {
            if(link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + .3}s`;
            }
        });
    });
}
navSlide();

window.addEventListener('load', function() {
    adjustNavLinksPosition();
});

window.addEventListener('resize', function() {
    adjustNavLinksPosition();
});

function adjustNavLinksPosition() {
    var navHeight = document.querySelector('nav').offsetHeight;
    var navLinks = document.querySelector('.nav-links');
    navLinks.style.top = navHeight + 'px';
}