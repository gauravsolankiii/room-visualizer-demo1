import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

// GLB Model Component
function Model({ url, onObjectClick }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // material clone so each mesh independent
        child.material = child.material.clone();
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        if (e.object.isMesh) onObjectClick(e.object);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    />
  );
}

// Sidebar Component
function TextureSidebar({ selectedObject, isOpen, onClose, onTextureSelect }) {
  const [textures, setTextures] = useState([]);
  const fileInputRef = useRef(null);

  // Sample textures - aap apne textures yahan add kar sakte hain
  const sampleTextures = [
    { id: 1, name: "Wood Texture", url: "/textures/wood.jpg" },
    { id: 2, name: "Marble Texture", url: "/textures/marble.jpg" },
    { id: 3, name: "Fabric Texture", url: "/textures/fabric.jpg" },
    { id: 4, name: "Metal Texture", url: "/textures/metal.jpg" },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      const newTexture = {
        id: Date.now(),
        name: file.name,
        url: url,
      };
      setTextures([...textures, newTexture]);
      onTextureSelect(url);
    }
  };

  const handleTextureClick = (textureUrl) => {
    onTextureSelect(textureUrl);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        background: "#2a2a2a",
        boxShadow: "-2px 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        padding: "20px",
        overflowY: "auto",
        color: "white",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>Select Texture</h3>
        <button
          onClick={onClose}
          style={{
            background: "#ff4444",
            border: "none",
            color: "white",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      {selectedObject && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            background: "#3a3a3a",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>
            <strong>Selected:</strong> {selectedObject.name || "Unnamed Object"}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4a90e2",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          + Upload Texture
        </button>
      </div>

      {/* Sample Textures */}
      <h4 style={{ marginBottom: "10px" }}>Sample Textures</h4>
      <div style={{ display: "grid", gap: "10px" }}>
        {sampleTextures.map((texture) => (
          <div
            key={texture.id}
            onClick={() => handleTextureClick(texture.url)}
            style={{
              padding: "10px",
              background: "#3a3a3a",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4a4a4a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3a3a3a")}
          >
            <img
              src={texture.url}
              alt={texture.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <p style={{ margin: 0, fontSize: "12px" }}>{texture.name}</p>
          </div>
        ))}
      </div>

      {/* Uploaded Textures */}
      {textures.length > 0 && (
        <>
          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Uploaded Textures
          </h4>
          <div style={{ display: "grid", gap: "10px" }}>
            {textures.map((texture) => (
              <div
                key={texture.id}
                onClick={() => handleTextureClick(texture.url)}
                style={{
                  padding: "10px",
                  background: "#3a3a3a",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4a4a4a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#3a3a3a")
                }
              >
                <img
                  src={texture.url}
                  alt={texture.name}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                />
                <p style={{ margin: 0, fontSize: "12px" }}>{texture.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Main 3D Viewer Component
function GLBViewer() {
  const modelUrl = "/models/room.glb";
  const [selectedObject, setSelectedObject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    setIsSidebarOpen(true);
  };

  const textureLoader = new THREE.TextureLoader();

  const handleTextureSelect = (url) => {
    if (!selectedObject) return;

    textureLoader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 16;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);

      // old texture dispose
      if (selectedObject.material.map) {
        selectedObject.material.map.dispose();
      }

      selectedObject.material.map = texture;
      selectedObject.material.needsUpdate = true;
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a1a1a",
          overflow: "hidden",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [80, 40, 80], fov: 55 }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[50, 80, 50]} intensity={1} castShadow />

          <directionalLight position={[-100, 100, -100]} intensity={0.5} />
          <pointLight position={[0, 150, 0]} intensity={0.6} />

          <Environment preset="city" />

          <Suspense fallback={null}>
            <Center>
              <Model url={modelUrl} onObjectClick={handleObjectClick} />
            </Center>
          </Suspense>
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={40}
            maxDistance={250}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      <TextureSidebar
        selectedObject={selectedObject}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onTextureSelect={handleTextureSelect}
      />
    </div>
  );
}

export default GLBViewer;
