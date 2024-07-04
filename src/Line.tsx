import React from 'react'
import { Canvas, Path, Skia, Circle } from '@shopify/react-native-skia'
export const Line = () => {
  const start = { x: 100, y: 100 }
  const end = { x: 300, y: 300 }
  const path = Skia.Path.Make()
  const numPoints = 50
  const deltaX = (end.x - start.x) / numPoints
  const deltaY = (end.y - start.y) / numPoints
  const amplitude = 30
  const frequency = 0.15
  const points = []

  path.moveTo(start.x, start.y)
  for (let i = 1; i <= numPoints; i++) {
    const x = start.x + i * deltaX
    const y = start.y + i * deltaY + amplitude * Math.sin(frequency * i)
    path.lineTo(x, y)
    points.push({ x, y })
  }

  // Calculate the total length of the path
  let totalLength = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    totalLength += Math.sqrt(dx * dx + dy * dy)
  }

  // Calculate the interval distance
  const numCircles = 40 // Adjust the number of circles as needed
  const intervalDistance = totalLength / numCircles

  // Place circles at uniform intervals
  const uniformPoints = [points[0]]
  let accumulatedDistance = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    accumulatedDistance += segmentLength
    if (accumulatedDistance >= intervalDistance) {
      uniformPoints.push(points[i])
      accumulatedDistance = 0
    }
  }

  return (
    <Canvas style={{ flex: 1 }}>
      {uniformPoints.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={10} color={'blue'} />
      ))}
      <Path path={path} color={'black'} style="stroke" strokeWidth={2} />
    </Canvas>
  )
}
