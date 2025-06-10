"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Copy, RefreshCw, Sparkles, Calendar, Download } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

// 类型定义
interface ChineseName {
  chinese: string;
  pinyin: string;
  meaning: string;
  popularity?: string;
  isFavorite?: boolean;
  dateAdded?: string;
}

interface UserPreferences {
  name?: string;
  currentName?: string;
  gender: string;
  method: string;
  surname: string;
  customSurname?: string;
}

interface HistoryItem {
  id: number;
  date: string;
  time: string;
  preferences: UserPreferences;
  names: ChineseName[];
}

export default function HistoryPage() {
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [favoritesData, setFavoritesData] = useState<ChineseName[]>([])

  // 加载历史记录和收藏
  useEffect(() => {
    // 从localStorage加载历史记录
    const storedHistory = localStorage.getItem('nameHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setHistoryData(parsedHistory);
      } catch (error) {
        console.error('Error parsing history records:', error);
      }
    }

    // 从localStorage加载收藏
    const storedFavorites = localStorage.getItem('favoriteNames');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavoritesData(parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedHistory(expandedHistory === id ? null : id)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const exportFavorites = () => {
    // 导出功能的实现（可以在这里实现PNG导出或其他格式）
    alert('Export feature coming soon!');
  }

  // 重新生成历史记录中的名字
  const regenerateFromHistory = (preferences: UserPreferences) => {
    // 保存偏好到sessionStorage
    sessionStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // 跳转到结果页面，由结果页面负责重新生成
    window.location.href = '/results';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <Navbar 
        showMainNav={false}
        rightActions={
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
        }
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">History & Favorites</h1>
          <p className="text-xl text-white/80">Manage your generated names and favorites</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/20">
              History
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-white data-[state=active]:bg-white/20">
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6 mt-8">
            {historyData.length > 0 ? (
              historyData.map((session) => (
              <Card key={session.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-white/60" />
                      <div>
                        <div className="text-white font-medium">{session.date}</div>
                        <div className="text-white/60 text-sm">{session.time}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleExpanded(session.id)}
                        className="text-white hover:bg-white/10"
                      >
                        {expandedHistory === session.id ? "Collapse" : "Expand"}
                      </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white hover:bg-white/10"
                          onClick={() => regenerateFromHistory(session.preferences)}
                        >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  {/* Preferences Summary */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {session.preferences.currentName || session.preferences.name || "No name provided"}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {session.preferences.gender}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {session.preferences.method}
                    </Badge>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      {session.preferences.surname} surname
                    </Badge>
                  </div>

                  {/* Names Preview/Full List */}
                  {expandedHistory === session.id ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {session.names.map((name, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white mb-1">{name.chinese}</div>
                            <div className="text-sm text-white/80 mb-1">{name.pinyin}</div>
                              <div className="text-xs text-white/60 mb-2">
                                <span className="text-white/80">Meaning:</span> {name.meaning}
                              </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyName(name.chinese)}
                              className="text-white hover:bg-white/10"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              {copiedName === name.chinese ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/80">
                      Generated {session.names.length} names • Click expand to view all
                    </div>
                  )}
                </CardContent>
              </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-white/80">No history yet. Generate some names first!</p>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Favorite Names</h2>
              <Button
                onClick={exportFavorites}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>

            {favoritesData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesData.map((name, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                        <div className="text-xl font-bold text-white mb-1">{name.chinese}</div>
                        <div className="text-sm text-white/80 mb-1">{name.pinyin}</div>
                        <div className="text-xs text-white/60 mb-3">{name.meaning}</div>
                        {name.dateAdded && (
                          <div className="text-xs text-white/40">Added on {name.dateAdded}</div>
                        )}
                      </div>
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyName(name.chinese)}
                          className="text-white hover:bg-white/10"
                      >
                          <Copy className="w-3 h-3 mr-1" />
                        {copiedName === name.chinese ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-white/80">No favorites yet. Star some names to add them here!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
