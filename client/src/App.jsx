import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LetterStatus from "./pages/LetterStatus";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-parchment">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/letter/:id" element={<LetterStatus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
