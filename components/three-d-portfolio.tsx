import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'

import { ModelSwitcher } from './model-switcher'

type ModelType = 'nextjs' | 'react' | 'tailwind' | 'resume'

export function ThreeDPortfolio() {
    const [currentModel, setCurrentModel] = useState<ModelType>('nextjs')

    const handleModelChange = (model: ModelType) => {
        setCurrentModel(model)
    }

    const handleResumeClick = () => {
        setCurrentModel('resume')
    }

    const handleBackToModels = () => {
        setCurrentModel('nextjs')
    }

    const getModelName = (model: ModelType) => {
        switch (model) {
            case 'nextjs':
                return 'Next.js'
            case 'react':
                return 'React'
            case 'tailwind':
                return 'Tailwind CSS'
            case 'resume':
                return 'Resume'
            default:
                return 'Next.js'
        }
    }

    const models: ModelType[] = ['nextjs', 'react', 'tailwind']

    return (
        <div className="w-full h-screen relative">
            {/* Instructions Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm text-white p-4 rounded-lg select-none">
                <h3 className="font-bold mb-2">Interactive Portfolio</h3>
                <ul className="text-sm space-y-1">
                    <li>• <strong>Mouse:</strong> Drag to rotate</li>
                    <li>• <strong>Scroll:</strong> Zoom in/out</li>
                    {currentModel !== 'resume' ? (
                        <>
                            <li>• <strong>Click model:</strong> Switch between Next.js, React, Tailwind</li>
                            <li>• <strong>Hover model:</strong> Scale & highlight</li>
                        </>
                    ) : (
                        <li>• <strong>Resume:</strong> Interactive 3D iframe</li>
                    )}
                </ul>
            </div>

            {/* Resume Button - Top Right */}
            <div className="absolute top-4 right-4 z-10">
                {currentModel === 'resume' ? (
                    <button
                        onClick={handleBackToModels}
                        className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-black/30 transition-colors duration-200 select-none"
                    >
                        <span className="text-sm font-semibold">← Back to Models</span>
                    </button>
                ) : (
                    <button
                        onClick={handleResumeClick}
                        className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-black/30 transition-colors duration-200 select-none"
                    >
                        <span className="text-sm font-semibold">📄 View Resume</span>
                    </button>
                )}
            </div>

            {/* Current Model Display - Bottom Right */}
            <div className="absolute bottom-4 right-4 z-10 bg-black/20 backdrop-blur-sm text-white p-4 rounded-lg select-none">
                <h3 className="font-bold mb-2">Current Model</h3>
                <p className={`text-sm font-semibold`}>
                    {getModelName(currentModel)}
                </p>
                {currentModel !== 'resume' ? (
                    <>
                        <p className="text-xs text-white mt-1">Click the model to switch</p>

                        {/* Model Cycle Indicator */}
                        <div className="mt-3">
                            <p className="text-xs text-white mb-2">Model Cycle:</p>
                            <div className="flex space-x-2">
                                {models.map((model, index) => (
                                    <div
                                        key={model}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${model === currentModel
                                            ? 'bg-white'
                                            : 'bg-gray-500'
                                            }`}
                                        title={getModelName(model)}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-xs text-white mt-1">Interactive resume iframe</p>
                )}
            </div>

            <Canvas
                shadows
                camera={{
                    position: currentModel === 'resume' ? [0, 0, 25] : [0, 0, 30],
                    fov: currentModel === 'resume' ? 60 : 50
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
            >
                <Suspense fallback={null}>
                    {/* Camera Controls */}
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={currentModel === 'resume' ? 10 : 15}
                        maxDistance={currentModel === 'resume' ? 100 : 200}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI}
                    />

                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    {/* The 3D Model Switcher */}
                    <ModelSwitcher onModelChange={handleModelChange} currentModel={currentModel} />

                    {/* Environment */}
                    <Environment preset="sunset" background />
                </Suspense>
            </Canvas>
        </div>
    )
}
