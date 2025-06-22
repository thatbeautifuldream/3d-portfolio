import React, { useState, useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NextjsModel } from './nextjs-model'
import { ReactModel } from './react-model'
import { TailwindModel } from './tailwind-model'
import { ResumeIframe } from './resume-iframe'

type ModelType = 'nextjs' | 'react' | 'tailwind' | 'resume'

interface ModelSwitcherProps {
    onModelChange?: (model: ModelType) => void
    currentModel?: ModelType
}

export function ModelSwitcher({ onModelChange, currentModel = 'nextjs' }: ModelSwitcherProps) {
    const [localModel, setLocalModel] = useState<ModelType>(currentModel)
    const [hovered, setHovered] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const groupRef = useRef<THREE.Group>(null)

    // Update local model when currentModel prop changes
    useEffect(() => {
        setLocalModel(currentModel)
    }, [currentModel])

    // Animation for rotation and floating (but not for resume)
    useFrame((state, delta) => {
        if (groupRef.current && localModel !== 'resume') {
            // Continuous slow rotation
            groupRef.current.rotation.y += delta * 0.2

            // Floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
        } else if (groupRef.current && localModel === 'resume') {
            // Keep resume completely stationary and centered
            groupRef.current.position.set(0, 0, 0)
            groupRef.current.rotation.set(0, 0, 0)
        }
    })

    // Spring animation for hover effects
    const { scale } = useSpring({
        scale: hovered ? 1.1 : 1,
        config: { mass: 1, tension: 280, friction: 60 }
    })

    // Handle transition completion
    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isTransitioning])

    const handleClick = () => {
        if (isTransitioning) return // Prevent multiple clicks during transition
        if (localModel === 'resume') return // Don't cycle when showing resume

        setIsTransitioning(true)

        // Cycle through models (excluding resume for auto-cycling)
        const models: ModelType[] = ['nextjs', 'react', 'tailwind']
        const currentIndex = models.indexOf(localModel)
        const nextIndex = (currentIndex + 1) % models.length
        const nextModel = models[nextIndex]

        // Delay the model change to allow fade out
        setTimeout(() => {
            setLocalModel(nextModel)
            onModelChange?.(nextModel)
            console.log('Model switched to:', nextModel)
        }, 150) // Half of the transition duration
    }

    const handlePointerOver = () => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
    }

    const handlePointerOut = () => {
        setHovered(false)
        document.body.style.cursor = 'auto'
    }

    const renderModel = () => {
        const modelProps = {
            scale: scale,
            onClick: handleClick,
            onPointerOver: handlePointerOver,
            onPointerOut: handlePointerOut,
        }

        switch (localModel) {
            case 'nextjs':
                return <NextjsModel {...modelProps} />
            case 'react':
                return <ReactModel {...modelProps} />
            case 'tailwind':
                return <TailwindModel {...modelProps} />
            case 'resume':
                return <ResumeIframe {...modelProps} />
            default:
                return <NextjsModel {...modelProps} />
        }
    }

    return (
        <group ref={groupRef} dispose={null}>
            {renderModel()}
        </group>
    )
} 