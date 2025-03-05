import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useThree } from "@react-three/fiber";

const CoverFlow = ({
  currentIndex = 0,
  textures = [],
  spacing = 1,
  onIndexChanged,
}: {
  currentIndex: number;
  textures: THREE.Texture[];
  spacing: number;
  onIndexChanged: (index: number) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const [zOffset, setZOffset] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { size, camera, viewport } = useThree();

  useEffect(() => {
    meshRefs.current.forEach((mesh, index) => {
      const offset = activeIndex - index;
      const sign = Math.sign(offset);
      const x = offset == 0 ? 0 : sign * 10 + offset * spacing;
      const z2 = offset != 0 ? 0 : zOffset;
      const rotY = offset == 0 ? Math.PI : Math.PI + (sign * Math.PI) / 2.1;

      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);

      gsap.to(mesh.position, {
        x: x,
        z: activeIndex == index ? -3 : 0,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.to(mesh.position, {
        z: z2,
        delay: 0.3,
        duration: 0.5,
        ease: "back.inOut",
      });

      gsap.to(mesh.rotation, {
        y: rotY,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, [activeIndex, spacing, zOffset]);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const verticalFOV = cam.fov * (Math.PI / 180);
    const horizontalFOV = 2 * Math.atan(Math.tan(verticalFOV / 2) * cam.aspect);
    const distance = 15 / 2 / Math.tan(horizontalFOV / 2);
    const cameraZ = -30;
    const z = Math.max(-15, cameraZ + distance);
    setZOffset(z);
  }, [size, camera, viewport]);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const materials = useMemo(() => {
    return textures.map((texture) => {
      const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
        emissiveMap: texture,
        emissiveIntensity: 0.5,
        emissive: 0xffffff,
        roughness: 0.5,
        metalness: 0.5,
        depthTest: true,
        depthWrite: true,
      });
      return material;
    });
  }, [textures]);

  useEffect(() => {
    materials.map((material, index) => {
      let intensity = 0.1;
      if (index != activeIndex) material.emissiveIntensity = intensity;
      if (index == hoverIndex) intensity = 0.5;
      else if (index == activeIndex) intensity = 0.75;
      material.emissiveIntensity = intensity;
    });

    meshRefs.current.map((mesh, index) => {
      if (index == activeIndex) return;
      gsap.to(mesh.position, {
        z: index == hoverIndex ? -4 : 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [activeIndex, hoverIndex, materials]);

  const handleClick = (index: number) => {
    onIndexChanged(index);
  };

  return (
    <group position={[0, 5, 0]} ref={groupRef}>
      {materials.map((material, index) => (
        <mesh
          onPointerMove={(e) => {
            e.stopPropagation();
            if (index == activeIndex) return;
            setHoverIndex(index);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            if (index == activeIndex) return;
            setHoverIndex(null);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (index == activeIndex) return;
            handleClick(index);
          }}
          castShadow
          receiveShadow
          ref={(el) => {
            if (el) meshRefs.current[index] = el;
          }}
          key={index}
          rotation-y={Math.PI}
          material={material}
        >
          <planeGeometry args={[10, 10, 32, 32]} />
        </mesh>
      ))}

      <ambientLight intensity={0.5} />

      <pointLight
        visible={true}
        intensity={1000}
        position={[0, 30, zOffset + 5]}
        distance={50}
      />

      <pointLight
        castShadow={true}
        distance={50}
        intensity={600}
        position={[0, 20, -5]}
        shadow-bias={-0.01}
        shadow-camera-bottom={-50}
        shadow-camera-far={50}
        shadow-camera-left={-50}
        shadow-camera-near={0.1}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
    </group>
  );
};

export default CoverFlow;
