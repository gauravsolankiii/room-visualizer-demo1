import { Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        style={{
          padding: "20px 30px",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Loading {progress.toFixed(0)} %
      </div>
    </Html>
  );
}

export default Loader;
