const canvas = document.getElementById('canvas');
var nav = document.getElementById('nav');
const c = canvas.getContext('2d');

//when the window is resized we make sure the canvas is still taking 
//up full width and height
//make sure canvas is taking up full width and height
function resizeCanvas() {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    //For some reason I need to set the canvas width twice. Not sure why but it works ¯\_(ツ)_/¯
    canvas.width = document.body.clientWidth;

}
resizeCanvas();

let spots = [];
let hue = 0;

//when the window is resized we make sure the canvas is still taking 
//up full width and height
window.addEventListener('resize', function(){
    resizeCanvas();
    init();
    //call update function on resize so we can make sure the text is centered
    text.update();
})

//initialize mouse x and y variables
const mouse = {
    x: undefined,
    y: undefined
}
const canvasOffsetY = 100;
canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.pageX;
    // -100 because of nav bar on top
    mouse.y = event.pageY - canvasOffsetY;
    for (let i = 0; i < 3; i++){
        spots.push(new Particle());
    }
});
canvas.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
})

class Particle{
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = "hsl(" + hue + ", 100%, 50%)";
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.03;
    }
    draw() {
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
    }
}

function handleParticle() {
    for (let i = 0; i < spots.length; i++){
        spots[i].update();
        spots[i].draw();
        for (let j = i; j < spots.length; j++){
            const dx = spots[i].x - spots[j].x;
            const dy = spots[i].y - spots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 90) {
                c.beginPath();
                c.strokeStyle = spots[i].color;
                c.lineWidth = spots[i].size / 10;
                c.moveTo(spots[i].x, spots[i].y);
                c.lineTo(spots[j].x, spots[j].y);
                c.stroke();
            }
        }
        if (spots[i].size <= 0.3) {
            spots.splice(i, 1); i--;
        }
    }
}


function welcomeText(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.draw = function() {
        c.fillStyle = 'white';
        c.font = 'bold ' + this.size + 'px Poppins';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('Welcome to my website!', this.x, this.y);
    }
    this.update = function() {
        this.draw();
        
        //make sure that text is recentered when resized
        this.x = (canvas.width/2);
        this.y = (canvas.height/2);

        if(mouse.x - this.x < 500 && mouse.x - this.x > -500 
            && mouse.y - this.y < 50 && mouse.y - this.y > -50){
            if (this.size < 120) {
                this.size++;
            }
        } else if(this.size > 100) {
            this.size--;
        }
    }
}

var text = new welcomeText((canvas.width/2),(canvas.height/2),100);

function Bubbles(x,y,dx,dy,radius, bubbleStoke){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.bubbleStoke = bubbleStoke;
    
    this.draw = function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0, Math.PI * 2, false);
        c.lineWidth = this.bubbleStoke;
        c.strokeStyle = 'rgb(255, 243, 211)';
        c.stroke();
    }
    this.update = function() {
        this.draw();

        if (this.x + this.radius > document.body.clientWidth || this.x - this.radius < 0 ) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0 ) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

var bubbleArray = [];

function init() {

    bubbleArray = [];
    for (var i = 0; i < 100; i ++) {
        var radius = (Math.random() * 80);
        var x = Math.random() * (document.body.clientWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5);
        var dy = (Math.random() - 0.5);
        var bubbleStoke = (Math.random() * 2);
    
        

        bubbleArray.push(new Bubbles(x,y,dx,dy,radius,bubbleStoke));
        
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0, canvas.width, canvas.height);
    for (var i = 0; i < bubbleArray.length; i++){
        bubbleArray[i].update();
    }
    text.update();
    handleParticle();
    hue++;
}
animate();
init();

