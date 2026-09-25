const canvas = document.getElementById("network");

const ctx = canvas.getContext("2d");

let particles = [];

let mouse = {
    x: null,
    y: null,
    radius: 150
};

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}

class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        this.size = Math.random() * 1.8 + 0.6;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
        }

        if (mouse.x !== null && mouse.y !== null) {

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance < mouse.radius) {

                const force =
                    (mouse.radius - distance) /
                    mouse.radius;

                this.x += (dx / distance) * force * 0.8;
                this.y += (dy / distance) * force * 0.8;
            }
        }
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(129, 140, 248, 0.75)";

        ctx.fill();
    }
}

function createParticles() {

    particles = [];

    const amount =
        Math.min(
            100,
            Math.floor(
                (canvas.width * canvas.height) / 14000
            )
        );

    for (let i = 0; i < amount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx =
                particles[a].x -
                particles[b].x;

            const dy =
                particles[a].y -
                particles[b].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {

                const opacity =
                    1 - distance / 130;

                ctx.strokeStyle =
                    `rgba(129, 140, 248, ${opacity * 0.16})`;

                ctx.lineWidth = 1;

                ctx.beginPath();

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.stroke();
            }
        }
    }
}

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(particle => {

        particle.update();
        particle.draw();

    });

    connectParticles();

    requestAnimationFrame(animate);
}

window.addEventListener(
    "resize",
    resizeCanvas
);

window.addEventListener(
    "mousemove",
    event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

    }
);

window.addEventListener(
    "mouseleave",
    () => {

        mouse.x = null;
        mouse.y = null;

    }
);

resizeCanvas();

animate();


const revealElements =
    document.querySelectorAll(".reveal");

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );

revealElements.forEach(element => {

    observer.observe(element);

});
