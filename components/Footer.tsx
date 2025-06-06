import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 text-white/80 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">ChineseName.ai</span>
            </div>
            <p className="text-sm">
              Expert Chinese name generation powered by advanced AI and traditional naming principles.
              Creating authentic, meaningful Chinese names since 2023.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#" className="hover:text-purple-400 transition-colors">Name Generation</Link></li>
              <li><Link href="/#pricing" className="hover:text-purple-400 transition-colors">BaZi Analysis</Link></li>
              <li><Link href="/#pricing" className="hover:text-purple-400 transition-colors">Personalized Consultations</Link></li>
              <li><Link href="/#pricing" className="hover:text-purple-400 transition-colors">Enterprise Solutions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="/#faq" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><Link href="/#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: contact@chinesename.ai</li>
              <li>WeChat: ChineseNameAI</li>
              <li>Working Hours: 24/7 AI Service</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/60">
            © {currentYear} ChineseName.ai. All rights reserved.
          </p>
          <p className="text-xs text-white/60 mt-2 md:mt-0">
            Combining ancient Chinese naming traditions with cutting-edge AI technology.
          </p>
        </div>
      </div>
    </footer>
  )
} 