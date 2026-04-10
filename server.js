const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DEEPSEEK_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "server is running" });
});

// AI 生成路线接口
app.post("/api/generate-route", async (req, res) => {
  try {
    const data = req.body;

    if (!API_KEY) {
      return res.status(500).json({
        error: "缺少 DeepSeek API Key，请检查 .env 文件"
      });
    }

    const prompt = `
你是一个擅长为中老年人设计旅行路线的助手。
请根据以下用户信息，生成一份清晰、友好、适合中老年人阅读的出行建议。

用户信息：
出发城市：${data.city || "未填写"}
目的地：${data.destination || "未填写"}
出行时间：${data.time || "未填写"}
天数：${data.days || "未填写"}
旅行节奏：${data.pace || "未填写"}
是否接受早起：${data.early || "未填写"}
步行程度：${data.walk || "未填写"}
预算：${data.budget || "未填写"}
消费偏好：${data.value || "未填写"}
住宿偏好：${data.stay || "未填写"}
兴趣：${Array.isArray(data.interests) ? data.interests.join("、") : "未填写"}

请输出：
1. 一个简短的整体判断
2. 一个按天安排的旅行建议
3. 一段“为什么适合这个用户”的说明

要求：
- 语言自然、温和、清楚
- 不要太像机器人
- 不要输出 JSON
- 用简体中文
- 每天安排不要太满
`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个擅长中老年旅行规划的中文助手。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "DeepSeek API 调用失败",
        details: result
      });
    }

    const content = result?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        error: "AI 没有返回有效内容",
        details: result
      });
    }

    res.json({ route: content });
  } catch (error) {
    console.error("生成路线失败:", error);
    res.status(500).json({
      error: "服务器内部错误",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});