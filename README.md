# Avocado Lab Website

Avocado Lab 的繁體中文單頁網站，重點介紹 FlowRunning iOS MVP。

## 本機預覽

```bash
cd /Users/kennytsui/Avocadolab/Website
python3 -m http.server 4173
```

然後開啟 `http://localhost:4173`。

## 驗證

```bash
npm test
node --check assets/site.js
```

網站是純 HTML、CSS 與 JavaScript，整個 `Website` 目錄可以直接部署到 GitHub Pages、Cloudflare Pages 或其他靜態網站服務。

## 內容備註

- FlowRunning 手機畫面依目前 SwiftUI MVP 的資訊架構、視覺 token 與產品文案重建為高保真網頁預覽。
- Beta 測試與合作 CTA 使用 `mailto:info@avocado-lab.com`，不收集或儲存訪客資料。
- Garmin、HealthKit、付費訂閱及 App Store 發佈均只列為後續規劃。
