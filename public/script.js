const data = JSON.parse(localStorage.getItem("travelData"));

// 防止没有数据时页面报错
if (!data) {
  alert("没有找到问卷数据，请先填写问卷。");
  window.location.href = "form.html";
}

// 出行画像
function generateProfile(data) {
  let text = "";

  if (data.pace === "慢慢玩") {
    text += "你更适合轻松慢游类型的出行，不太适合赶行程。";
  } else if (data.pace === "适中") {
    text += "你适合节奏适中的旅行，可以兼顾游玩和休息。";
  } else {
    text += "你可以接受稍微紧凑一点的行程安排。";
  }

  text += `预算在 ${data.budget} 区间，`;

  if (data.value === "性价比") {
    text += "更看重性价比。";
  } else if (data.value === "舒适") {
    text += "更看重舒适体验。";
  } else {
    text += "更偏向品质出行。";
  }

  text += `适合安排 ${data.days} 天左右的行程。`;

  if (data.interests && data.interests.length > 0) {
    text += `你更偏好 ${data.interests.join("、")} 类型的旅行体验。`;
  }

  return text;
}

// 同行建议
function generateCompanion(data) {
  let text = "";

  if (data.companion === "否") {
    return "你更适合与熟人出行，本次建议优先考虑熟人组合。";
  }

  text += "你更适合与以下类型的人同行：\n";

  if (data.pace === "慢慢玩") {
    text += "• 节奏偏慢\n";
  } else if (data.pace === "适中") {
    text += "• 节奏适中\n";
  } else {
    text += "• 可以接受稍紧凑安排\n";
  }

  text += `• 预算在 ${data.budget}\n`;

  if (data.personality === "安静") {
    text += "• 偏安静、不太吵闹\n";
  } else if (data.personality === "外向") {
    text += "• 偏外向、愿意交流\n";
  } else {
    text += "• 沟通自然、相处轻松\n";
  }

  if (data.share === "接受") {
    text += "• 接受拼房，更容易协调\n";
  }

  text += "\n建议 2–4 人小团出行，更容易协调节奏。";

  return text.replace(/\n/g, "<br>");
}

// 调用后端 AI 路线接口
async function generateAIRoute(data) {
  const routesEl = document.getElementById("routes");

  try {
    routesEl.innerHTML = "正在生成路线，请稍等...";

    const response = await fetch("/api/generate-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "生成失败");
    }

    routesEl.innerHTML = `
      <div class="ai-route">
        ${result.route.replace(/\n/g, "<br>")}
      </div>
    `;
  } catch (error) {
    console.error("AI 路线生成失败:", error);
    routesEl.innerHTML = `
      <div class="error-box">
        路线生成失败：${error.message}
      </div>
    `;
  }
}

// 页面初始化
function initPage() {
  document.getElementById("profile").innerText = generateProfile(data);
  document.getElementById("companion").innerHTML = generateCompanion(data);
  generateAIRoute(data);
}

function back() {
  window.location.href = "form.html";
}

function contact() {
  alert("这里后续可以接你妈的微信、二维码或群入口。");
}

initPage();