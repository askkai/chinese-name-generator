import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

// 使用虚拟环境中的Python运行edge-tts
const PYTHON_PATH = path.join(process.cwd(), '.venv/bin/python3');
const TEMP_DIR = os.tmpdir();

// 创建Python脚本来获取语音列表
function createPythonScript(): string {
  const scriptContent = `
import edge_tts
import asyncio
import json

async def list_voices():
    voices = await edge_tts.list_voices()
    # 过滤出中文语音
    chinese_voices = [v for v in voices if v["Locale"].startswith("zh-")]
    print(json.dumps(chinese_voices))

asyncio.run(list_voices())
  `;
  
  const scriptFile = path.join(TEMP_DIR, `voices-script-${crypto.randomBytes(8).toString('hex')}.py`);
  fs.writeFileSync(scriptFile, scriptContent);
  return scriptFile;
}

export async function GET() {
  try {
    // 创建Python脚本
    const scriptFile = createPythonScript();
    
    // 运行Python脚本
    return new Promise((resolve) => {
      const pythonProcess = spawn(PYTHON_PATH, [scriptFile]);
      
      let outputData = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        // 删除脚本文件
        fs.unlinkSync(scriptFile);
        
        if (code !== 0) {
          console.error('Voice list error:', errorOutput);
          resolve(NextResponse.json({ error: 'Failed to get voice list' }, { status: 500 }));
          return;
        }
        
        try {
          // 解析输出数据
          const voices = JSON.parse(outputData);
          resolve(NextResponse.json({ voices }));
        } catch (error) {
          console.error('JSON parsing error:', error);
          resolve(NextResponse.json({ error: 'Failed to parse voice list' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 