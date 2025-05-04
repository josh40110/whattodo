import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import styled from '@emotion/styled'
import * as THREE from 'three'

const Container = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
`

const SpinButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

interface Wheel3DProps {
  segments?: number
  colors?: string[]
  labels?: string[]
}

function WheelSegment({ color, label, angle }: { color: string; label: string; angle: number }) {
  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0.2, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

function Wheel({ segments = 6, colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'], labels = ['選項1', '選項2', '選項3', '選項4', '選項5', '選項6'] }: Wheel3DProps) {
  const wheelRef = useRef<THREE.Group>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  useFrame((state, delta) => {
    if (wheelRef.current && isSpinning) {
      wheelRef.current.rotation.y += delta * 2
    }
  })

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    const targetRotation = rotation + Math.PI * 4 + Math.random() * Math.PI * 2
    setRotation(targetRotation)
    setTimeout(() => setIsSpinning(false), 5000)
  }

  return (
    <Container>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <group ref={wheelRef}>
          {Array.from({ length: segments }).map((_, i) => {
            const angle = (i * Math.PI * 2) / segments
            return (
              <WheelSegment
                key={i}
                color={colors[i % colors.length]}
                label={labels[i]}
                angle={angle}
              />
            )
          })}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </Canvas>
      <SpinButton onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? '旋轉中...' : '開始旋轉'}
      </SpinButton>
    </Container>
  )
}

export default Wheel 