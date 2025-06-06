import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

// 使用虚拟环境中的Python运行edge-tts
const PYTHON_PATH = path.join(process.cwd(), '.venv/bin/python3');
const TEMP_DIR = os.tmpdir();

// 生成临时文件名
function generateTempFilename(): string {
  return path.join(TEMP_DIR, `speech-${crypto.randomBytes(8).toString('hex')}.mp3`);
}

// 创建Python脚本来运行edge-tts
function createPythonScript(text: string, outputFile: string, voice: string): string {
  const scriptContent = `
import edge_tts
import asyncio

async def run_tts(text, output, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output)

asyncio.run(run_tts('${text.replace(/'/g, "\\'")}', '${outputFile}', '${voice}'))
  `;
  
  const scriptFile = path.join(TEMP_DIR, `tts-script-${crypto.randomBytes(8).toString('hex')}.py`);
  fs.writeFileSync(scriptFile, scriptContent);
  return scriptFile;
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求
    const { text, voice = 'zh-CN-XiaoxiaoNeural' } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // 生成临时文件名
    const outputFile = generateTempFilename();
    
    // 创建Python脚本
    const scriptFile = createPythonScript(text, outputFile, voice);
    
    // 运行Python脚本
    return new Promise((resolve) => {
      const pythonProcess = spawn(PYTHON_PATH, [scriptFile]);
      
      let errorOutput = '';
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        // 删除脚本文件
        fs.unlinkSync(scriptFile);
        
        if (code !== 0) {
          console.error('TTS Error:', errorOutput);
          resolve(NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 }));
          return;
        }
        
        try {
          // 读取生成的音频文件
          const audioData = fs.readFileSync(outputFile);
          
          // 删除临时音频文件
          fs.unlinkSync(outputFile);
          
          // 返回音频数据
          const response = new NextResponse(audioData);
          response.headers.set('Content-Type', 'audio/mpeg');
          response.headers.set('Content-Disposition', 'attachment; filename="speech.mp3"');
          
          resolve(response);
        } catch (error) {
          console.error('File handling error:', error);
          resolve(NextResponse.json({ error: 'Failed to read audio file' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 