import SceneLoader from "@/components/SceneLoader";
import DOMOverlay from "@/components/DOMOverlay";

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <SceneLoader />
      <DOMOverlay />
    </main>
  );
}
