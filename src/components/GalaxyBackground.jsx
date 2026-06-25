import React, { useEffect, useRef } from "react";
import * as THREE from "three";
 
const GalaxyBackground = () => {
  const mountRef = useRef();
 
  useEffect(() => {
    const scene = new THREE.Scene();
 
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
 
    camera.position.z = 7;
 
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 
    mountRef.current.appendChild(renderer.domElement);
 
    const particleCount = 100000;
    const branches = 6;
    const radius = 8;
    const spin = 2;
 
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
 
    const insideColor = new THREE.Color("#ff7b00");
    const outsideColor = new THREE.Color("#8b5cf6");
 
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
 
      const r = Math.random() * radius;
 
      const spinAngle = r * spin;
 
      const branchAngle =
        ((i % branches) / branches) * Math.PI * 2;
 
      const randomX =
        Math.pow(Math.random(), 3) *
        (Math.random() > 0.5 ? 1 : -1) *
        0.4 *
        r;
 
      const randomY =
        Math.pow(Math.random(), 3) *
        (Math.random() > 0.5 ? 1 : -1) *
        0.15;
 
      const randomZ =
        Math.pow(Math.random(), 3) *
        (Math.random() > 0.5 ? 1 : -1) *
        0.4 *
        r;
 
      positions[i3] =
        Math.cos(branchAngle + spinAngle) * r +
        randomX;
 
      positions[i3 + 1] = randomY;
 
      positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * r +
        randomZ;
 
      const mixedColor = insideColor.clone();
 
      mixedColor.lerp(outsideColor, r / radius);
 
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
 
    const geometry = new THREE.BufferGeometry();
 
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
 
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
 
    const material = new THREE.PointsMaterial({
      size: 0.03,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
    });
 
    const galaxy = new THREE.Points(
      geometry,
      material
    );
 
    scene.add(galaxy);
 
    let mouseX = 0;
    let mouseY = 0;
 
    const handleMouse = (e) => {
      mouseX =
        (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY =
        (e.clientY / window.innerHeight - 0.5) * 2;
    };
 
    window.addEventListener(
      "mousemove",
      handleMouse
    );
 
    const clock = new THREE.Clock();
 
    const animate = () => {
      requestAnimationFrame(animate);
 
      const elapsed = clock.getElapsedTime();
 
      galaxy.rotation.y = elapsed * 0.08;
 
      galaxy.rotation.x +=
        (mouseY * 0.2 - galaxy.rotation.x) *
        0.03;
 
      galaxy.rotation.z +=
        (mouseX * 0.2 - galaxy.rotation.z) *
        0.03;
 
      renderer.render(scene, camera);
    };
 
    animate();
 
    const resize = () => {
      camera.aspect =
        window.innerWidth / window.innerHeight;
 
      camera.updateProjectionMatrix();
 
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };
 
    window.addEventListener("resize", resize);
 
    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouse
      );
 
      window.removeEventListener(
        "resize",
        resize
      );
 
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
 
  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-50 bg-black"
    />
  );
};
 
export default GalaxyBackground;