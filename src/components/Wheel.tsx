'use client'

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Image from 'next/image'
import frogImage from '@/assets/b8298902-268a-4991-8bc4-af2762ef04ee (1).png'

const pixelBorder = `
  image-rendering: pixelated;
  border: 4px solid #000;
  box-shadow: 
    4px 4px 0 #000,
    -4px -4px 0 #fff;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const jumpAnimation = keyframes`
  0% {
    transform: translateX(-150px) translateY(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  10% {
    transform: translateX(-75px) translateY(-45px);
  }
  15% {
    transform: translateX(0) translateY(0);
  }
  20% {
    transform: translateX(75px) translateY(-60px);
  }
  25% {
    transform: translateX(150px) translateY(0);
  }
  30% {
    transform: translateX(75px) translateY(-45px);
  }
  35% {
    transform: translateX(0) translateY(0);
  }
  40% {
    transform: translateX(-75px) translateY(-60px);
  }
  45% {
    transform: translateX(-150px) translateY(0);
  }
  50% {
    transform: translateX(-75px) translateY(-45px);
  }
  55% {
    transform: translateX(0) translateY(0);
  }
  60% {
    transform: translateX(75px) translateY(-60px);
  }
  65% {
    transform: translateX(150px) translateY(0);
  }
  70% {
    transform: translateX(225px) translateY(-45px);
  }
  75% {
    transform: translateX(300px) translateY(0);
  }
  80% {
    transform: translateX(375px) translateY(-60px);
  }
  85% {
    transform: translateX(450px) translateY(0);
  }
  90% {
    transform: translateX(375px) translateY(-45px);
  }
  95% {
    transform: translateX(300px) translateY(0);
  }
  100% {
    transform: translateX(300px) translateY(-180px);
  }
`

const confettiAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(1000px) rotate(720deg);
    opacity: 0;
  }
`

const runAnimation = keyframes`
  0% {
    transform: translateX(-300px) translateY(0);
  }
  25% {
    transform: translateX(-150px) translateY(-20px);
  }
  50% {
    transform: translateX(0) translateY(0);
  }
  75% {
    transform: translateX(150px) translateY(-20px);
  }
  100% {
    transform: translateX(300px) translateY(0);
  }
`

const pointerPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const pointerActivePulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
    border-top-color: #FF5722;
  }
  50% {
    transform: scale(1.25);
    opacity: 0.9;
    border-top-color: #FF9800;
  }
  100% {
    transform: scale(1);
    opacity: 1;
    border-top-color: #FF5722;
  }
`

const ConfettiPiece = styled.div<{ color: string; left: number; delay: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  top: -30px;
  left: ${props => props.left}px;
  opacity: 0;
  animation: ${confettiAnimation} 2s steps(8) forwards;
  animation-delay: ${props => props.delay}s;
  z-index: 5;
  will-change: transform, opacity;
  image-rendering: pixelated;
`

interface WheelContainerProps {
  rotation: number
}

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
`

const WheelSVG = styled.svg<{ isSpinning: boolean; finalRotation: number }>`
  width: 300px;
  height: 300px;
  transition: transform 5s cubic-bezier(0.2, 0.8, 0.3, 1);
  transform: ${props => props.isSpinning ? `rotate(${props.finalRotation}deg)` : 'rotate(0deg)'};
  will-change: transform;
  ${pixelBorder}
`

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
`

const SpinButton = styled.button`
  font-family: 'Press Start 2P', monospace;
  padding: 12px 24px;
  font-size: 14px;
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  ${pixelBorder}
  margin-top: 20px;

  &:hover {
    background-color: #45b7af;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

const HistoryContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  max-width: 300px;
  ${pixelBorder}
`

const HistoryTitle = styled.h2`
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 0.5rem;
  font-family: 'Press Start 2P', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const HistoryItem = styled.li`
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  background: #f9f9f9;
  border: 2px solid #000;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-family: 'Press Start 2P', monospace;
  box-shadow: 2px 2px 0 #000;
`

const Title = styled.h1`
  color: #000;
  font-size: 28px;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #fff;
  animation: ${slideIn} 0.5s ease-out;
  font-family: 'Press Start 2P', monospace;
`

const ClearButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background: #fff;
  border: 4px solid #000;
  color: #000;
  border-radius: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.1s ease;
  font-family: 'Press Start 2P', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 4px 4px 0 #000;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
`

const FrogImage = styled(Image)`
  position: absolute;
  left: -150px;
  bottom: -75px;
  width: 120px;
  height: 120px;
  z-index: 4;
  animation: ${jumpAnimation} 4s steps(8) forwards;
  animation-delay: 0.5s;
  object-fit: contain;
  transform-origin: center bottom;
  image-rendering: pixelated;
`

const RunningFrog = styled(Image)`
  position: absolute;
  left: -300px;
  bottom: -150px;
  width: 100px;
  height: 100px;
  z-index: 4;
  object-fit: contain;
  transform-origin: center bottom;
  image-rendering: pixelated;
`

const PointerContainer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 30px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Pointer = styled.div<{ isActive: boolean }>`
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid ${props => props.isActive ? '#ff6b6b' : '#ff4757'};
  filter: drop-shadow(2px 2px 0 #000);
  animation: ${props => props.isActive ? pointerActivePulse : pointerPulse} ${props => props.isActive ? '0.7s' : '1.5s'} steps(1) infinite;
`

const PointerDot = styled.div<{ isActive: boolean }>`
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 0;
  margin-top: 5px;
  box-shadow: 2px 2px 0 #000;
  animation: ${props => props.isActive ? pointerActivePulse : pointerPulse} ${props => props.isActive ? '0.7s' : '1.5s'} steps(1) infinite reverse;
  opacity: ${props => props.isActive ? 1 : 0.8};
`

const PointerLabel = styled.div<{ isActive: boolean }>`
  font-size: 10px;
  font-weight: bold;
  color: #000;
  margin-top: 5px;
  text-align: center;
  text-shadow: 1px 1px 0 #fff;
  letter-spacing: 0.5px;
  transform: translateY(-5px);
  opacity: ${props => props.isActive ? 1 : 0.8};
  font-family: 'Press Start 2P', monospace;
`

const ResultMark = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 4px solid #000;
  border-radius: 0;
  padding: 5px 15px;
  box-shadow: 4px 4px 0 #000;
  font-weight: bold;
  color: #000;
  z-index: 15;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  font-family: 'Press Start 2P', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export interface WheelProps {
  segments?: number
  colors?: string[]
  labels?: string[]
  hideControls?: boolean
  onSpinComplete?: (selectedLabel: string) => void
}

const Wheel = forwardRef<any, WheelProps>(({ 
  segments = 4, 
  colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b6b'], 
  labels = ['選項 1', '選項 2', '選項 3', '選項 4'],
  hideControls = false,
  onSpinComplete
}, ref) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [frogPosition, setFrogPosition] = useState({ x: -150, y: 0 })
  const [frogKey, setFrogKey] = useState(0)
  const [confettiKey, setConfettiKey] = useState(0)
  const [showRunningFrog, setShowRunningFrog] = useState(false)
  const [runningFrogKey, setRunningFrogKey] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFrogKey(prev => prev + 1)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isSpinning) return
    
    const randomMoveInterval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 600) - 300
      const randomY = Math.floor(Math.random() * 300) - 150
      setFrogPosition({ x: randomX, y: randomY })
    }, 2000)

    return () => clearInterval(randomMoveInterval)
  }, [isSpinning])

  const spinWheel = () => {
    if (isSpinning) return
    
    setShowConfetti(false)
    setIsSpinning(true)
    
    // 計算最終旋轉角度（至少4圈 + 隨機角度）
    const minRotations = 4
    const randomRotations = Math.floor(Math.random() * 2) + minRotations
    const randomAngle = Math.floor(Math.random() * 360)
    const newRotation = (randomRotations * 360) + randomAngle
    
    setRotation(newRotation)
    
    // 動畫結束後的回調
    setTimeout(() => {
      const normalizedRotation = newRotation % 360
      const selectedIndex = Math.floor(((360 - normalizedRotation) / (360 / segments)) % segments)
      const validIndex = selectedIndex % segments
      const result = labels[validIndex]
      
      setSelectedLabel(result)
      setShowConfetti(true)
      setIsSpinning(false)
      setShowResult(true)
      
      setTimeout(() => {
        setShowResult(false)
      }, 6000)
      
      if (onSpinComplete) onSpinComplete(result)
    }, 5000) // 與 CSS transition 時間相同
  }

  const radius = 250
  const centerX = 300
  const centerY = 300

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const getLabelPosition = (index: number) => {
    const angle = (index * 360 / segments + 360 / segments / 2 - 90) * Math.PI / 180
    const labelRadius = radius * 0.75
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle)
    }
  }

  const renderConfetti = () => {
    if (!showConfetti) return null
    
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b6b', '#4ecdc4', '#ffe66d']
    const confettiPieces = []
    
    for (let i = 0; i < 100; i++) {
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      const left = Math.random() * 600
      const delay = Math.random() * 2
      const size = Math.random() * 10 + 3
      
      confettiPieces.push(
        <ConfettiPiece 
          key={`${confettiKey}-${i}`} 
          color={color} 
          left={left} 
          delay={delay} 
          size={size} 
        />
      )
    }
    
    return confettiPieces
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useImperativeHandle(ref, () => ({
    spinWheel: () => {
      spinWheel();
    },
    getSelectedLabel: () => {
      const currentRotation = rotation % 360
      const selectedIndex = Math.floor(((360 - currentRotation) / (360 / segments)) % segments)
      const validIndex = selectedIndex % segments
      return labels[validIndex]
    }
  }))

  useEffect(() => {
    console.log('Wheel component mounted with props:', { segments, colors, labels, hideControls })
    console.log('Initial state:', { isSpinning, selectedLabel })
  }, [])

  return (
    <WheelContainer>
      {!hideControls && (
        <>
          <Title>今天要做什麼？</Title>
          {showRunningFrog && !hideControls && (
            <RunningFrog 
              key={runningFrogKey} 
              src={frogImage} 
              alt="奔跑的青蛙" 
              style={{ 
                animation: `${runAnimation} 5s steps(8) infinite`
              }}
            />
          )}
        </>
      )}
      <ControlsContainer>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          {renderConfetti()}
          {!isSpinning && !hideControls && (
            <FrogImage 
              key={frogKey} 
              src={frogImage} 
              alt="可愛的青蛙(應該可愛)" 
              style={{ 
                transform: `translateX(${frogPosition.x}px) translateY(${frogPosition.y}px)`,
                transition: 'transform 0.5s steps(5)'
              }}
            />
          )}
          <PointerContainer>
            <Pointer isActive={isSpinning} />
            <PointerDot isActive={isSpinning} />
            <PointerLabel isActive={isSpinning}></PointerLabel>
          </PointerContainer>
          <ResultMark style={{ 
            opacity: showResult ? 1 : 0,
            transform: showResult ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)'
          }}>
            {selectedLabel}
          </ResultMark>
          <WheelSVG isSpinning={isSpinning} finalRotation={rotation}>
            <svg width="100%" height="100%" viewBox="0 0 600 600">
              <defs>
                <filter id="pixelate" x="0" y="0">
                  <feFlood x="4" y="4" height="2" width="2"/>
                  <feComposite width="8" height="8"/>
                  <feTile result="a"/>
                  <feComposite in="SourceGraphic" in2="a" operator="in"/>
                  <feMorphology operator="dilate" radius="2"/>
                </filter>
              </defs>
              {Array.from({ length: segments }).map((_, i) => {
                const startAngle = i * (360 / segments)
                const endAngle = (i + 1) * (360 / segments)
                const labelPos = getLabelPosition(i)
                const isSelected = !isSpinning && selectedLabel === labels[i]
                
                return (
                  <g key={i}>
                    <path
                      d={createArc(startAngle, endAngle)}
                      fill={colors[i % colors.length]}
                      filter={isSelected ? "url(#pixelate)" : "none"}
                      transform={isSelected ? `scale(1.02) translate(-${centerX * 0.02}px, -${centerY * 0.02}px)` : "none"}
                      style={{ 
                        transition: 'transform 0.3s steps(3), filter 0.3s steps(3)',
                      }}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={isSelected ? "18" : "16"}
                      fontWeight="bold"
                      transform={`rotate(${startAngle + 360/segments/2}, ${labelPos.x}, ${labelPos.y})`}
                      style={{ 
                        textShadow: isSelected ? '2px 2px 0 #000' : '1px 1px 0 #000',
                        transition: 'font-size 0.3s steps(3), text-shadow 0.3s steps(3)',
                        fontFamily: "'Press Start 2P', monospace"
                      }}
                    >
                      {labels[i]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </WheelSVG>
        </div>
      </ControlsContainer>
    </WheelContainer>
  )
})

export default Wheel 