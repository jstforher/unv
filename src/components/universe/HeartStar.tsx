import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HeartStarProps {
  position: [number, number, number];
  onClick: () => void;
}

export const HeartStar: React.FC<HeartStarProps> = ({ position, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animation loop for the heart star
  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle floating and rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;

    // Pulsing effect
    const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    groupRef.current.scale.setScalar(pulseScale);

    // Gentle vertical movement
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
  });

  // Create heart shape using multiple spheres
  const HeartShape = () => {
    return (
      <group>
        {/* Main heart body made of spheres */}
        <Sphere position={[-0.3, 0.1, 0]} args={[0.3, 16, 16]}>
          <meshStandardMaterial
            color="#ff6b8a"
            emissive="#ff6b8a"
            emissiveIntensity={hovered ? 0.8 : 0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <Sphere position={[0.3, 0.1, 0]} args={[0.3, 16, 16]}>
          <meshStandardMaterial
            color="#ff6b8a"
            emissive="#ff6b8a"
            emissiveIntensity={hovered ? 0.8 : 0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <Sphere position={[0, -0.2, 0]} args={[0.4, 16, 16]}>
          <meshStandardMaterial
            color="#ff6b8a"
            emissive="#ff6b8a"
            emissiveIntensity={hovered ? 0.8 : 0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Glow effect */}
        {hovered && (
          <Sphere position={[0, 0, 0]} args={[0.8, 16, 16]}>
            <meshBasicMaterial
              color="#ff6b8a"
              transparent
              opacity={0.1}
            />
          </Sphere>
        )}

        {/* Sparkle particles around the heart */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 1 + Math.sin(Date.now() * 0.001 + i) * 0.3;
          return (
            <Sphere
              key={i}
              position={[
                Math.cos(angle) * distance,
                Math.sin(i * 0.5) * 0.5,
                Math.sin(angle) * distance
              ]}
              args={[0.05, 8, 8]}
            >
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1}
              />
            </Sphere>
          );
        })}
      </group>
    );
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <HeartShape />

      {/* Invisible click area */}
      <Sphere args={[2, 8, 8]}>
        <meshBasicMaterial visible={false} />
      </Sphere>

      {/* Secret hint text (shown when hovered) */}
      {hovered && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.4}
          color="#ff6b8a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#0b1020"
        >
          ✨ Discover Something Special ✨
        </Text>
      )}
    </group>
  );
};