const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

// Ensure the canvas takes up full width and height
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let spots = [];
let hue = 0;
let numberOfBubbles = 100;

function scaleBubbles() {
    if (window.innerWidth > 1000) {
        numberOfBubbles = 100;
    } else {
        numberOfBubbles = 50;
    }
}
scaleBubbles();

window.addEventListener('resize', function () {
    scaleBubbles();
    resizeCanvas();
    text.adjustSize();  // Adjust text size on window resize
    init();
});

// Initialize mouse x and y variables
const mouse = {
    x: undefined,
    y: undefined
}
const canvasOffsetY = 100;
canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY - canvasOffsetY;
    for (let i = 0; i < 3; i++) {
        spots.push(new Particle());
    }
});
canvas.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
})

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = "#e6f1ff";
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
    for (let i = 0; i < spots.length; i++) {
        spots[i].update();
        spots[i].draw();
        for (let j = i; j < spots.length; j++) {
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

function welcomeText(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.maxSize = canvas.width * 0.06;  // 7% of canvas width
    this.minSize = canvas.width * 0.05;  // 5% of canvas width
    this.scaleIncrement = canvas.width * 0.0003; // Increment based on canvas width

    this.draw = function () {
        c.fillStyle = '#e6f1ff';
        c.font = 'bold ' + this.size + 'px Poppins';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('Welcome to my website!', this.x, this.y);
    }

    this.update = function () {
        // Ensure that text is recentered when resized
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        const hoverWidth = this.size * 5;
        const hoverHeight = this.size * 0.5;

        // Adjust size on mouse hover
        if (mouse.x - this.x < hoverWidth && mouse.x - this.x > -hoverWidth &&
            mouse.y - this.y < hoverHeight && mouse.y - this.y > -hoverHeight) {
            if (this.size < this.maxSize) {
                this.size += this.scaleIncrement; // Scale up incrementally
            }
        } else if (this.size > this.minSize) {
            this.size -= this.scaleIncrement; // Scale down incrementally
        }

        this.draw();
    }

    this.adjustSize = function () {
        this.maxSize = canvas.width * 0.06;  // 7% of canvas width
        this.minSize = canvas.width * 0.05;  // 5% of canvas width
        this.scaleIncrement = canvas.width * 0.0003; // Recalculate increment on resize
        this.size = this.minSize; // Reset to minSize on resize
        this.update();  // Ensure text is redrawn with the new size
    }
}

var text = new welcomeText((canvas.width / 2), (canvas.height / 2), (canvas.width * 0.05));

function Bubbles(x, y, dx, dy, radius, bubbleStoke) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.bubbleStoke = bubbleStoke;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.lineWidth = this.bubbleStoke;
        c.strokeStyle = '#64ffda';
        c.stroke();
    }
    this.update = function () {
        this.draw();

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

var bubbleArray = [];

function init() {
    bubbleArray = [];
    for (var i = 0; i < numberOfBubbles; i++) {
        var radius = (Math.random() * 80);
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5);
        var dy = (Math.random() - 0.5);
        var bubbleStoke = (Math.random() * 1);
        bubbleArray.push(new Bubbles(x, y, dx, dy, radius, bubbleStoke));
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bubbleArray.length; i++) {
        bubbleArray[i].update();
    }
    text.update();
    handleParticle();
    hue++;
}
animate();
init();

