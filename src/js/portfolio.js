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

// Get the modal
var modal = document.getElementById("modal");

// Get the image and insert it inside the modal
var images = document.querySelectorAll(".gallery-image");
var modalImg = document.getElementById("modal-image");
var captionText = document.getElementById("caption");

images.forEach(function(img) {
    img.addEventListener('click', function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    });
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}