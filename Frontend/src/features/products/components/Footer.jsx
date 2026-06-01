import { Link } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-12 pt-8 pb-8 border-t border-[#1d1d1d]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-['Playfair_Display'] text-[14px] tracking-[0.15em] text-[#f1f1f1]">
              SNITCH
            </span>
            <div className="flex gap-8 text-[11px] text-[#888880] uppercase tracking-[0.1em]">
              <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">
                Privacy
              </span>
              <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">
                Terms
              </span>
              <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">
                Support
              </span>
            </div>
            <span className="text-[11px] text-[#b5b2a8]">
              © 2026 SNITCH INDIA. All rights reserved. | <Link to={"/report-issue"}>Report an issue</Link>
            </span>
          </div>
        </footer>
  )
}

export default Footer;