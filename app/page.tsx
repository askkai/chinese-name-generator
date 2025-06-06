"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GeneratingPopup from "@/components/GeneratingPopup"

const exampleNames = [
  { chinese: "李明", pinyin: "Lǐ Míng", meaning: "Bright & Clear" },
  { chinese: "王雅", pinyin: "Wáng Yǎ", meaning: "Elegant & Graceful" },
  { chinese: "张伟", pinyin: "Zhāng Wěi", meaning: "Great & Mighty" },
  { chinese: "陈美", pinyin: "Chén Měi", meaning: "Beautiful" },
  { chinese: "刘强", pinyin: "Liú Qiáng", meaning: "Strong & Powerful" },
]

const faqs = [
  {
    question: "How accurate are the generated names?",
    answer:
      "Our AI considers Chinese naming traditions, cultural meanings, and pronunciation to create authentic names.",
  },
  {
    question: "Can I use these names officially?",
    answer: "Yes! These names follow proper Chinese naming conventions and can be used for official documents.",
  },
  {
    question: "What's the difference between phonetic and meaning-based names?",
    answer:
      "Phonetic names sound similar to your original name, while meaning-based names focus on positive symbolism.",
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

  // Rotate example names every 3 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % exampleNames.length)
    }, 3000)
    return () => clearInterval(interval)
  })

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
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">ChineseName.ai</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/history">
              <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Get Your Perfect
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent block">
            Chinese Name
          </span>
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Generate authentic Chinese names in 30 seconds. Perfect for students, professionals, and travelers exploring
          Chinese culture.
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
                {isGenerating ? "Generating..." : "Generate My Chinese Name"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
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

      {/* 生成弹窗 */}
      <GeneratingPopup 
        isOpen={showGeneratingPopup} 
        onClose={() => setShowGeneratingPopup(false)} 
      />
    </div>
  )
}
