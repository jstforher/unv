import * as THREE from 'three';

export interface ThreeSceneProps {
  width: number;
  height: number;
}

export interface CameraControlsRef {
  reset: () => void;
  focusOn: (position: [number, number, number]) => void;
  enableAutoRotate: (enabled: boolean) => void;
  setRotationSpeed: (speed: number) => void;
}

export interface ParticleFieldProps {
  count: number;
  size: number;
  radius: number;
}

export interface NodeAnimation {
  position?: THREE.Vector3;
  scale?: THREE.Vector3;
  rotation?: THREE.Euler;
  opacity?: number;
}

export interface PerformanceLevel {
  level: 'low' | 'medium' | 'high';
  maxNodes: number;
  particleCount: number;
  renderScale: number;
}

export interface MemoryInteraction {
  memoryId: string;
  position: THREE.Vector3;
  timestamp: number;
  type: 'click' | 'hover' | 'focus';
}