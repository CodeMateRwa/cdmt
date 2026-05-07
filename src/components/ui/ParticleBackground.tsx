import { useEffect, useRef } from 'react'

type Orb = {
  x: number; y: number
  vx: number; vy: number
  radius: number
  opacity: number
  opacityDir: number
  color: string
}

const COLORS = [
  'rgba(46,158,79,',
  'rgba(76,205,110,',
  'rgba(26,92,42,',
]

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const orbs: Orb[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.min(Math.floor(window.innerWidth / 80), 18)
    for (let i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 80 + 20,
        opacity: Math.random() * 0.12 + 0.03,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach(orb => {
        orb.opacity += orb.opacityDir * 0.0005
        if (orb.opacity > 0.15 || orb.opacity < 0.02) {
          orb.opacityDir *= -1
        }

        orb.x += orb.vx
        orb.y += orb.vy

        if (orb.x < -orb.radius)  orb.x = canvas.width  + orb.radius
        if (orb.x > canvas.width  + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius)  orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius,
        )
        grad.addColorStop(0,   `${orb.color}${orb.opacity})`)
        grad.addColorStop(0.5, `${orb.color}${orb.opacity * 0.4})`)
        grad.addColorStop(1,   `${orb.color}0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  )
}
