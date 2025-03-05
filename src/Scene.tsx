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
          blur={[700, 700]} // Blur ground reflections (width, height), 0 skips blur
          mixBlur={0.5} // How much blur mixes with surface roughness (default = 1)
          mixStrength={1.5} // Strength of the reflections
          mixContrast={0.85} // Contrast of the reflections
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          depthScale={1} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={5} // Upper edge for the depthTexture interpolation (default = 0)
          depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
          distortion={1} // Amount of distortion based on the distortionMap texture
          color={0xffffff}
          reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)(default = 0)
        />
      </mesh>

      <EffectComposer>
        <Bloom
          mipmapBlur={true}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.025}
          intensity={0.6}
        />

        <BrightnessContrast
          brightness={0.05} // brightness. min: -1, max: 1
          contrast={0.25} // contrast: min -1, max: 1
        />

        <ToneMapping
          adaptive={true} // toggle adaptive luminance map usage
          resolution={256} // texture resolution of the luminance map
          middleGrey={0.5} // middle grey factor
          maxLuminance={15.0} // maximum luminance
          averageLuminance={1.0} // average luminance
          adaptationRate={10} // luminance adaptation rate
        />
      </EffectComposer>
    </>
  );
};

export default Scene;
