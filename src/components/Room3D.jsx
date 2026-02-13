import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";

// GLB Model Component
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Main 3D Viewer Component
function GLBViewer() {
  // Apni GLB file ka path yahan daalein
  const modelUrl = "/public/models/room.glb";

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        {/* Camera Setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Environment for better lighting */}
        <Environment preset="sunset" />

        {/* Loading Fallback */}
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>

        {/* Controls - Mouse se model ko rotate kar sakte hain */}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}

export default GLBViewer;
