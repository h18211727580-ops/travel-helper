<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>你的出行建议</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page-shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">旅</div>
        <div>
          <div class="brand-name">安心结伴出行助手</div>
          <div class="brand-sub">你的专属出行建议</div>
        </div>
      </div>
    </header>

    <main class="container result-page">
      <section class="result-hero">
        <span class="hero-badge">已完成分析</span>
        <h1>这是更适合你的出行建议</h1>
        <p class="hero-desc">
          我们根据你的出发地、天数、预算和节奏偏好，整理出一版更适合你的路线与同行建议。
        </p>
      </section>

      <section class="result-grid">
        <div class="result-main">
          <div class="result-card">
            <div class="result-card-head">
              <h2>你的出行画像</h2>
            </div>
            <div id="profile" class="result-text">正在生成...</div>
          </div>

          <div class="result-card">
            <div class="result-card-head">
              <h2>推荐路线</h2>
              <span class="result-tag">AI 生成</span>
            </div>
            <div id="routes" class="ai-route">正在生成路线，请稍等...</div>
          </div>

          <div class="result-card">
            <div class="result-card-head">
              <h2>为什么适合你</h2>
            </div>
            <div id="whyFit" class="result-text">正在分析...</div>
          </div>
        </div>

        <aside class="result-side">
          <div class="result-card sticky-card">
            <div class="result-card-head">
              <h2>同行建议</h2>
            </div>
            <div id="companion" class="result-text">正在分析...</div>
          </div>

          <div class="result-card">
            <div class="result-card-head">
              <h2>你的本次偏好</h2>
            </div>
            <div id="summary" class="summary-list"></div>
          </div>

          <div class="result-card">
            <div class="result-card-head">
              <h2>下一步</h2>
            </div>
            <div class="action-stack">
              <button class="btn btn-primary" onclick="contact()">联系组织者</button>
              <button class="btn btn-secondary" onclick="back()">重新填写</button>
            </div>
            <p class="helper-note">
              如果你愿意，后续也可以根据相似偏好帮你留意合适的同行人。
            </p>
          </div>
        </aside>
      </section>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>