// ─── Upcoming Stub ────────────────────────────────────────────────
// Drop this in a shared file (e.g. src/components/Upcoming.jsx) when you
// want to reuse it — for now it lives here to keep routes self-contained.
import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";

const Upcoming = ({ title = "Coming Soon", description = "This section is currently under construction. Check back soon!" }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F5EFE6] font-['DM_Sans'] flex items-center justify-center p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div className="text-center max-w-[420px]">
        <div className="w-20 h-20 rounded-2xl bg-white border border-[#e8e6e0] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Clock className="w-9 h-9 text-[#c4956a]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c4956a] font-medium mb-3">Upcoming Feature</p>
        <h1 className="font-['Playfair_Display'] text-[32px] text-[#1a1a1a] mb-4 leading-tight">{title}</h1>
        <p className="text-[14px] text-[#888880] leading-relaxed mb-8">{description}</p>
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-[11px] uppercase
                     tracking-[0.15em] px-6 py-3 rounded-xl hover:bg-[#333] transition-all duration-200 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Upcoming;