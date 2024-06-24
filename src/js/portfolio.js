//function that detects when the burger is clicked and then gives it the active class in css for it to drop down
hamburger = document.querySelector(".burger");
hamburger.onclick = function (){
    navBar = document.querySelector(".nav-links");
    navBar.classList.toggle("active");
}

//function that keep the mobile nav-links under the actual nav bar whenever resizing or loading
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