import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'

import { Model } from './model'

export function ThreeDPortfolio() {
    return (
        <div className="w-full h-screen relative">
            {/* Instructions Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm text-white p-4 rounded-lg select-none">
                <h3 className="font-bold mb-2">Interactive Portfolio</h3>
                <ul className="text-sm space-y-1">
                    <li>• <strong>Mouse:</strong> Drag to rotate</li>
                    <li>• <strong>Scroll:</strong> Zoom in/out</li>
                    <li>• <strong>Click model:</strong> Toggle pulse animation</li>
                    <li>• <strong>Hover model:</strong> Scale & highlight</li>
                </ul>
            </div>

            <div className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm text-white p-4 rounded-lg select-none">
                <h3 className="font-bold mb-2">Interactive Portfolio</h3>
                <ul className="text-sm space-y-1">
                    <li>• <strong>Mouse:</strong> Drag to rotate</li>
                    <li>• <strong>Scroll:</strong> Zoom in/out</li>
                    <li>• <strong>Click model:</strong> Toggle pulse animation</li>
                    <li>• <strong>Hover model:</strong> Scale & highlight</li>
                </ul>
            </div>

            <Canvas
                shadows
                camera={{ position: [0, 0, 120], fov: 50 }}
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
                        minDistance={15}
                        maxDistance={200}
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

                    {/* The 3D Model */}
                    <Model />

                    {/* Environment */}
                    <Environment preset="sunset" background />
                </Suspense>
            </Canvas>
        </div>
    )
}
