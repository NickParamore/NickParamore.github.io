//function that detects when the burger is clicked and then gives
//both the burger and the nav-links the active class in css for it to
//animate the burger icon and also drop down the nav-links
hamburger = document.querySelector(".burger");
navBar = document.querySelector(".nav-links");
hamburger.onclick = function (){
    navBar.classList.toggle("active");
    hamburger.classList.toggle("active")
}