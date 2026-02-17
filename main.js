// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Three.js Hero Canvas (Basic Setup for particles/background)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const container = document.getElementById('hero-canvas-container');
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Floating Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff,
    transparent: true,
    opacity: 0.3
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Mouse Parallax for particles
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function animate() {
    requestAnimationFrame(animate);

    // Smooth movement for particles
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;

    if (mouseX > 0) {
        particlesMesh.position.x = (mouseX - window.innerWidth / 2) * 0.0001;
        particlesMesh.position.y = -(mouseY - window.innerHeight / 2) * 0.0001;
    }

    renderer.render(scene, camera);
}

animate();

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from('nav', {
        y: -100,
        opacity: 0,
        duration: 1.5
    })
        .from('.hero-left h1', {
            y: 100,
            opacity: 0,
            duration: 2,
            stagger: 0.2
        }, "-=1")
        .from('.hero-ctas .btn', {
            y: 30,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1
        }, "-=1.5")
        .from('.scroll-indicator', {
            opacity: 0,
            duration: 1
        }, "-=1");

    // Stat Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const val = parseInt(stat.getAttribute('data-val'));
        gsap.to(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 90%",
            },
            innerHTML: val,
            duration: 2,
            snap: { innerHTML: 1 },
            onUpdate: function () {
                // Formatting for large numbers if needed
            }
        });
    });

    // Reveal animations for sections
    const revealElements = document.querySelectorAll('.reveal-text, .section-title, .program-card, .coach-card');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });
});

// Window Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
