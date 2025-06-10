"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Volume2, Star, Copy, RefreshCw, Sparkles, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GeneratingPopup from "@/components/GeneratingPopup"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

// 名字类型定义
interface ChineseName {
  chinese: string;
  pinyin: string;
  meaning: string;
  popularity: string;
  isFavorite: boolean;
}

// 用户偏好类型定义
interface UserPreferences {
  currentName: string;
  gender: string;
  method: string;
  surname: string;
  customSurname: string;
}

const tips = [
  "Practice pronunciation with native speakers for the best results",
  "Consider the cultural context when using your Chinese name",
  "Your Chinese name can be used on business cards and official documents",
  "Each character in your name carries deep cultural significance",
]

// 添加自定义按钮样式组件
interface EmojiButtonProps {
  icon: React.ComponentType<any>;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  color?: 'blue' | 'pink' | 'green' | 'yellow';
  title?: string;
  activeColor?: 'yellow';
  children?: React.ReactNode;
}

const EmojiButton = ({ 
  icon: Icon, 
  onClick, 
  active = false, 
  disabled = false,
  color = "blue",
  title,
  activeColor = "yellow",
  children
}: EmojiButtonProps) => {
  // 颜色映射
  const colorMap = {
    blue: {
      bg: "bg-blue-500/90",
      hover: "hover:bg-blue-600/90",
      shadow: "shadow-blue-500/30",
      text: "text-blue-100",
      border: "border-blue-400/50",
      glow: "from-blue-400 to-blue-600"
    },
    pink: {
      bg: "bg-pink-500/90",
      hover: "hover:bg-pink-600/90",
      shadow: "shadow-pink-500/30",
      text: "text-pink-100",
      border: "border-pink-400/50",
      glow: "from-pink-400 to-pink-600"
    },
    green: {
      bg: "bg-green-500/90",
      hover: "hover:bg-green-600/90",
      shadow: "shadow-green-500/30",
      text: "text-green-100",
      border: "border-green-400/50",
      glow: "from-green-400 to-green-600"
    },
    yellow: {
      bg: "bg-yellow-500/90",
      hover: "hover:bg-yellow-600/90",
      shadow: "shadow-yellow-500/30",
      text: "text-yellow-100",
      border: "border-yellow-400/50",
      glow: "from-yellow-400 to-yellow-600"
    }
  } as const;

  const activeColorMap = {
    yellow: {
      bg: "bg-yellow-500/90",
      hover: "hover:bg-yellow-600/90",
      shadow: "shadow-yellow-500/30",
      text: "text-yellow-100",
      border: "border-yellow-400/50",
      glow: "from-yellow-300 to-yellow-500"
    }
  } as const;

  const currentColor = active ? activeColorMap[activeColor] : colorMap[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative group flex items-center justify-center 
        w-12 h-12 rounded-full 
        ${currentColor.bg} ${!disabled && currentColor.hover}
        border-2 ${currentColor.border}
        shadow-lg ${currentColor.shadow}
        transition-all duration-200 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-110 hover:rotate-3'}
        backdrop-blur-sm overflow-hidden
        active:scale-95 active:rotate-0
      `}
    >
      {/* 外部光晕效果 */}
      <div className={`absolute -inset-1 bg-gradient-radial ${currentColor.glow} opacity-0 group-hover:opacity-40 blur-md transition-opacity`}></div>
      
      {/* 内部高光效果 - 模拟3D */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-80"></div>
      
      {/* 内部阴影效果 - 模拟3D */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-80 rounded-full"></div>
      
      {/* 侧面高光 */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-full"></div>
      
      {/* 底部阴影 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent rounded-b-full"></div>
      
      {/* 图标 */}
      <div className="relative z-10 transform group-hover:scale-110 transition-transform">
        <Icon className={`w-5 h-5 ${currentColor.text} drop-shadow-md ${disabled ? 'animate-pulse' : 'group-hover:animate-bounce-mini'}`} />
      </div>
      
      {/* 点击波纹效果 */}
      <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 scale-0 group-active:scale-100 group-active:opacity-100 transition-all duration-300"></div>
      
      {children}
    </button>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const [names, setNames] = useState<ChineseName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showGeneratingPopup, setShowGeneratingPopup] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [currentVoice, setCurrentVoice] = useState('zh-CN-XiaoxiaoNeural');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 从sessionStorage获取生成的名字
    const storedNames = sessionStorage.getItem('generatedNames');
    const storedPreferences = sessionStorage.getItem('userPreferences');
    
    if (storedNames) {
      try {
        const parsedNames = JSON.parse(storedNames);
        setNames(parsedNames.map((name: any) => ({ ...name, isFavorite: false })));
      } catch (error) {
        console.error('解析存储的名字时出错:', error);
      }
    }
    
    if (storedPreferences) {
      try {
        setUserPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error('解析存储的用户偏好时出错:', error);
      }
    }
  }, []);

  // 加载可用的中文语音
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/list-voices');
        if (response.ok) {
          const data = await response.json();
          setVoices(data.voices || []);
          // 设置默认语音
          if (data.voices && data.voices.length > 0) {
            setCurrentVoice(data.voices[0].ShortName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error);
      }
    };

    fetchVoices();
  }, []);

  // 创建音频元素
  useEffect(() => {
    const audio = new Audio();
    setAudioRef(audio);
    
    return () => {
      // 清理函数
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, []);

  const toggleFavorite = (index: number) => {
    setNames((prev) => prev.map((name, i) => (i === index ? { ...name, isFavorite: !name.isFavorite } : name)))
    
    // 可以在这里保存到历史记录
    const updatedFavorites = names.map((name, i) => 
      i === index ? { ...name, isFavorite: !name.isFavorite } : name
    ).filter(name => name.isFavorite);
    
    // 存储收藏的名字
    const storedFavorites = localStorage.getItem('favoriteNames');
    let favorites = [];
    
    if (storedFavorites) {
      try {
        favorites = JSON.parse(storedFavorites);
      } catch (error) {
        console.error('解析收藏的名字时出错:', error);
      }
    }
    
    // 添加或移除收藏
    if (names[index].isFavorite) {
      // 移除收藏
      favorites = favorites.filter((fav: ChineseName) => fav.chinese !== names[index].chinese);
    } else {
      // 添加到收藏
      favorites.push({
        ...names[index],
        isFavorite: true,
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
    
    localStorage.setItem('favoriteNames', JSON.stringify(favorites));
  }

  // 播放发音功能
  const playPronunciation = async (chinese: string, pinyin: string) => {
    if (isPlaying || !audioRef) return;
    
    try {
      setIsPlaying(true);
      
      // 构建发音文本
      const pronounceText = `${chinese}. ${pinyin}`;
      
      // 调用API生成语音
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: pronounceText,
          voice: currentVoice,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      // 创建音频Blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // 播放音频
      audioRef.src = audioUrl;
      audioRef.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.play();
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
      alert('Error playing pronunciation. Please try again.');
    }
  };

  const copyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "Very Common":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "Common":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "Popular":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Trendy":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Classic":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Modern":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }
  
  // 重新生成名字
  const regenerateNames = async () => {
    if (!userPreferences) {
      alert('无法获取用户偏好设置，请返回主页重新生成');
      return;
    }
    
    setIsLoading(true);
    setShowGeneratingPopup(true);
    
    try {
      const response = await fetch('/api/generate-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to regenerate names');
      }
      
      const data = await response.json();
      
      // 更新名字
      setNames(data.names.map((name: any) => ({ ...name, isFavorite: false })) as ChineseName[]);
      
      // 更新存储
      sessionStorage.setItem('generatedNames', JSON.stringify(data.names));
    } catch (error) {
      console.error('Error regenerating names:', error);
      alert('Error regenerating names. Please try again.');
    } finally {
      setIsLoading(false);
      setShowGeneratingPopup(false);
    }
  };
  
  // 保存到历史记录
  useEffect(() => {
    if (names.length > 0 && userPreferences) {
      // 获取现有历史记录
      const storedHistory = localStorage.getItem('nameHistory');
      let history = [];
      
      if (storedHistory) {
        try {
          history = JSON.parse(storedHistory);
        } catch (error) {
          console.error('Error parsing history:', error);
        }
      }
      
      // 添加新记录
      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        preferences: userPreferences,
        names: names.slice(0, 3).map((name: ChineseName) => ({ 
          chinese: name.chinese, 
          pinyin: name.pinyin, 
          meaning: name.meaning 
        }))
      };
      
      // 添加到历史记录最前面
      history.unshift(newRecord);
      
      // 最多保存10条记录
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      
      localStorage.setItem('nameHistory', JSON.stringify(history));
    }
  }, [names, userPreferences]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* 生成弹窗 */}
      <GeneratingPopup 
        isOpen={showGeneratingPopup} 
        onClose={() => setShowGeneratingPopup(false)} 
      />

      {/* Navigation */}
      <Navbar 
        showMainNav={false}
        rightActions={
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 backdrop-blur-sm"
            onClick={regenerateNames}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'Regenerate'}
          </Button>
        }
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Chinese Names</h1>
          <p className="text-xl text-white/80">
            {names.length > 0 
              ? `Here are ${names.length} carefully selected names based on your preferences` 
              : 'Loading your names...'}
          </p>
          
          {/* 语音选择 */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="text-sm text-white/60 mb-1 text-left">Voice for pronunciation:</div>
            <select 
              value={currentVoice}
              onChange={(e) => setCurrentVoice(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={voices.length === 0}
            >
              {voices.length === 0 ? (
                <option>Loading voices...</option>
              ) : (
                voices.map((voice) => (
                  <option key={voice.ShortName} value={voice.ShortName}>
                    {voice.FriendlyName} ({voice.Gender})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Name Cards Grid */}
        {names.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {names.map((name: ChineseName, index: number) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-white mb-2">{name.chinese}</div>
                  <div className="text-lg text-white/80 mb-1">{name.pinyin}</div>
                    <div className="text-sm text-white/60 mb-3">
                      <span className="text-white/80">Meaning:</span> {name.meaning}
                    </div>
                    <Badge className={`text-xs ${getPopularityColor(name.popularity)}`}>
                      {name.popularity}
                    </Badge>
                </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    <EmojiButton
                      icon={Volume2}
                      onClick={() => playPronunciation(name.chinese, name.pinyin)}
                      disabled={isPlaying}
                      color="blue"
                      title="Listen to pronunciation"
                    >
                      {isPlaying && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Playing...
                        </div>
                      )}
                    </EmojiButton>
                    <EmojiButton
                      icon={Star}
                    onClick={() => toggleFavorite(index)}
                      active={name.isFavorite}
                      color="pink"
                      activeColor="yellow"
                      title={name.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {name.isFavorite && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-100 fill-current animate-pulse-mini" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-yellow-400/20 rounded-full animate-ping-mini"></div>
                          </div>
                        </>
                      )}
                    </EmojiButton>
                    <EmojiButton
                      icon={Copy}
                    onClick={() => copyName(name.chinese, index)}
                      color="green"
                      title="Copy name"
                    >
                      {copiedIndex === index && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-100 animate-scale-in-out" />
                          </div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap animate-fade-in-up">
                            Copied!
                          </div>
                        </>
                      )}
                    </EmojiButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">Loading your Chinese names...</div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Tips for Using Your Chinese Name</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
