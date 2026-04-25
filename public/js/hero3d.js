// ═══════════════════════════════════════════════════════════════
//  VIT-AP UNIVERSITY — THREE.JS HERO 3D SCENE
//  "Digital Convergence" — Immersive glassmorphic floating cards
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── GUARD ──
  if (!document.getElementById('heroCanvas')) return;
  if (typeof THREE === 'undefined') { console.warn('Three.js not loaded'); return; }

  // ── CONSTANTS ──
  const CARD_DATA = [
    { title: 'SCOPE', sub: 'Computer Science & Engineering', icon: '💻' },
    { title: 'SENSE', sub: 'Electronics Engineering', icon: '⚡' },
    { title: 'SAS',   sub: 'Advanced Sciences', icon: '🔬' },
    { title: 'SMEC',  sub: 'Mechanical Engineering', icon: '⚙️' },
    { title: 'VSB',   sub: 'School of Business', icon: '📊' },
    { title: 'V-TAPP', sub: 'Tech Innovation Hub', icon: '🚀' },
  ];

  const COLORS = {
    gold:     0xFFD700,
    neonBlue: 0x00FFFF,
    white:    0xFFFFFF,
    obsidian: 0x0a0a0a,
  };

  // ── SCENE SETUP ──
  const canvas  = document.getElementById('heroCanvas');
  const heroSection = document.getElementById('hero');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
  renderer.setClearColor(COLORS.obsidian, 0);

  const scene  = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.obsidian, 0.035);

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 8);

  // ── LIGHTS ──
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(COLORS.gold, 1.5, 20);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(COLORS.neonBlue, 1.2, 20);
  pointLight2.position.set(-5, -3, 3);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(COLORS.gold, 0.8, 15);
  pointLight3.position.set(0, 3, -5);
  scene.add(pointLight3);

  // ── GLASSMORPHIC CARD SHADER ──
  const cardVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const cardFragmentShader = `
    uniform float uTime;
    uniform vec2  uMouse;
    uniform vec3  uColor;
    uniform float uOpacity;
    varying vec2  vUv;
    varying vec3  vNormal;
    varying vec3  vWorldPos;

    void main() {
      // Base glass tint
      vec3 base = uColor * 0.15;

      // Fresnel edge glow
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      vec3 fresnelColor = mix(uColor, vec3(0.0, 1.0, 1.0), 0.5);

      // Cursor reflection highlight
      vec2 screenPos = vWorldPos.xy * 0.1;
      float dist = length(screenPos - uMouse * 0.5);
      float highlight = smoothstep(0.8, 0.0, dist) * 0.6;
      vec3 reflectionColor = mix(vec3(1.0, 0.84, 0.0), vec3(0.0, 1.0, 1.0), sin(uTime * 0.5) * 0.5 + 0.5);

      // Shimmer
      float shimmer = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 20.0 - uTime * 1.5) * 0.03;

      // Border glow
      float borderX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float borderY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
      float border = 1.0 - borderX * borderY;
      vec3 borderColor = uColor * border * 0.8;

      vec3 finalColor = base + fresnelColor * fresnel * 0.5 + reflectionColor * highlight + shimmer + borderColor;
      float finalAlpha = uOpacity + fresnel * 0.3 + highlight * 0.3 + border * 0.5;

      gl_FragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 0.85));
    }
  `;

  // ── CREATE CARDS ──
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  const cards = [];
  const cardGeometry = new THREE.PlaneGeometry(1.8, 2.4, 16, 16);

  // Layout: arc arrangement
  const totalCards = CARD_DATA.length;
  CARD_DATA.forEach((data, i) => {
    const angle = ((i - (totalCards - 1) / 2) / totalCards) * Math.PI * 0.6;
    const radius = 5;

    const material = new THREE.ShaderMaterial({
      vertexShader: cardVertexShader,
      fragmentShader: cardFragmentShader,
      uniforms: {
        uTime:    { value: 0 },
        uMouse:   { value: new THREE.Vector2(0, 0) },
        uColor:   { value: new THREE.Color(i % 2 === 0 ? COLORS.gold : COLORS.neonBlue) },
        uOpacity: { value: 0.18 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(cardGeometry, material);
    mesh.position.set(
      Math.sin(angle) * radius,
      (Math.random() - 0.5) * 1.5,
      -2 + Math.cos(angle) * 1.5
    );
    mesh.rotation.y = -angle * 0.5;

    // Store original transforms for scroll animation
    mesh.userData = {
      ...data,
      index: i,
      origPos: mesh.position.clone(),
      origRot: mesh.rotation.clone(),
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatAmp: 0.15 + Math.random() * 0.1,
      // Explode targets
      explodePos: new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        -5 + Math.random() * -10
      ),
      explodeRot: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
    };

    cardGroup.add(mesh);
    cards.push(mesh);
  });

  // ── CARD LABEL SPRITES ──
  cards.forEach((card) => {
    const cnv = document.createElement('canvas');
    cnv.width = 512;
    cnv.height = 640;
    const ctx = cnv.getContext('2d');

    // Semi-transparent background
    ctx.fillStyle = 'rgba(10, 10, 10, 0.01)';
    ctx.fillRect(0, 0, 512, 640);

    // Icon
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.userData.icon, 256, 200);

    // Title
    ctx.font = 'bold 52px Inter, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(card.userData.title, 256, 340);

    // Subtitle
    ctx.font = '26px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const words = card.userData.sub.split(' ');
    let line = '';
    let y = 400;
    words.forEach((word) => {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > 400) {
        ctx.fillText(line.trim(), 256, y);
        line = word + ' ';
        y += 34;
      } else {
        line = test;
      }
    });
    ctx.fillText(line.trim(), 256, y);

    // Decorative line
    const grad = ctx.createLinearGradient(120, 0, 392, 0);
    grad.addColorStop(0, 'rgba(255, 215, 0, 0)');
    grad.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
    grad.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 260);
    ctx.lineTo(392, 260);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(cnv);
    texture.needsUpdate = true;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.8, 2.4, 1);
    sprite.position.copy(card.position);
    sprite.position.z += 0.05;
    sprite.renderOrder = 1;

    card.userData.labelSprite = sprite;
    cardGroup.add(sprite);
  });

  // ── PARTICLE FIELD ──
  const particleCount = 250;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors    = new Float32Array(particleCount * 3);

  const goldCol = new THREE.Color(COLORS.gold);
  const cyanCol = new THREE.Color(COLORS.neonBlue);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3]     = (Math.random() - 0.5) * 25;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 3;

    const col = Math.random() > 0.5 ? goldCol : cyanCol;
    particleColors[i * 3]     = col.r;
    particleColors[i * 3 + 1] = col.g;
    particleColors[i * 3 + 2] = col.b;
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeom.setAttribute('color',    new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  // ── NEON GRID FLOOR ──
  const gridSize = 30;
  const gridDivisions = 30;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, COLORS.neonBlue, COLORS.neonBlue);
  gridHelper.position.y = -4;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.08;
  gridHelper.material.depthWrite = false;
  scene.add(gridHelper);

  // Second grid for parallax depth
  const gridHelper2 = new THREE.GridHelper(gridSize, gridDivisions * 2, COLORS.gold, COLORS.gold);
  gridHelper2.position.y = -4.01;
  gridHelper2.material.transparent = true;
  gridHelper2.material.opacity = 0.03;
  gridHelper2.material.depthWrite = false;
  scene.add(gridHelper2);

  // ── MOUSE TRACKING ──
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // ── SCROLL PROGRESS ──
  let scrollProgress = 0;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Card explode on scroll
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    // Kinetic typography
    const kineticWords = document.querySelectorAll('.kinetic-word');
    kineticWords.forEach((word, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const speed = 150 + i * 80;
      gsap.to(word, {
        x: direction * speed,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // Hero content fade out on scroll
    const heroContent = document.querySelector('.hero-content-3d');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 0,
        y: -60,
        scrollTrigger: {
          trigger: heroSection,
          start: '20% top',
          end: '50% top',
          scrub: 1,
        },
      });
    }

    // Canvas opacity fade
    gsap.to(canvas, {
      opacity: 0.3,
      scrollTrigger: {
        trigger: heroSection,
        start: '60% top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // ── ANIMATION LOOP ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Rotate card group with mouse parallax
    cardGroup.rotation.y = mouse.x * 0.3;
    cardGroup.rotation.x = -mouse.y * 0.15;

    // Update each card
    cards.forEach((card) => {
      const ud = card.userData;

      // Float animation
      const floatY = Math.sin(elapsed * ud.floatSpeed + ud.floatPhase) * ud.floatAmp;
      const floatX = Math.cos(elapsed * ud.floatSpeed * 0.7 + ud.floatPhase) * ud.floatAmp * 0.3;

      // Lerp between original and exploded position based on scroll
      const lerpFactor = Math.pow(scrollProgress, 1.5); // ease-in curve

      card.position.x = THREE.MathUtils.lerp(ud.origPos.x, ud.explodePos.x, lerpFactor) + floatX;
      card.position.y = THREE.MathUtils.lerp(ud.origPos.y, ud.explodePos.y, lerpFactor) + floatY;
      card.position.z = THREE.MathUtils.lerp(ud.origPos.z, ud.explodePos.z, lerpFactor);

      card.rotation.x = THREE.MathUtils.lerp(ud.origRot.x, ud.explodeRot.x, lerpFactor);
      card.rotation.y = THREE.MathUtils.lerp(ud.origRot.y, ud.explodeRot.y, lerpFactor);
      card.rotation.z = THREE.MathUtils.lerp(0, ud.explodeRot.z, lerpFactor);

      // Update shader uniforms
      card.material.uniforms.uTime.value = elapsed;
      card.material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Fade opacity on scroll
      card.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.18, 0.05, lerpFactor);

      // Sync label sprite
      if (ud.labelSprite) {
        ud.labelSprite.position.copy(card.position);
        ud.labelSprite.position.z += 0.05;
        ud.labelSprite.material.opacity = THREE.MathUtils.lerp(0.95, 0.0, lerpFactor);
      }
    });

    // Particle drift
    const posArray = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += Math.sin(elapsed * 0.3 + i) * 0.001;
      posArray[i * 3]     += Math.cos(elapsed * 0.2 + i * 0.5) * 0.0005;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = elapsed * 0.01;

    // Grid floor subtle movement
    gridHelper.position.z = Math.sin(elapsed * 0.1) * 0.5;
    gridHelper2.position.z = Math.cos(elapsed * 0.08) * 0.3;

    // Light orbiting
    pointLight1.position.x = Math.sin(elapsed * 0.3) * 6;
    pointLight1.position.z = Math.cos(elapsed * 0.3) * 6;
    pointLight2.position.x = Math.cos(elapsed * 0.25) * 5;
    pointLight2.position.y = Math.sin(elapsed * 0.2) * 3 - 1;

    renderer.render(scene, camera);
  }

  animate();

  // ── RESIZE HANDLER ──
  function onResize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);

  // ── CLEANUP ──
  window.addEventListener('beforeunload', () => {
    renderer.dispose();
    cardGeometry.dispose();
    particleGeom.dispose();
    particleMat.dispose();
    cards.forEach((c) => c.material.dispose());
  });

})();
