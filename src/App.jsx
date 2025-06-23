import "./App.css";
import LiveKitWebView from "./screen/WebView";
import { Routes, Route } from "react-router-dom";
import OpenMapView from "./screen/MapsView";
function App() {
  return (
    <Routes>
      <Route path="livekit-call/:id" element={<LiveKitWebView />} />
      <Route path="map-live-view" element={<OpenMapView />} />
    </Routes>
  );
}

export default App;
