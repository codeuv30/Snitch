const links = ["Privacy", "Terms of Service", "Shipping", "Contact"];

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] w-full bg-[#0a0a0a]">

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Logo */}
          <span
            className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#f0ede8] text-center lg:text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            SNITCH
          </span>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-[#555] hover:text-[#f0ede8] tracking-wide transition-colors font-medium"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <span className="text-[11px] text-[#444] text-center lg:text-right font-bold">
            © {new Date().getFullYear()} SNITCH LUXURY. ALL RIGHTS RESERVED.
          </span>

        </div>
      </div>
    </footer>
  );
}