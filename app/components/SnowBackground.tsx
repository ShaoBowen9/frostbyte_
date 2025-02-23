"use client"

import { useEffect, useRef } from "react"

const SnowBackground = () => {
  const snowCanvasRef = useRef(null)
  const auroraCanvasRef = useRef(null)

  useEffect(() => {
    const snowCanvas = snowCanvasRef.current
    const snowCtx = snowCanvas.getContext("2d")
    const auroraCanvas = auroraCanvasRef.current
    const auroraCtx = auroraCanvas.getContext("2d")
    let snowAnimationId
    let auroraAnimationId

    const resizeCanvas = () => {
      snowCanvas.width = window.innerWidth
      snowCanvas.height = window.innerHeight
      auroraCanvas.width = window.innerWidth
      auroraCanvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Snow setup
    const snowflakes = Array.from({ length: 100 }, () => ({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }))

    // Aurora setup
    let time = 0
    const auroraColors = [
      "rgba(97, 255, 168, 0.5)", // Green
      "rgba(45, 149, 237, 0.5)", // Blue
      "rgba(185, 103, 255, 0.5)", // Purple
    ]

    const drawSnowflakes = () => {
      snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height)

      snowflakes.forEach((flake) => {
        snowCtx.beginPath()
        snowCtx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        snowCtx.fill()

        flake.y += flake.speed
        if (flake.y > snowCanvas.height) {
          flake.y = -10
          flake.x = Math.random() * snowCanvas.width
        }
      })

      snowAnimationId = requestAnimationFrame(drawSnowflakes)
    }

    const drawAurora = () => {
      auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height)

      // Night sky gradient
      const nightSkyGradient = auroraCtx.createLinearGradient(0, 0, 0, auroraCanvas.height)
      nightSkyGradient.addColorStop(0, "#0c1445") // Dark blue at top
      nightSkyGradient.addColorStop(1, "#1a1b3d") // Lighter blue at bottom

      auroraCtx.fillStyle = nightSkyGradient
      auroraCtx.fillRect(0, 0, auroraCanvas.width, auroraCanvas.height)

      // Aurora waves
      auroraColors.forEach((color, index) => {
        auroraCtx.beginPath()
        auroraCtx.moveTo(0, 0)

        for (let x = 0; x < auroraCanvas.width; x++) {
          const y = Math.sin(x * 0.02 + time + index) * 50 + Math.sin(x * 0.01 - time + index) * 30 + index * 50 + 100

          auroraCtx.lineTo(x, y)
        }

        auroraCtx.lineTo(auroraCanvas.width, 0)
        auroraCtx.closePath()

        const gradient = auroraCtx.createLinearGradient(0, 0, 0, auroraCanvas.height / 2)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        auroraCtx.fillStyle = gradient
        auroraCtx.fill()
      })

      time += 0.005
      auroraAnimationId = requestAnimationFrame(drawAurora)
    }

    drawSnowflakes()
    drawAurora()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(snowAnimationId)
      cancelAnimationFrame(auroraAnimationId)
    }
  }, [])

  return (
    <>
      <canvas ref={auroraCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
      <canvas ref={snowCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />
    </>
  )
}

export default SnowBackground

