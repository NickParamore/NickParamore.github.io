//function that detects when the burger is clicked and then gives it the active class in css for it to drop down
hamburger = document.querySelector(".burger");
hamburger.onclick = function (){
    navBar = document.querySelector(".nav-links");
    navBar.classList.toggle("active");
}