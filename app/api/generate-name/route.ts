import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// 安全处理API密钥 - 从环境变量获取或使用默认值
// 在生产环境中应该使用环境变量，而不是硬编码
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// 创建OpenAI客户端实例
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://chinesename.ai", // 您的网站URL，用于OpenRouter排名
    "X-Title": "ChineseName.ai", // 您的网站名称，用于OpenRouter排名
  }
});

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { currentName, gender, method, surname, customSurname } = body;

    // 构建提示词
    let prompt = `请为一个${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '中性'}外国人生成8个地道的中文名字。`;
    
    if (currentName) {
      prompt += `他们的英文名是 "${currentName}"。`;
    }
    
    if (method === 'phonetic') {
      prompt += `请生成音译名字，发音尽量接近他们的英文名。`;
    } else if (method === 'meaning') {
      prompt += `请生成有美好寓意的中文名字，不必考虑音译。`;
    } else {
      prompt += `请生成既有美好寓意又尽量接近原名发音的中文名字。`;
    }
    
    if (surname === 'common') {
      prompt += `请使用常见的中国姓氏。`;
    } else if (surname === 'phonetic-surname') {
      prompt += `请使用音译的姓氏，尽量接近原名的首字母或首音节。`;
    } else if (surname === 'custom' && customSurname) {
      prompt += `请使用"${customSurname}"作为姓氏。`;
    }
    
    prompt += `对于每个名字，请提供:
    1. 中文名字
    2. 拼音（带声调）
    3. 含义解释
    4. 流行度评价（如常见、流行、新潮等）
    请用JSON格式返回，格式为：[{"chinese": "姓名", "pinyin": "拼音", "meaning": "含义", "popularity": "流行度"}]`;

    // 调用API
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000
    });

    // 解析响应
    let generatedNames;
    try {
      const content = completion.choices[0].message.content || '';
      // 尝试提取JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        generatedNames = JSON.parse(jsonMatch[0]);
      } else {
        // 如果没有找到JSON格式，尝试解析整个响应
        generatedNames = JSON.parse(content);
      }
    } catch (error) {
      console.error("解析响应失败:", error);
      // 如果解析失败，返回原始文本
      return NextResponse.json({ 
        names: [], 
        rawResponse: completion.choices[0].message.content 
      });
    }

    return NextResponse.json({ names: generatedNames });
  } catch (error) {
    console.error("API调用错误:", error);
    return NextResponse.json(
      { error: "生成名字时出错" },
      { status: 500 }
    );
  }
} 