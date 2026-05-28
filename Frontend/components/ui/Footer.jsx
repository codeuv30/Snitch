const links = ["Privacy", "Terms of Service", "Shipping", "Contact"];

export default function Footer() {
  return (
    <div className="pt-6 mt-auto border-t border-[#e8e6e0]">

      {/* ── DESKTOP ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between">
        <span
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SNITCH
        </span>
        <div className="flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[10px] text-[#888880] hover:text-[#1a1a1a] tracking-wide transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <span className="text-[10px] text-[#888880]">
          © {new Date().getFullYear()} SNITCH LUXURY. ALL RIGHTS RESERVED.
        </span>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col items-center gap-4">
        <span
          className="text-[12px] font-medium tracking-[0.2em] uppercase text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SNITCH
        </span>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[11px] text-[#888880] hover:text-[#1a1a1a] tracking-wide transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <span className="text-[10px] text-[#888880] text-center">
          © {new Date().getFullYear()} SNITCH LUXURY. ALL RIGHTS RESERVED.
        </span>
      </div>

    </div>
  );
}