import React, { useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import CoverFlow from "./components/CoverFlow";
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { isMobile, isTablet } from "react-device-detect";

const Scene = ({
  texturePaths,
  currentIndex,
  onIndexChanged,
}: {
  texturePaths: string[];
  currentIndex: number;
  onIndexChanged: (index: number) => void;
}) => {
  const textures = useLoader(TextureLoader, texturePaths);

  const { camera, gl, raycaster } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, -30);
    camera.lookAt(new THREE.Vector3(0, 5, 100));

    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    raycaster.camera = camera;
  }, [camera, gl, raycaster]);

  const handlerIndexChanged = (index: number): void => {
    onIndexChanged(index);
  };

  return (
    <>
      <color attach="background" args={[0x333333]} />

      <CoverFlow
        onIndexChanged={handlerIndexChanged}
        currentIndex={currentIndex}
        textures={textures}
        spacing={1}
      />

      <mesh receiveShadow={false} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <MeshReflectorMaterial
          visible={true}
          mixStrength={1.5}
          mixContrast={0.85}
          resolution={1024}
          mirror={1}
          depthScale={4}
          minDepthThreshold={0}
          maxDepthThreshold={5}
          depthToBlurRatioBias={0.25}
          distortion={1}
          color={0xffffff}
          reflectorOffset={0}
        />
      </mesh>

      {!isMobile || isTablet ? (
        <EffectComposer>
          <BrightnessContrast brightness={0.05} contrast={0.25} />
          <ToneMapping
            adaptive={true}
            resolution={256}
            middleGrey={0.5}
            maxLuminance={15.0}
            averageLuminance={1.0}
            adaptationRate={10}
          />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom
            mipmapBlur={true}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.025}
            intensity={0.6}
          />
          <BrightnessContrast brightness={0.05} contrast={0.25} />
          <ToneMapping
            adaptive={true}
            resolution={256}
            middleGrey={0.5}
            maxLuminance={15.0}
            averageLuminance={1.0}
            adaptationRate={10}
          />
        </EffectComposer>
      )}
    </>
  );
};

export default Scene;
