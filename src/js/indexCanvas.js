const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

// Ensure the canvas takes up full width and height
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let trail = [];
const maxTrailLength = 30; // How many points the trail keeps
const trailFade = 0.05;    // Opacity reduction per frame
let hue = 0;
let numberOfBubbles = 0;
let bubbleSize = 0;

function scaleBubbles() {
    if (window.innerWidth > 1000) {
        numberOfBubbles = 30;
        bubbleSize = 80;
    } else {
        numberOfBubbles = 15;
        bubbleSize = 70;
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
canvas.addEventListener('mousemove', function(event) {
    const x = event.pageX;
    const y = event.pageY - canvasOffsetY;

    mouse.x = x;
    mouse.y = y;

    trail.push({ x, y, alpha: 1 }); // alpha = full opacity
    if (trail.length > maxTrailLength) trail.shift();
});
canvas.addEventListener('mouseout', function () {
    trail = []; // Clear trail when mouse leaves canvas
    mouse.x = undefined;
    mouse.y = undefined;
})

function drawMouseTrail() {
    c.save(); // ← save current drawing state
    for (let i = 0; i < trail.length - 1; i++) {
        const p1 = trail[i];
        const p2 = trail[i + 1];

        c.strokeStyle = `rgba(230, 241, 255, ${p1.alpha})`;
        c.lineWidth = 4;
        c.shadowBlur = 20;
        c.shadowColor = '#e6f1ff';
        c.beginPath();
        c.moveTo(p1.x, p1.y);
        c.lineTo(p2.x, p2.y);
        c.stroke();

        p1.alpha -= trailFade;
        if (p1.alpha < 0) p1.alpha = 0;
    }
    c.restore(); // ← restore to previous state (no glow, no shadow)
}

function welcomeText(x, y, size) {
    this.x = x;
    this.y = 350; // start above the canvas
    this.targetY = y; // final resting position (center)
    this.size = size;
    this.maxSize = canvas.width * 0.06;  
    this.minSize = canvas.width * 0.05;  

    this.targetSize = this.size;
    this.scaleSpeed = 0.04;

    this.dropSpeed = 0.03; // easing for drop-down effect

    this.draw = function () {
        c.fillStyle = '#e6f1ff';
        c.font = 'bold ' + this.size + 'px Poppins';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('Welcome to my website!', this.x, this.y);
    }

    this.update = function () {
        // Smooth drop-down animation
        this.y += (this.targetY - this.y) * this.dropSpeed;

        this.x = canvas.width / 2;

        // Measure actual text width for hover
        c.font = 'bold ' + this.size + 'px Poppins';
        const textMetrics = c.measureText('Welcome to my website!');
        const textWidth = textMetrics.width;
        const textHeight = this.size; 

        // Hover detection
        if (mouse.x >= this.x - textWidth/2 && mouse.x <= this.x + textWidth/2 &&
            mouse.y >= this.y - textHeight/2 && mouse.y <= this.y + textHeight/2) {
            this.targetSize = this.maxSize;
        } else {
            this.targetSize = this.minSize;
        }

        // Smoothly adjust size
        this.size += (this.targetSize - this.size) * this.scaleSpeed;

        this.draw();
    }

    this.adjustSize = function () {
        this.maxSize = canvas.width * 0.06;
        this.minSize = canvas.width * 0.05;
        this.size = this.minSize;
        this.targetSize = this.size;
        this.targetY = canvas.height / 2;
        this.update();
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

        var minSize = bubbleSize * 0.5; // adjust 0.5 → 0.7 for even larger bubbles
        var radius = Math.random() * (bubbleSize - minSize) + minSize;

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

    drawMouseTrail(); // safely wrapped in c.save()/c.restore()

    text.update(); // always drawn on top, crisp and glow-free

    hue++;
}
animate();
init();

