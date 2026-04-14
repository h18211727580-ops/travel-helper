const raw = localStorage.getItem("travelData");

if (!raw) {
  alert("没有找到填写记录，请先填写问卷。");
  window.location.href = "form.html";
}

const data = JSON.parse(raw);

function generateProfile(data) {
  const city = data.city || "未填写";
  const destination = data.destination || "未填写";
  const days = data.days || "未填写";
  const pace = data.pace || "未填写";
  const budget = data.budget || "未填写";
  const companion = data.companion || "未填写";

  let paceText = "";
  if (pace === "慢慢玩") {
    paceText = "你更适合轻松、慢节奏、有留白的行程，不太适合赶景点式安排。";
  } else if (pace === "适中") {
    paceText = "你更适合张弛有度的旅行方式，既能玩到重点，也保留休息空间。";
  } else {
    paceText = "你能接受稍紧凑一点的行程，适合内容更丰富的短途安排。";
  }

  let companionText = "";
  if (companion === "是") {
    companionText = "你愿意考虑同行，因此更适合节奏明确、容易协调的小团出行。";
  } else {
    companionText = "你这次更偏向自己安排或与熟人同行，因此路线本身的舒适度会更重要。";
  }

  return `
    <p>你这次是从 <strong>${city}</strong> 出发，目的地倾向于 <strong>${destination}</strong>，计划出行 <strong>${days} 天</strong> 左右。</p>
    <p>从旅行风格看，你的节奏偏向 <strong>${pace}</strong>，预算大致在 <strong>${budget}</strong> 区间。</p>
    <p>${paceText}</p>
    <p>${companionText}</p>
  `;
}

function generateWhyFit(data) {
  const reasons = [];

  if (data.pace === "慢慢玩") {
    reasons.push("你的节奏更偏向轻松舒适，所以建议避免高强度赶路。");
  } else if (data.pace === "适中") {
    reasons.push("你适合兼顾体验与休息的安排，不必太赶，也不宜太空。");
  } else {
    reasons.push("你可以接受更丰富一点的内容，因此路线可以稍微充实一些。");
  }

  if (data.budget === "1000-2000") {
    reasons.push("你的预算更偏向控制成本，因此更适合短途、轻量和性价比优先的出行方式。");
  } else if (data.budget === "2000-4000") {
    reasons.push("你的预算有一定空间，可以兼顾舒适度和整体体验。");
  } else if (data.budget === "4000+") {
    reasons.push("你的预算更充足，可以优先考虑住得更舒服、节奏更从容的安排。");
  }

  if (data.companion === "是") {
    reasons.push("你愿意考虑同行，因此建议优先找预算相近、节奏接近的人。");
  } else {
    reasons.push("你暂时不考虑同行，因此建议重点放在路线本身是否清晰、省心和舒服。");
  }

  return reasons.map(item => `<p>• ${item}</p>`).join("");
}

function generateCompanion(data) {
  if (data.companion === "否") {
    return `
      <p>你这次暂时不考虑找同行，因此建议先把路线和节奏安排清楚，以自己舒服为优先。</p>
      <p>如果后续改变想法，也更适合先从熟人、熟人的熟人开始，而不是直接与完全陌生的人拼行程。</p>
    `;
  }

  let paceText = "节奏接近的人";
  if (data.pace === "慢慢玩") {
    paceText = "喜欢慢慢玩、不赶路的人";
  } else if (data.pace === "适中") {
    paceText = "喜欢适中节奏、既能玩也能休息的人";
  } else {
    paceText = "能接受内容更丰富一点行程的人";
  }

  return `
    <p>如果要找同行，你更适合和 <strong>${paceText}</strong> 一起出发。</p>
    <p>更建议控制在 <strong>2–4 人小团</strong>，这样更容易真正协调时间和预算。</p>
    <p>建议优先找 <strong>出发时间接近、预算相近、对旅行节奏理解一致</strong> 的人。</p>
  `;
}

function generateSummary(data) {
  const items = [
    { label: "出发地", value: data.city || "未填写" },
    { label: "目的地", value: data.destination || "未填写" },
    { label: "出行天数", value: data.days ? `${data.days} 天` : "未填写" },
    { label: "旅行节奏", value: data.pace || "未填写" },
    { label: "预算范围", value: data.budget || "未填写" },
    { label: "是否考虑同行", value: data.companion || "未填写" }
  ];

  return items.map(item => `
    <div class="summary-row">
      <div class="summary-row-label">${item.label}</div>
      <div class="summary-row-value">${item.value}</div>
    </div>
  `).join("");
}

async function generateAIRoute(data) {
  const routesEl = document.getElementById("routes");

  try {
    routesEl.innerHTML = `
      <div class="loading-box">
        <div class="loading-dot"></div>
        <span>正在为你生成更详细的路线建议...</span>
      </div>
    `;

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
      <div class="ai-route-content">
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

function back() {
  window.location.href = "form.html";
}

function contact() {
  alert("这里后续可以接微信、二维码、群入口或人工服务联系方式。");
}

function initPage() {
  document.getElementById("profile").innerHTML = generateProfile(data);
  document.getElementById("whyFit").innerHTML = generateWhyFit(data);
  document.getElementById("companion").innerHTML = generateCompanion(data);
  document.getElementById("summary").innerHTML = generateSummary(data);
  generateAIRoute(data);
}

initPage();