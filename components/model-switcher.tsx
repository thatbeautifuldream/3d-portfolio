import React, { useState, useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NextjsModel } from './nextjs-model'
import { ReactModel } from './react-model'
import { TailwindModel } from './tailwind-model'

type ModelType = 'nextjs' | 'react' | 'tailwind'

interface ModelSwitcherProps {
    onModelChange?: (model: ModelType) => void
}

export function ModelSwitcher({ onModelChange }: ModelSwitcherProps) {
    const [currentModel, setCurrentModel] = useState<ModelType>('nextjs')
    const [hovered, setHovered] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const groupRef = useRef<THREE.Group>(null)

    // Animation for rotation and floating
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Continuous slow rotation
            groupRef.current.rotation.y += delta * 0.2

            // Floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
        }
    })

    // Spring animation for hover effects
    const { scale } = useSpring({
        scale: hovered ? 1.1 : 1,
        config: { mass: 1, tension: 280, friction: 60 }
    })

    // Spring animation for model switching with fade transition
    const { opacity } = useSpring({
        opacity: isTransitioning ? 0 : 1,
        config: { mass: 1, tension: 280, friction: 60 },
        onRest: () => {
            if (isTransitioning) {
                setIsTransitioning(false)
            }
        }
    })

    const handleClick = () => {
        if (isTransitioning) return // Prevent multiple clicks during transition

        setIsTransitioning(true)

        // Cycle through models
        const models: ModelType[] = ['nextjs', 'react', 'tailwind']
        const currentIndex = models.indexOf(currentModel)
        const nextIndex = (currentIndex + 1) % models.length
        const nextModel = models[nextIndex]

        // Delay the model change to allow fade out
        setTimeout(() => {
            setCurrentModel(nextModel)
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

        switch (currentModel) {
            case 'nextjs':
                return <NextjsModel {...modelProps} />
            case 'react':
                return <ReactModel {...modelProps} />
            case 'tailwind':
                return <TailwindModel {...modelProps} />
            default:
                return <NextjsModel {...modelProps} />
        }
    }

    return (
        <animated.group
            ref={groupRef}
            dispose={null}
            style={{ opacity }}
        >
            {renderModel()}
        </animated.group>
    )
} 