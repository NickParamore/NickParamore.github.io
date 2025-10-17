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
    text.adjustSize(); // Adjust text size on window resize

    // Reinitialize bubbles but with zero opacity
    bubbleArray = [];
    for (var i = 0; i < numberOfBubbles; i++) {
        var minSize = bubbleSize * 0.5;
        var radius = Math.random() * (bubbleSize - minSize) + minSize;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5);
        var dy = (Math.random() - 0.5);
        var bubbleStoke = Math.random() * 1;

        // Add a fade-in property
        var bubble = new Bubbles(x, y, dx, dy, radius, bubbleStoke);
        bubble.opacity = 0; // start invisible
        bubbleArray.push(bubble);
    }
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
    if (trail.length < 2) return;

    c.save();
    c.lineWidth = 3;
    c.shadowBlur = 10;
    c.shadowColor = '#e6f1ff';
    c.lineJoin = 'round';
    c.lineCap = 'round';

    // Start the gradient-like fading path
    c.beginPath();
    c.moveTo(trail[0].x, trail[0].y);

    for (let i = 0; i < trail.length - 2; i++) {
        const p0 = trail[i];
        const p1 = trail[i + 1];
        const xc = (p0.x + p1.x) / 2;
        const yc = (p0.y + p1.y) / 2;
        c.quadraticCurveTo(p0.x, p0.y, xc, yc);
    }

    // Last segment
    const last = trail[trail.length - 1];
    c.lineTo(last.x, last.y);

    // Use the alpha of the first (oldest) point for overall opacity
    const avgAlpha = trail.reduce((sum, p) => sum + p.alpha, 0) / trail.length;
    c.strokeStyle = `rgba(230, 241, 255, ${avgAlpha})`;
    hue += 1; // slow color rotation
    const color = `hsl(${hue % 360}, 100%, 85%)`;
    c.strokeStyle = color;
    c.stroke();
    c.closePath();

    // Fade points gradually
    for (let i = 0; i < trail.length; i++) {
        trail[i].alpha -= trailFade;
        if (trail[i].alpha < 0) trail[i].alpha = 0;
    }

    // Remove fully invisible points
    trail = trail.filter(p => p.alpha > 0);
    c.restore();
}


function welcomeText(x, y, size) {
    this.x = x;
    this.y = 351; // start above the canvas
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

        const bubbleColor = `hsl(${(hue + this.x) % 360}, 100%, 75%)`;
        c.strokeStyle = bubbleColor;
        c.shadowBlur = 8;
        c.shadowColor = bubbleColor;

        // apply fade-in
        if (this.opacity < 1) this.opacity += 0.02; // adjust speed
        c.globalAlpha = this.opacity;

        c.stroke();
        c.shadowBlur = 0;
        c.globalAlpha = 1; // reset
    };
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

