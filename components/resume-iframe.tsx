import React, { useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface ResumeIframeProps {
    scale?: any
    onClick?: () => void
    onPointerOver?: () => void
    onPointerOut?: () => void
}

export function ResumeIframe({ scale, onClick, onPointerOver, onPointerOut }: ResumeIframeProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    const handlePointerOver = (e: any) => {
        e.stopPropagation()
        setHovered(true)
        onPointerOver?.()
    }

    const handlePointerOut = (e: any) => {
        e.stopPropagation()
        setHovered(false)
        onPointerOut?.()
    }

    return (
        <animated.group scale={scale} position={[0, 0, 0]}>
            <mesh
                ref={meshRef}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                onClick={onClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {/* Main display plane */}
                <planeGeometry args={[16, 12]} />
                <meshStandardMaterial
                    color={hovered ? "#333" : "#222"}
                    transparent
                    opacity={0.05}
                />

                {/* HTML iframe overlay - perfectly centered */}
                <Html
                    center
                    distanceFactor={15}
                    position={[0, 0, 0.01]}
                    style={{
                        pointerEvents: 'auto'
                    }}
                >
                    <div style={{
                        width: '800px',
                        height: '600px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        border: '2px solid #ddd'
                    }}>
                        <iframe
                            src="https://resume.milind.app"
                            width="800"
                            height="600"
                            style={{
                                border: 'none',
                                borderRadius: '6px'
                            }}
                            title="Resume"
                            loading="lazy"
                        />
                    </div>
                </Html>
            </mesh>
        </animated.group>
    )
} 