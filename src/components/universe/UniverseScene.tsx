import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Memory, MemoryNodeProps, UniverseSceneProps } from '../../types/memory';
import { MemoryNode } from './MemoryNode';
import { HeartStar } from './HeartStar';
import { ParticleField } from './ParticleField';
import { generateSphericalPositions } from '../../hooks/useThree';

interface SceneContentProps {
  memories: Memory[];
  settings: any;
  onMemoryClick: (memory: Memory) => void;
  performanceLevel: any;
}

const SceneContent: React.FC<SceneContentProps> = ({
  memories,
  settings,
  onMemoryClick,
  performanceLevel
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<[number, number, number][]>([]);

  // Generate spherical positions for memories
  useEffect(() => {
    if (memories.length > 0) {
      const newPositions = generateSphericalPositions(
        memories.length,
        10, // radius
        1.5 // min distance between nodes
      );
      setPositions(newPositions);
    }
  }, [memories]);

  // Auto-rotate the universe
  useFrame((state, delta) => {
    if (groupRef.current && settings?.rotation_speed > 0) {
      groupRef.current.rotation.y += (settings.rotation_speed * Math.PI) / 180 * delta;
    }

    // Auto-rotate camera slowly
    if (controlsRef.current) {
      const targetRotation = state.clock.elapsedTime * 0.1;
      const radius = 15;
      camera.position.x = Math.sin(targetRotation) * radius;
      camera.position.z = Math.cos(targetRotation) * radius;
      camera.lookAt(0, 0, 0);
    }
  });

  // Set camera position
  useEffect(() => {
    camera.position.set(15, 5, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#9b6cff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff6b8a" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={performanceLevel.particleCount}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Main universe container */}
      <group ref={groupRef}>
        {memories.map((memory, index) => {
          const position = positions[index] || [0, 0, 0];
          return (
            <MemoryNode
              key={memory.id}
              memory={memory}
              position={position}
              onClick={() => onMemoryClick(memory)}
              isHovered={false}
              onHover={() => {}}
            />
          );
        })}

        {/* Secret Heart Star - only shown if secret memories exist */}
        {memories.some(m => m.is_secret) && (
          <HeartStar
            position={[0, 8, 0]}
            onClick={() => {
              const secretMemory = memories.find(m => m.is_secret);
              if (secretMemory) {
                onMemoryClick(secretMemory);
              }
            }}
          />
        )}
      </group>

      {/* Particle effects if enabled */}
      {settings?.show_particles && performanceLevel.level !== 'low' && (
        <ParticleField
          count={Math.min(performanceLevel.particleCount / 2, 500)}
          size={0.05}
          radius={20}
        />
      )}

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI * 0.8}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
        autoRotateSpeed={settings?.rotation_speed || 3.0}
      />
    </>
  );
};

export const UniverseScene: React.FC<UniverseSceneProps> = ({
  memories,
  settings,
  onMemoryClick,
  loading
}) => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your universe...</p>
        </div>
      </div>
    );
  }

  if (!webGLSupported) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-white text-center max-w-md p-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">💫</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Universe Not Available</h2>
          <p className="text-white/80 mb-6">
            Your device doesn't support the 3D universe experience.
            Let's show you a beautiful gallery view instead!
          </p>
          <button
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            onClick={() => window.location.href = '/memories'}
          >
            View Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
      <Canvas
        camera={{ position: [15, 5, 15], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Suspense fallback={null}>
          <SceneContent
            memories={memories}
            settings={settings}
            onMemoryClick={onMemoryClick}
            performanceLevel={{
              level: 'medium',
              maxNodes: 30,
              particleCount: 1000,
              renderScale: 1.0
            }}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {memories.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-center">
            <div className="animate-pulse">
              <span className="text-6xl mb-4 block">🌌</span>
            </div>
            <p className="text-xl">Creating your universe...</p>
          </div>
        </div>
      )}
    </div>
  );
};