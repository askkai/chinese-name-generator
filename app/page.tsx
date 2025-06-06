"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, History, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GeneratingPopup from "@/components/GeneratingPopup"
import Footer from "@/components/Footer"

const exampleNames = [
  { chinese: "李明", pinyin: "Lǐ Míng", meaning: "Bright & Clear" },
  { chinese: "王雅", pinyin: "Wáng Yǎ", meaning: "Elegant & Graceful" },
  { chinese: "张伟", pinyin: "Zhāng Wěi", meaning: "Great & Mighty" },
  { chinese: "陈美", pinyin: "Chén Měi", meaning: "Beautiful" },
  { chinese: "刘强", pinyin: "Liú Qiáng", meaning: "Strong & Powerful" },
]

const faqs = [
  {
    question: "What is BaZi (八字) in Chinese naming?",
    answer:
      "BaZi, or Eight Characters, is a traditional Chinese astrology system that analyzes your birth time to determine personality traits and life path. Our AI integrates these principles to create names that are harmonious with your destiny.",
  },
  {
    question: "How accurate are the generated names?",
    answer:
      "Our AI considers Chinese naming traditions, BaZi principles, cultural meanings, and pronunciation to create authentic names that align with traditional practices.",
  },
  {
    question: "Can I use these names officially?",
    answer: "Yes! These names follow proper Chinese naming conventions and can be used for official documents.",
  },
  {
    question: "What's the difference between phonetic and meaning-based names?",
    answer:
      "Phonetic names sound similar to your original name, while meaning-based names focus on positive symbolism aligned with BaZi principles.",
  },
  {
    question: "How does BaZi fortune-telling influence my Chinese name?",
    answer:
      "BaZi analysis examines the balance of the five elements (Wood, Fire, Earth, Metal, Water) in your birth chart. Our premium service creates names that complement your elemental balance, potentially enhancing your fortune and life path.",
  },
]

// Pricing plans
const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Basic Chinese name generation",
    features: [
      "AI-generated Chinese names",
      "Pronunciation guide",
      "Basic meaning analysis",
      "Phonetic or meaning-based options",
      "3 name suggestions per request",
    ],
    cta: "Current Plan",
    isCurrent: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "monthly",
    description: "Advanced name generation with BaZi analysis",
    features: [
      "Everything in Free plan",
      "BaZi (八字) fortune compatibility",
      "Five elements balance analysis",
      "Personalized stroke count optimization",
      "10 name suggestions per request",
      "Detailed character meaning analysis",
    ],
    cta: "Upgrade",
    isCurrent: false,
    highlight: true,
  },
  {
    name: "Professional",
    price: "$29.99",
    period: "monthly",
    description: "Complete naming solution with expert consultation",
    features: [
      "Everything in Premium plan",
      "1-on-1 consultation with naming expert",
      "Complete BaZi chart analysis",
      "Business name recommendations",
      "Unlimited name suggestions",
      "Official name certificate",
      "Custom calligraphy options",
    ],
    cta: "Get Started",
    isCurrent: false,
  },
]

export default function HomePage() {
  const router = useRouter();
  const [currentName, setCurrentName] = useState("")
  const [gender, setGender] = useState("male")
  const [method, setMethod] = useState("phonetic")
  const [surname, setSurname] = useState("common")
  const [customSurname, setCustomSurname] = useState("")
  const [currentExample, setCurrentExample] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGeneratingPopup, setShowGeneratingPopup] = useState(false)
  
  // Refs for scroll to sections
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Rotate example names every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % exampleNames.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // 提交表单并生成名字
  const handleGenerateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowGeneratingPopup(true);
    
    try {
      // 将表单数据发送到API
      const response = await fetch('/api/generate-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentName,
          gender,
          method,
          surname,
          customSurname: surname === 'custom' ? customSurname : '',
        }),
      });
      
      if (!response.ok) {
        throw new Error('名字生成失败');
      }
      
      const data = await response.json();
      
      // 将生成的名字保存到sessionStorage
      sessionStorage.setItem('generatedNames', JSON.stringify(data.names));
      sessionStorage.setItem('userPreferences', JSON.stringify({
        currentName,
        gender,
        method,
        surname,
        customSurname: surname === 'custom' ? customSurname : '',
      }));
      
      // 跳转到结果页面
      router.push('/results');
    } catch (error) {
      console.error('名字生成错误:', error);
      alert('生成名字时出错，请重试');
      setShowGeneratingPopup(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ChineseName.ai</span>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection(pricingRef)}
                className="text-white hover:text-purple-400 transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection(faqRef)}
                className="text-white hover:text-purple-400 transition-colors font-medium"
              >
                FAQ
              </button>
              <Link href="/history">
                <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Get Your Perfect
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent block">
            BaZi-Aligned Chinese Name
          </span>
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Generate authentic Chinese names based on traditional BaZi (八字) principles. Our AI combines ancient wisdom with modern technology to create names that harmonize with your destiny.
        </p>

        {/* Example Names Carousel */}
        <div className="mb-16">
          <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="text-center transition-all duration-500 ease-in-out">
                <div className="text-3xl font-bold text-white mb-2">{exampleNames[currentExample].chinese}</div>
                <div className="text-lg text-white/80 mb-1">{exampleNames[currentExample].pinyin}</div>
                <div className="text-sm text-white/60">{exampleNames[currentExample].meaning}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Name Generation Form */}
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <form onSubmit={handleGenerateName} className="space-y-6">
              {/* Current Name Input */}
              <div>
                <Label className="text-white text-sm font-medium mb-2 block">Your current name (optional)</Label>
                <Input
                  placeholder="e.g., Alex, Maria, John"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Gender Selection */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="border-white/30 text-white" />
                    <Label htmlFor="male" className="text-white">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="border-white/30 text-white" />
                    <Label htmlFor="female" className="text-white">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" className="border-white/30 text-white" />
                    <Label htmlFor="neutral" className="text-white">
                      Neutral
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Method Selection */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Naming Method</Label>
                <RadioGroup value={method} onValueChange={setMethod} className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phonetic" id="phonetic" className="border-white/30 text-white" />
                    <Label htmlFor="phonetic" className="text-white">
                      Phonetic
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="meaning" id="meaning" className="border-white/30 text-white" />
                    <Label htmlFor="meaning" className="text-white">
                      Meaning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mix" id="mix" className="border-white/30 text-white" />
                    <Label htmlFor="mix" className="text-white">
                      Mix
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Surname Selection */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Surname Preference</Label>
                <RadioGroup value={surname} onValueChange={setSurname} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="common" id="common" className="border-white/30 text-white" />
                    <Label htmlFor="common" className="text-white">
                      Common Chinese surnames
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="phonetic-surname"
                      id="phonetic-surname"
                      className="border-white/30 text-white"
                    />
                    <Label htmlFor="phonetic-surname" className="text-white">
                      Phonetic match to my name
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" className="border-white/30 text-white" />
                    <Label htmlFor="custom" className="text-white">
                      Custom surname
                    </Label>
                  </div>
                </RadioGroup>
                {surname === "custom" && (
                  <Input
                    placeholder="Enter preferred surname"
                    value={customSurname}
                    onChange={(e) => setCustomSurname(e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                )}
              </div>

              {/* Generate Button */}
              <Button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating..." : "Generate My BaZi-Aligned Name"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* BaZi Feature Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-10">The Power of BaZi in Chinese Naming</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">命</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Destiny Alignment</h3>
              <p className="text-white/80">Names that harmonize with your birth elements can enhance your life path and fortune.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-500/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">運</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fortune Enhancement</h3>
              <p className="text-white/80">Traditional BaZi principles suggest that balanced names can positively influence your luck and fortune.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">和</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Elemental Harmony</h3>
              <p className="text-white/80">Our algorithm balances the five elements (Wood, Fire, Earth, Metal, Water) for optimal name energy.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div ref={pricingRef} id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Pricing Plans</h2>
        <p className="text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto">
          Choose the perfect plan to unlock the full potential of your Chinese name
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.highlight ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 transform translate-x-8 translate-y-4 rotate-45">
                  Popular
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-end mb-5">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-white/60 ml-1 mb-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-white/80 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.isCurrent 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} id="faq" className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-1 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-white/80">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* 生成弹窗 */}
      <GeneratingPopup 
        isOpen={showGeneratingPopup} 
        onClose={() => setShowGeneratingPopup(false)} 
      />
    </div>
  )
}
