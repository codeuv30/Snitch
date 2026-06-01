import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";

const Upcoming = ({ title = "Coming Soon", description = "This section is currently under construction. Check back soon!" }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans'] flex items-center justify-center p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div className="text-center max-w-[420px]">
        <div className="w-20 h-20 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Clock className="w-9 h-9 text-[#c4956a]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c4956a] font-bold mb-3">Upcoming Feature</p>
        <h1 className="font-['Playfair_Display'] text-[32px] text-[#f0ede8] mb-4 leading-tight font-semibold">{title}</h1>
        <p className="text-[14px] text-[#888] leading-relaxed mb-8 font-medium">{description}</p>
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="inline-flex items-center gap-2 bg-[#c4956a] text-[#0a0a0a] text-[11px] uppercase
                     tracking-[0.15em] px-6 py-3 rounded-xl hover:bg-[#d4a57a] transition-all duration-200 font-bold shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Upcoming;