# Chat AI — AI 语音/视频通话

复刻豆包的打电话和视频通话功能，使用动漫角色声音和 Live2D 虚拟形象。

## ✨ 功能

- 🎤 **语音通话** — 实时语音对话，浏览器 STT 识别 + AI 回复
- 🎥 **视频通话** — Live2D 动漫角色虚拟形象，支持情感表达
- 🌸 **动漫角色声音** — 使用 Microsoft Edge TTS 日语神经语音（Nanami、Aoi、Mayu 等）
- 💬 **对话字幕** — 实时显示对话文字
- 🎨 **暗色主题 UI** — 毛玻璃效果、渐变色、流畅动画

## 🏗 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS |
| 后端 | Node.js + Express + Socket.IO |
| AI 对话 | OpenAI 兼容 API (GPT/Claude) |
| TTS | Python FastAPI + Microsoft Edge TTS |
| 虚拟形象 | Canvas 2D 渲染 + Live2D 扩展接口 |

## 📁 项目结构

```
chat_ai/
├── client/          # React 前端
├── server/          # Node.js 后端
├── python-tts/      # Python TTS 服务
├── package.json     # 根脚本
└── README.md
```

## 🚀 快速开始

### 前提条件

- Node.js >= 18
- Python >= 3.10
- 现代浏览器 (Chrome/Edge 推荐，支持 Web Speech API)

### 安装

```bash
cd chat_ai

# 1. 安装所有依赖
npm run install:all

# 2. 配置环境变量
# 编辑 server/.env，填入你的 OPENAI_API_KEY
# （不填 API Key 也可以使用内置 mock 对话模式测试）

# 3. 启动 TTS 服务 (终端 1)
cd python-tts
python tts_server.py

# 4. 启动后端 (终端 2)
cd server
npm run dev

# 5. 启动前端 (终端 3)
cd client
npm run dev
```

然后打开浏览器访问 **http://localhost:5173**

### 一键启动

```bash
# 需要先分别启动 TTS 服务
npm run dev:tts   # 终端 1: TTS
npm run dev       # 终端 2: 前后端同时启动
```

## 🎤 动漫语音配置

默认使用 Edge TTS 的日语语音。可用的动漫风格语音：

| 语音 ID | 名称 | 风格 |
|---------|------|------|
| `ja-JP-NanamiNeural` | 七海 Nanami | 自然温暖 ✨ 默认 |
| `ja-JP-AoiNeural` | 葵 Aoi | 年轻活泼 |
| `ja-JP-MayuNeural` | 真由 Mayu | 可爱甜美 |
| `ja-JP-ShioriNeural` | 栞 Shiori | 清晰知性 |
| `ja-JP-NaokiNeural` | 直樹 Naoki | 年轻自信 (男) |

修改 `server/src/config/index.ts` 中的 `aiPersona.voice` 即可切换。

### 进阶：GPT-SoVITS 动漫角色声音克隆

如需特定动漫角色声音（如孤独摇滚的後藤ひとり）：

1. 安装 [GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)
2. 从 [Hugging Face](https://huggingface.co/lpkpaco/Bocchi-The-Rock-GPT-SoVITS-Models) 下载预训练模型
3. 启动 GPT-SoVITS API 服务
4. 修改 `python-tts/voice_config.yaml` 中 `engine: gpt-sovits`

### 进阶：Live2D 模型集成

项目已预留 Live2D 接口。集成真实 Live2D 模型：

1. 安装 `live2d-renderer`: `cd client && npm install live2d-renderer`
2. 从 [Live2D 官网](https://www.live2d.com/en/learn/sample/) 下载免费模型（如 Hiyori Momose）
3. 将模型文件放入 `client/public/models/`
4. 修改 `Live2DAvatar.tsx` 替换 Canvas 渲染为 Live2D 引擎

## 🔧 API 接口

### REST API
```
GET  /api/health          # 健康检查
POST /api/call/start      # 开始通话
POST /api/call/end        # 结束通话
```

### Python TTS API
```
GET  /api/tts/voices      # 可用语音列表
POST /api/tts/generate    # 生成语音 (base64 WAV)
```

### Socket.IO 事件
```
客户端 → 服务端:
  call:start     # 发起通话
  call:end       # 结束通话
  stt:result     # 语音识别结果

服务端 → 客户端:
  call:connected     # 通话已建立
  call:disconnected  # 通话已断开
  audio:reply        # AI 语音回复
  message:subtitle   # 对话字幕
  live2d:emotion     # 角色表情
```

## 📝 License

MIT
