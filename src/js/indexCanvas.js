const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

//make sure canvas is taking up full width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let spots = [];
let hue = 0;

//when the window is resized we make sure the canvas is still taking 
//up full width and height
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    // -100 because of nav bar on top
    mouse.y = event.y - 100;
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

function animate() {
    c.clearRect(0,0, canvas.width, canvas.height);
    handleParticle();
    hue++;
    requestAnimationFrame(animate);
}
animate();

