import React, { Suspense, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Slider from "@mui/material/slider";

import Scene from "./Scene";

const App = () => {
  const texturePaths: string[] = [];
  for (let i = 1; i <= 40; i++)
    texturePaths.push("textures/pic (" + i + ").jpg");

  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(texturePaths.length / 2)
  );

  const handlerIndexChanged = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="App relative w-full h-full bg-black">
      <Suspense fallback={<span>Loading... Please wait!</span>}>
        <Canvas shadows className="w-full h-full">
          <Scene
            texturePaths={texturePaths}
            onIndexChanged={handlerIndexChanged}
            currentIndex={currentIndex}
          />
        </Canvas>
        <div className="opacity-70 drop-shadow-xl py-2 px-5 bg-slate-900 rounded-3xl absolute bottom-15 left-1/2 transform -translate-x-1/2 w-2/3 max-w-sm flex">
          <Slider
            onChange={(_event, value) => {
              setCurrentIndex(value as number);
            }}
            value={currentIndex}
            defaultValue={0}
            min={0}
            max={texturePaths.length - 1}
            aria-label="Disabled slider"
          />
        </div>
      </Suspense>
    </div>
  );
};

export default App;
