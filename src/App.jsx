import "./App.css";
import LiveKitWebView from "./screen/WebView";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./screen/LoadingScreen";
function App() {
  return (
    <Routes>
      <Route index element={<LoadingScreen />} />
      <Route path="livekit-call/:id" element={<LiveKitWebView />} />
    </Routes>
  );
}

export default App;
