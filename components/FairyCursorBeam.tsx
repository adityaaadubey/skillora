'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  maxLife: number
  life: number
  isStar: boolean
  rotation: number
  rotSpeed: number
  colorType: number // 0: primary (jet black / pure white), 1: enchanted indigo/twilight, 2: slate/shimmer
}

export function FairyCursorBeam() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // Only run on desktop/devices with fine pointer (mouse)
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let isLight = document.documentElement.getAttribute('data-theme') === 'light'
    const themeObserver = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light'
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const particles: Particle[] = []
    let mouse = { x: -500, y: -500, isMoving: false }
    let smoothMouse = { x: -500, y: -500 }
    let lastMoveTime = 0
    let isRunning = false

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.isMoving = true
      lastMoveTime = performance.now()

      // Spawn 2-3 fairy dust sparkles on movement for a rich magical trail
      const count = Math.random() > 0.4 ? 2 : 1
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.8 + 0.2
        const colorRand = Math.random()
        const colorType = colorRand > 0.75 ? 1 : colorRand > 0.45 ? 2 : 0

        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3, // slight upward fairy float
          size: Math.random() * 2.0 + 1.0,
          alpha: Math.random() * 0.35 + 0.65,
          life: 0,
          maxLife: Math.floor(Math.random() * 24 + 22),
          isStar: Math.random() > 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          colorType,
        })
      }

      // Limit particle pool to 50 for maximum performance
      if (particles.length > 50) {
        particles.splice(0, particles.length - 50)
      }

      // Wake up render loop if sleeping
      if (!isRunning) {
        isRunning = true
        animationFrameId = requestAnimationFrame(render)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleMouseLeave = () => {
      mouse.x = -500
      mouse.y = -500
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    // Helper to draw a crisp 4-pointed fairy tale sparkle star
    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number,
      alpha: number,
      colorType: number
    ) => {
      ctx.save()
      ctx.beginPath()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      const step = Math.PI / spikes
      ctx.moveTo(0, -outerRadius)
      for (let i = 0; i < spikes; i++) {
        ctx.rotate(step)
        ctx.lineTo(0, -innerRadius)
        ctx.rotate(step)
        ctx.lineTo(0, -outerRadius)
      }
      ctx.closePath()

      if (isLight) {
        // Magical Black Fairy Tale Sparkles (for light theme)
        if (colorType === 1) {
          // Midnight violet-black
          ctx.fillStyle = `rgba(30, 27, 75, ${alpha})`
          ctx.shadowColor = `rgba(79, 70, 229, ${alpha * 0.6})`
        } else if (colorType === 2) {
          // Deep obsidian slate
          ctx.fillStyle = `rgba(30, 41, 59, ${alpha})`
          ctx.shadowColor = `rgba(15, 23, 42, ${alpha * 0.5})`
        } else {
          // Jet black fairy star
          ctx.fillStyle = `rgba(10, 15, 28, ${alpha})`
          ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.65})`
        }
        ctx.shadowBlur = 5
      } else {
        // Luminous Ethereal Sparkles (for dark theme)
        if (colorType === 1) {
          ctx.fillStyle = `rgba(224, 231, 255, ${alpha})`
          ctx.shadowColor = 'rgba(129, 140, 248, 0.9)'
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.shadowColor = 'rgba(224, 242, 254, 0.85)'
        }
        ctx.shadowBlur = 6
      }

      ctx.fill()
      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth cursor lerp for ambient light / dark beam
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.15
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.15

      // 1. Draw ambient light beam / dark fairy spotlight
      if (smoothMouse.x > 0 && smoothMouse.y > 0) {
        if (isLight) {
          // Light Mode: Ethereal Black / Dusk fairy beam spotlight
          const outerGlow = ctx.createRadialGradient(
            smoothMouse.x,
            smoothMouse.y,
            0,
            smoothMouse.x,
            smoothMouse.y,
            150
          )
          outerGlow.addColorStop(0, 'rgba(15, 23, 42, 0.055)')
          outerGlow.addColorStop(0.35, 'rgba(99, 102, 241, 0.035)')
          outerGlow.addColorStop(0.7, 'rgba(30, 41, 59, 0.012)')
          outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.fillStyle = outerGlow
          ctx.beginPath()
          ctx.arc(smoothMouse.x, smoothMouse.y, 150, 0, Math.PI * 2)
          ctx.fill()

          const innerGlow = ctx.createRadialGradient(
            smoothMouse.x,
            smoothMouse.y,
            0,
            smoothMouse.x,
            smoothMouse.y,
            26
          )
          innerGlow.addColorStop(0, 'rgba(15, 23, 42, 0.11)')
          innerGlow.addColorStop(0.6, 'rgba(30, 27, 75, 0.04)')
          innerGlow.addColorStop(1, 'rgba(15, 23, 42, 0)')

          ctx.fillStyle = innerGlow
          ctx.beginPath()
          ctx.arc(smoothMouse.x, smoothMouse.y, 26, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Dark Mode: Luminous celestial beam spotlight
          const outerGlow = ctx.createRadialGradient(
            smoothMouse.x,
            smoothMouse.y,
            0,
            smoothMouse.x,
            smoothMouse.y,
            160
          )
          outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.055)')
          outerGlow.addColorStop(0.3, 'rgba(129, 140, 248, 0.035)')
          outerGlow.addColorStop(0.7, 'rgba(6, 182, 212, 0.015)')
          outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.fillStyle = outerGlow
          ctx.beginPath()
          ctx.arc(smoothMouse.x, smoothMouse.y, 160, 0, Math.PI * 2)
          ctx.fill()

          const innerGlow = ctx.createRadialGradient(
            smoothMouse.x,
            smoothMouse.y,
            0,
            smoothMouse.x,
            smoothMouse.y,
            28
          )
          innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.16)')
          innerGlow.addColorStop(0.6, 'rgba(224, 242, 254, 0.06)')
          innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.fillStyle = innerGlow
          ctx.beginPath()
          ctx.arc(smoothMouse.x, smoothMouse.y, 28, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 2. Draw & update fairy tale sparkles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        p.vx *= 0.98
        p.vy *= 0.98

        const progress = p.life / p.maxLife
        const currentAlpha = p.alpha * (1 - progress)

        if (currentAlpha <= 0.01 || p.life >= p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        if (p.isStar) {
          drawSparkle(
            ctx,
            p.x,
            p.y,
            4,
            p.size * 2.0,
            p.size * 0.42,
            p.rotation,
            currentAlpha,
            p.colorType
          )
        } else {
          // Soft circular fairy dust speck with starlight aura
          ctx.save()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.3), 0, Math.PI * 2)

          if (isLight) {
            // Black fairy dust on white screen
            if (p.colorType === 1) {
              ctx.fillStyle = `rgba(49, 46, 129, ${currentAlpha})`
              ctx.shadowColor = 'rgba(79, 70, 229, 0.5)'
            } else if (p.colorType === 2) {
              ctx.fillStyle = `rgba(51, 65, 85, ${currentAlpha})`
              ctx.shadowColor = 'rgba(15, 23, 42, 0.4)'
            } else {
              ctx.fillStyle = `rgba(15, 23, 42, ${currentAlpha})`
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            }
            ctx.shadowBlur = 4
          } else {
            // White fairy dust on dark screen
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
            ctx.shadowColor = 'rgba(199, 210, 254, 0.6)'
            ctx.shadowBlur = 4
          }

          ctx.fill()
          ctx.restore()
        }
      }

      // If mouse is idle and all sparkles have dissolved, sleep to save 100% CPU/GPU
      const isIdle = performance.now() - lastMoveTime > 1000
      if (particles.length === 0 && isIdle) {
        ctx.clearRect(0, 0, width, height)
        isRunning = false
        return
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        width: '100vw',
        height: '100vh',
      }}
      aria-hidden="true"
    />
  )
}

