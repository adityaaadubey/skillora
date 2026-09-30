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

    const particles: Particle[] = []
    let mouse = { x: -500, y: -500, isMoving: false }
    let smoothMouse = { x: -500, y: -500 }
    let lastMoveTime = 0

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

      // Spawn 1-2 fairy dust sparkles on movement
      const count = Math.random() > 0.4 ? 2 : 1
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.8 + 0.2
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3, // slight upward float
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.4 + 0.6,
          life: 0,
          maxLife: Math.floor(Math.random() * 25 + 25),
          isStar: Math.random() > 0.6,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        })
      }

      // Limit particle pool to 60 for performance
      if (particles.length > 60) {
        particles.splice(0, particles.length - 60)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleMouseLeave = () => {
      mouse.x = -500
      mouse.y = -500
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    // Helper to draw a tiny 4-pointed fairy tale sparkle star
    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number,
      alpha: number
    ) => {
      ctx.save()
      ctx.beginPath()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      let step = Math.PI / spikes
      ctx.moveTo(0, -outerRadius)
      for (let i = 0; i < spikes; i++) {
        ctx.rotate(step)
        ctx.lineTo(0, -innerRadius)
        ctx.rotate(step)
        ctx.lineTo(0, -outerRadius)
      }
      ctx.closePath()
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.shadowColor = 'rgba(224, 242, 254, 0.8)'
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth cursor lerp for dull ambient light beam
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.15
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.15

      // 1. Draw dull, aesthetic ambient light beam spotlight
      if (smoothMouse.x > 0 && smoothMouse.y > 0) {
        // Outer soft dull halo (faint ethereal ambient light)
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

        // Inner soft white beam center
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
          drawSparkle(ctx, p.x, p.y, 4, p.size * 1.8, p.size * 0.4, p.rotation, currentAlpha)
        } else {
          // Soft circular fairy dust speck with subtle starlight glow
          ctx.save()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.3), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
          ctx.shadowColor = 'rgba(199, 210, 254, 0.6)'
          ctx.shadowBlur = 4
          ctx.fill()
          ctx.restore()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
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
