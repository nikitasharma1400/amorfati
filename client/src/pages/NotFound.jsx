import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-32">
      <p className="text-fade mb-6">This page has drifted out of time.</p>
      <Link to="/" className="underline text-muted hover:text-parchment transition">
        Return home
      </Link>
    </div>
  );
}
