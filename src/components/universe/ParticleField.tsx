import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleFieldProps } from '../../types/three';

interface ParticleSystemProps extends ParticleFieldProps {}

export const ParticleField: React.FC<ParticleSystemProps> = ({
  count,
  size,
  radius
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;

      const i3 = i * 3;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Random colors with romantic theme
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple
        colors[i3] = 0.61;     // R
        colors[i3 + 1] = 0.42;  // G
        colors[i3 + 2] = 1.0;   // B
      } else if (colorChoice < 0.66) {
        // Pink
        colors[i3] = 1.0;       // R
        colors[i3 + 1] = 0.42;  // G
        colors[i3 + 2] = 0.54;  // B
      } else {
        // White
        colors[i3] = 0.96;      // R
        colors[i3 + 1] = 0.97;  // G
        colors[i3 + 2] = 1.0;   // B
      }
    }

    return { positions, colors };
  }, [count, radius]);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    // Gentle rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;

    // Animate particle sizes for twinkling effect
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.size = size + Math.sin(state.clock.elapsedTime * 2) * size * 0.3;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
};