// 提交问卷
function submitForm() {
  const data = {
    city: document.getElementById("city").value,
    destination: document.getElementById("destination").value,
    days: document.getElementById("days").value,
    pace: document.getElementById("pace").value,
    budget: document.getElementById("budget").value,
    companion: document.getElementById("companion").value
  };

  localStorage.setItem("travelData", JSON.stringify(data));
  window.location.href = "result.html";
}

// 解析AI结构
function parseAISections(text) {
  return {
    overview: text.match(/【路线总览】([\s\S]*?)(?=【每日安排】|$)/)?.[1] || "",
    daily: text.match(/【每日安排】([\s\S]*?)(?=【住宿建议】|$)/)?.[1] || "",
    hotel: text.match(/【住宿建议】([\s\S]*?)(?=【同行建议】|$)/)?.[1] || "",
    companion: text.match(/【同行建议】([\s\S]*)/)?.[1] || ""
  };
}

// 格式化文本
function format(text) {
  return text
    .split("\n")
    .filter(i => i.trim())
    .map(i => `<p>${i}</p>`)
    .join("");
}

// 调用AI
async function loadResult() {
  const data = JSON.parse(localStorage.getItem("travelData"));
  const container = document.getElementById("routes");

  container.innerHTML = "生成中...";

  const res = await fetch("/api/generate-route", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  const result = await res.json();

  const s = parseAISections(result.route);

  container.innerHTML = `
    <div class="card">
      <h3>路线总览</h3>
      ${format(s.overview)}
    </div>

    <div class="card">
      <h3>每日安排</h3>
      ${format(s.daily)}
    </div>

    <div class="card">
      <h3>住宿建议</h3>
      ${format(s.hotel)}
    </div>

    <div class="card">
      <h3>同行建议</h3>
      ${format(s.companion)}
    </div>
  `;
}