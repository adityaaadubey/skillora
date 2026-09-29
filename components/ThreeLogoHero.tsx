'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ThreeLogoHeroProps {
  className?: string
}

export function ThreeLogoHero({ className = '' }: ThreeLogoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Detect theme
    const getTheme = (): 'dark' | 'light' => {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    }
    const currentTheme = getTheme()
    setActiveTheme(currentTheme)

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
        return
      }
    } catch {
      setWebglSupported(false)
      return
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 420

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 9.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // 2. Sculptural Fluid Geometry (Inspired by the organic luxury pendant forms)
    // We create a dual-sculpture cluster: primary morphing torus knot + fluid secondary shell
    const primaryGeometry = new THREE.TorusKnotGeometry(2.1, 0.62, 160, 48, 2, 3)
    
    // Store original positions for procedural sine-wave organic breathing
    const positionAttr = primaryGeometry.attributes.position
    const originalPositions = new Float32Array(positionAttr.array)

    // Materials adapted for Dark and Light themes
    const isLight = currentTheme === 'light'
    
    const primaryMaterial = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0xfbf7f4 : 0x1e1e38,
      emissive: isLight ? 0xe0d4fc : 0x4f46e5,
      emissiveIntensity: isLight ? 0.35 : 0.6,
      roughness: 0.28,
      metalness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      transmission: 0.1,
      reflectivity: 0.9,
    })

    const primaryMesh = new THREE.Mesh(primaryGeometry, primaryMaterial)
    scene.add(primaryMesh)

    // Orbital Halo Ring representing Skillora's global network
    const haloGeo = new THREE.TorusGeometry(3.5, 0.035, 32, 100)
    const haloMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0x818cf8 : 0x38bdf8,
      transparent: true,
      opacity: isLight ? 0.55 : 0.65,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    haloMesh.rotation.x = Math.PI / 3.2
    haloMesh.rotation.y = Math.PI / 6
    scene.add(haloMesh)

    const haloGeo2 = new THREE.TorusGeometry(3.8, 0.02, 32, 100)
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: isLight ? 0xa855f7 : 0x818cf8,
      transparent: true,
      opacity: isLight ? 0.4 : 0.45,
    })
    const haloMesh2 = new THREE.Mesh(haloGeo2, haloMat2)
    haloMesh2.rotation.x = -Math.PI / 4
    haloMesh2.rotation.z = Math.PI / 5
    scene.add(haloMesh2)

    // Floating Stardust Particles
    const particleCount = 120
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleScales = new Float32Array(particleCount)

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14
      particlePositions[i + 1] = (Math.random() - 0.5) * 9
      particlePositions[i + 2] = (Math.random() - 0.5) * 7
      particleScales[i / 3] = Math.random() * 0.06 + 0.02
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: isLight ? 0x6366f1 : 0xa5b4fc,
      size: isLight ? 0.08 : 0.09,
      transparent: true,
      opacity: isLight ? 0.6 : 0.75,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // 3. Lighting Setup (Soft luminous warm depth matching reference image)
    const ambientLight = new THREE.AmbientLight(
      isLight ? 0xfff5ea : 0x2e1065,
      isLight ? 1.8 : 1.2
    )
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(isLight ? 0xffffff : 0x818cf8, isLight ? 2.2 : 2.5)
    mainLight.position.set(5, 7, 6)
    scene.add(mainLight)

    const internalWarmGlow = new THREE.PointLight(
      isLight ? 0xfbcfe8 : 0x06b6d4,
      isLight ? 2.5 : 3.0,
      12
    )
    internalWarmGlow.position.set(0, 0, 0)
    scene.add(internalWarmGlow)

    const rimLight = new THREE.DirectionalLight(isLight ? 0x818cf8 : 0x38bdf8, 1.8)
    rimLight.position.set(-6, -4, -4)
    scene.add(rimLight)

    // 4. Mouse Interactivity & Smooth Lerping
    let targetRotationX = 0
    let targetRotationY = 0
    let currentRotationX = 0
    let currentRotationY = 0
    let mouseX = 0
    let mouseY = 0
    let pulseWave = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseX = x
      mouseY = y
      targetRotationY = x * 0.7
      targetRotationX = -y * 0.5
    }

    const handleClick = () => {
      pulseWave = 1.0
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('click', handleClick)

    // 5. Theme change observer
    const observer = new MutationObserver(() => {
      const newTheme = getTheme()
      setActiveTheme(newTheme)
      const light = newTheme === 'light'

      primaryMaterial.color.setHex(light ? 0xfbf7f4 : 0x1e1e38)
      primaryMaterial.emissive.setHex(light ? 0xe0d4fc : 0x4f46e5)
      primaryMaterial.emissiveIntensity = light ? 0.35 : 0.6

      haloMat.color.setHex(light ? 0x818cf8 : 0x38bdf8)
      haloMat2.color.setHex(light ? 0xa855f7 : 0x818cf8)
      particleMaterial.color.setHex(light ? 0x6366f1 : 0xa5b4fc)

      ambientLight.color.setHex(light ? 0xfff5ea : 0x2e1065)
      ambientLight.intensity = light ? 1.8 : 1.2
      mainLight.color.setHex(light ? 0xffffff : 0x818cf8)
      internalWarmGlow.color.setHex(light ? 0xfbcfe8 : 0x06b6d4)
      rimLight.color.setHex(light ? 0x818cf8 : 0x38bdf8)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // 6. Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse lerp
      currentRotationX += (targetRotationX - currentRotationX) * 0.05
      currentRotationY += (targetRotationY - currentRotationY) * 0.05

      // Base idle rotation + interactive rotation
      primaryMesh.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.4) * 0.15
      primaryMesh.rotation.y = currentRotationY + elapsedTime * 0.28
      primaryMesh.rotation.z = Math.cos(elapsedTime * 0.3) * 0.1

      // Rings gentle counter-rotations
      haloMesh.rotation.z = elapsedTime * 0.15
      haloMesh2.rotation.z = -elapsedTime * 0.12

      // Organic wavy deformation on vertices (breathing effect)
      pulseWave *= 0.94 // decay click pulse
      const posArray = positionAttr.array as Float32Array
      const waveFreq = 2.5
      const waveAmp = 0.05 + pulseWave * 0.12

      for (let i = 0; i < posArray.length; i += 3) {
        const ox = originalPositions[i]
        const oy = originalPositions[i + 1]
        const oz = originalPositions[i + 2]
        const distortion = Math.sin(ox * waveFreq + elapsedTime * 2) *
                           Math.cos(oy * waveFreq + elapsedTime * 2) * waveAmp
        posArray[i] = ox + distortion * (ox / 2)
        posArray[i + 1] = oy + distortion * (oy / 2)
        posArray[i + 2] = oz + distortion * (oz / 2)
      }
      positionAttr.needsUpdate = true

      // Floating particles slow orbital drift
      particles.rotation.y = elapsedTime * 0.04

      renderer.render(scene, camera)
    }

    animate()

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('click', handleClick)
      observer.disconnect()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      primaryGeometry.dispose()
      primaryMaterial.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      haloGeo2.dispose()
      haloMat2.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`three-hero-canvas-container ${className}`}
      style={{
        width: '100%',
        height: '420px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      {/* Visual background atmospheric halo */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            activeTheme === 'light'
              ? 'radial-gradient(circle, rgba(224, 212, 252, 0.45) 0%, rgba(254, 243, 199, 0.25) 45%, rgba(255, 255, 255, 0) 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(56, 189, 248, 0.15) 40%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Fallback if WebGL is disabled */}
      {!webglSupported && (
        <div
          style={{
            zIndex: 1,
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '48px',
              fontWeight: 800,
              margin: '0 auto 1rem',
              boxShadow: '0 0 35px rgba(99, 102, 241, 0.5)',
            }}
          >
            S
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Skillora Opportunity Mesh</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Autonomous Intelligence Core</p>
        </div>
      )}

      {/* Interactive Hint Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(15, 23, 42, 0.35)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
        }}
      >
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
        <span>Interactive 3D Emblem • Move cursor or click to pulse</span>
      </div>
    </div>
  )
}
