"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onScrollToPricing?: () => void;
  onScrollToFaq?: () => void;
  rightActions?: React.ReactNode;
  showMainNav?: boolean;
}

export default function Navbar({ 
  onScrollToPricing, 
  onScrollToFaq, 
  rightActions, 
  showMainNav = true 
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  // 检测滚动以更改导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur-backdrop ${
        scrolled
          ? "nav-scroll"
          : "nav-glass"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Sparkles className="w-8 h-8 text-white group-hover:text-yellow-300 transition-colors" />
            <span className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
              ChineseName.ai
            </span>
          </Link>
          
          {showMainNav && (
            <div className="flex items-center space-x-6">
              {onScrollToPricing && (
                <button
                  onClick={onScrollToPricing}
                  className="text-white/90 hover:text-white font-medium transition-colors nav-link"
                >
                  Pricing
                </button>
              )}
              {onScrollToFaq && (
                <button
                  onClick={onScrollToFaq}
                  className="text-white/90 hover:text-white font-medium transition-colors nav-link"
                >
                  FAQ
                </button>
              )}
              <Link
                href="/history"
                className="text-white/90 hover:text-white font-medium transition-colors nav-link"
              >
                <span>History</span>
              </Link>
            </div>
          )}
          
          {rightActions && (
            <div className="flex items-center space-x-4">
              {rightActions}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 