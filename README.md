# Chinese Name Generator

一个帮助非中文使用者生成正宗中文名字的网络应用。 | A web application that helps non-Chinese users generate authentic Chinese names.

## 功能特点 | Features

- 根据性别、命名方法和姓氏偏好生成中文名字
- 显示名字的拼音、含义和流行度
- 名字发音（文本转语音）功能
- 收藏和复制喜欢的名字
- 浏览历史记录
- 美观直观的用户界面

## 技术栈 | Tech Stack

- Next.js 15
- React 19
- Tailwind CSS
- OpenAI/OpenRouter API (AI 名字生成)
- Edge-TTS (文本转语音)

## 本地安装 | Local Installation

1. 克隆仓库 | Clone the repository
```
git clone https://github.com/yourusername/chinese-name-generator.git
cd chinese-name-generator
```

2. 安装依赖 | Install dependencies
```
npm install
```

3. 创建 `.env` 文件并添加您的API密钥 | Create `.env` file and add your API key
```
OPENROUTER_API_KEY=your_api_key_here
```

4. 启动开发服务器 | Start the development server
```
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 使用方法 | Usage

1. 输入您的当前名字（可选）
2. 选择性别（男性、女性或中性）
3. 选择命名方法（音译、含义或混合）
4. 选择姓氏偏好（常见中文姓氏、音译姓氏或自定义姓氏）
5. 点击"生成我的中文名字"按钮
6. 查看生成的名字并使用播放、收藏和复制功能

## 许可证 | License

MIT 