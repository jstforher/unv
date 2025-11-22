import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { MemoryNodeProps } from '../../types/memory';

interface AnimatedMeshProps {
  position: [number, number, number];
  isHovered: boolean;
  isFeatured: boolean;
  isSecret: boolean;
  onClick: () => void;
  thumbnailUrl?: string;
}

const AnimatedMesh: React.FC<AnimatedMeshProps> = ({
  position,
  isHovered,
  isFeatured,
  isSecret,
  onClick,
  thumbnailUrl
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);
  const [pulse, setPulse] = useState(0);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    // Hover effect
    const targetScale = isHovered ? 1.2 : 1;
    setScale((prev) => THREE.MathUtils.lerp(prev, targetScale, 0.1));

    // Pulse effect for featured/secret memories
    if (isFeatured || isSecret) {
      setPulse(state.clock.elapsedTime);
      const pulseScale = isFeatured ?
        1 + Math.sin(pulse * 2) * 0.1 :
        1 + Math.sin(pulse * 1.5) * 0.15;
      meshRef.current.scale.setScalar(scale * pulseScale);
    } else {
      meshRef.current.scale.setScalar(scale);
    }

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
  });

  // Determine node appearance based on memory type
  const getNodeGeometry = () => {
    if (isSecret) {
      // Secret memory - small, hidden sphere
      return (
        <Sphere args={[0.3, 16, 16]} ref={meshRef}>
          <meshStandardMaterial
            color="#ff6b8a"
            emissive="#ff6b8a"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </Sphere>
      );
    } else if (isFeatured) {
      // Featured memory - glowing box
      return (
        <Box args={[0.8, 0.8, 0.8]} ref={meshRef}>
          <meshStandardMaterial
            color="#9b6cff"
            emissive="#9b6cff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Box>
      );
    } else {
      // Regular memory - standard sphere
      return (
        <Sphere args={[0.5, 16, 16]} ref={meshRef}>
          <meshStandardMaterial
            color="#f6f7ff"
            emissive="#f6f7ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.9}
          />
        </Sphere>
      );
    }
  };

  return (
    <group position={position}>
      {getNodeGeometry()}

      {/* Hover glow effect */}
      {isHovered && (
        <Sphere args={[0.8, 16, 16]}>
          <meshBasicMaterial
            color="#9b6cff"
            transparent
            opacity={0.1}
          />
        </Sphere>
      )}

      {/* Click handler */}
      <mesh position={position} onClick={onClick}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
};

export const MemoryNode: React.FC<MemoryNodeProps> = ({
  memory,
  position,
  onClick,
  isHovered,
  onHover
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [showLabel, setShowLabel] = useState(false);

  // Handle mouse events
  const handleClick = () => {
    onClick(memory);
  };

  const handlePointerOver = () => {
    onHover(true);
    setShowLabel(true);
  };

  const handlePointerOut = () => {
    onHover(false);
    setShowLabel(false);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Main memory node */}
      <AnimatedMesh
        position={[0, 0, 0]}
        isHovered={isHovered}
        isFeatured={memory.is_featured}
        isSecret={memory.is_secret}
        onClick={handleClick}
      />

      {/* Category indicator */}
      <group position={[0, 0.6, 0]}>
        {memory.category === 'milestone' && (
          <Sphere args={[0.1, 8, 8]}>
            <meshStandardMaterial color="#ff6b8a" />
          </Sphere>
        )}
        {memory.category === 'trip' && (
          <Box args={[0.15, 0.1, 0.1]}>
            <meshStandardMaterial color="#9b6cff" />
          </Box>
        )}
        {memory.category === 'party' && (
          <Box args={[0.1, 0.15, 0.1]}>
            <meshStandardMaterial color="#ff6b8a" />
          </Box>
        )}
      </group>

      {/* Memory label (shown on hover) */}
      {showLabel && !memory.is_secret && (
        <Text
          position={[0, -1, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#0b1020"
        >
          {memory.title}
        </Text>
      )}

      {/* Secret memory hint */}
      {memory.is_secret && (
        <Text
          position={[0, -1, 0]}
          fontSize={0.2}
          color="#ff6b8a"
          anchorX="center"
          anchorY="middle"
          opacity={0.7}
        >
          ???
        </Text>
      )}
    </group>
  );
};