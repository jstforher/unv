import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { PerformanceLevel } from '../types/three';

interface UseThreeReturn {
  performanceLevel: PerformanceLevel;
  webGLSupported: boolean;
  deviceCapabilities: {
    renderer: string;
    maxTextureSize: number;
    maxVertexUniforms: number;
  };
  optimizeForDevice: () => PerformanceLevel;
}

const PERFORMANCE_LEVELS: Record<string, PerformanceLevel> = {
  low: {
    level: 'low',
    maxNodes: 15,
    particleCount: 100,
    renderScale: 0.5
  },
  medium: {
    level: 'medium',
    maxNodes: 30,
    particleCount: 500,
    renderScale: 0.75
  },
  high: {
    level: 'high',
    maxNodes: 50,
    particleCount: 2000,
    renderScale: 1.0
  }
};

export const useThree = (): UseThreeReturn => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>(PERFORMANCE_LEVELS.medium);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    renderer: 'Unknown',
    maxTextureSize: 2048,
    maxVertexUniforms: 256
  });

  const checkWebGLSupport = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }, []);

  const getDeviceCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return deviceCapabilities;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');

      if (!gl) return deviceCapabilities;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

      return {
        renderer,
        maxTextureSize,
        maxVertexUniforms
      };
    } catch (e) {
      return deviceCapabilities;
    }
  }, [deviceCapabilities]);

  const optimizeForDevice = useCallback((): PerformanceLevel => {
    if (typeof window === 'undefined') return PERFORMANCE_LEVELS.medium;

    // Check device characteristics
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = isMobile || navigator.hardwareConcurrency <= 2;
    const memoryLimited = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;

    // Check WebGL capabilities
    const capabilities = getDeviceCapabilities();
    const isLowEndGPU = capabilities.maxTextureSize < 4096;

    // Determine performance level
    if (isLowEnd || memoryLimited || isLowEndGPU) {
      return PERFORMANCE_LEVELS.low;
    } else if (isMobile) {
      return PERFORMANCE_LEVELS.medium;
    } else {
      return PERFORMANCE_LEVELS.high;
    }
  }, [getDeviceCapabilities]);

  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebGLSupported(supported);

    if (supported) {
      const capabilities = getDeviceCapabilities();
      setDeviceCapabilities(capabilities);

      const optimalLevel = optimizeForDevice();
      setPerformanceLevel(optimalLevel);
    }
  }, [checkWebGLSupport, getDeviceCapabilities, optimizeForDevice]);

  return {
    performanceLevel,
    webGLSupported,
    deviceCapabilities,
    optimizeForDevice
  };
};

export const generateSphericalPositions = (
  count: number,
  radius: number = 10,
  minDistance: number = 2
): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const maxAttempts = count * 100;
  let attempts = 0;

  while (positions.length < count && attempts < maxAttempts) {
    // Generate random point on sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const newPosition = new THREE.Vector3(x, y, z);

    // Check minimum distance from other positions
    let validPosition = true;
    for (const [px, py, pz] of positions) {
      const existingPosition = new THREE.Vector3(px, py, pz);
      if (newPosition.distanceTo(existingPosition) < minDistance) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      positions.push([x, y, z]);
    }

    attempts++;
  }

  return positions;
};