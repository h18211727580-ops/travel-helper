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

// AI生成路线
app.post("/api/generate-route", async (req, res) => {
  try {
    const data = req.body;

    if (!API_KEY) {
      return res.status(500).json({
        error: "缺少 DeepSeek API Key，请检查 .env"
      });
    }

    const prompt = `
你是一个擅长为中老年用户设计旅行方案的助手。

用户信息：
出发地：${data.city || "未填写"}
目的地：${data.destination || "未填写"}
天数：${data.days || "未填写"}
节奏：${data.pace || "未填写"}
预算：${data.budget || "未填写"}
是否同行：${data.companion || "未填写"}

请按下面格式输出：

【路线总览】
2-3句总结

【每日安排】
按“第1天、第2天...”写

【住宿建议】
2-4条

【同行建议】
给建议
`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();

    res.json({
      route: result.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "服务器错误" });
  }
});

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});