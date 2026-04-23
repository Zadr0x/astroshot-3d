import SceneLoader from "@/components/SceneLoader";
import DOMOverlay from "@/components/DOMOverlay";

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      {/* 3D Canvas — fixed behind everything, client-only */}
      <SceneLoader />

      {/* DOM text overlays — above canvas */}
      <DOMOverlay />
    </main>
  );
}
