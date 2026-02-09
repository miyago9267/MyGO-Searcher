# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Version 2.1.0] - 2026-02-09

### Features (Version 2.1.0)

- 實作圖片代理服務，隱藏原始圖床位置並支援相對路徑請求
- 自動化 Changelog 整合：更新提示現在會自動抓取 CHANGELOG.md 內容
- 遷移專案至 Bun runtime，並升級 Node.js v22 與 TypeScript v5.9.3
- 實作語義搜尋 (Semantic Search) 服務，使用 Transformers.js 與 EmbeddingGemma 模型
- 新增基於檔案的 Embedding 快取機制，優化服務啟動時間
- 搜尋結果支援關鍵字高亮顯示
- 新增圖片預覽面板 (Preview Panel)
- 實作暗色模式 (Dark Mode)，支援系統主題切換
- 優化篩選與排序彈出視窗的 UI/UX，引入 `@nuxt/ui` 和 `@unocss`

### Changed (Version 2.1.0)

- 更新 Dockerfile 使用 `oven/bun:latest` 作為基礎映像檔
- 調整 Notification 組件樣式與行為
- 重構圖片 API 以支援代理路徑
- 更新 `image_map.json` 圖片映射資料
- 重構並提取 Composables 以優化組件邏輯

### Fixed (Version 2.1.0)

- 修正 Vue 組件 `Extraneous non-props attributes` 警告
- 修正圖片路徑中文截斷問題
- 修正 Docker 打包與部署相關問題
- 修正 opencc-js 型別宣告問題

## [Version 2.0.1] - 2025-10-13

### Fixed (Version 2.0.1)

- 修正Safari剪貼簿調用的同異步問題（感謝 @ShiriNmi1520 協助）

## [Version 2.0.0] - 2025-08-06

### Features (Version 2.0.0)

- 重構API路由，統一使用RESTful格式，舊版API暫時保留作為過渡，未來則不再更新及支援
      - `GET /api/v1/images/{id}` 獲取特定id圖片
      - `GET /api/v1/images` 獲取所有圖片
      - `GET /api/v1/search` 搜尋圖片
      - `GET /api/v1/random` 隨機獲取圖片
      > 詳見 [API Documentation](docs/API.md)
- 加入篩選器功能，可選擇MyGO集數、AveMujica集數和人物（人物分類尚在製作中）
- 加入排序功能，可選擇四種排序方式（包含預設、集數、字典序、隨機）
- 加入更新提示
- 正式加入AveMujica圖包

### Changed (Version 2.0.0)

- 重新設計前端Component及Nuxt後端架構
- 更新前端載入邏輯，從全部圖片載入改為動態滾動載入
- 優化SSR效能
- 連線MongoDB
- 重構文檔

### Todo （Version 2.0.0）

- 完善人物分類
- 完善API文檔
- 加入人氣排序

## [Version 1.1.2] - 2024-11-14

### Features (Version 1.1.2)

- 支援簡體中文搜尋
- 優化搜尋關鍵字

## [Version 1.1.1] - 2024-11-08

### Features (Version 1.1.1)

- 關鍵字支援多關鍵字查詢
- 查詢算法改進，更精準的搜尋結果(應該吧)

### Changed

- 使用Nuxt3重構前端
- 前後端合一，API分離之版本依舊保留

## [Version 1.1.0] - 2024-08-05

### Features (Version 1.1.0)

- 前端功能
      - 增加下載功能
      - 增加複製功能
      - 搜尋欄增加清除字串按鍵
- 前端優化
      - 增加LazyLoad
- 資料
      - 修正圖源清晰度

### Removed

- 移除部分非動畫本家貼圖

### Known Issues

- 使用ios複製功能會有問題

## [Version 1.0.0] - 2024-05-01

### Features (Version 1.0.0)

- 基本功能
      - 搜尋貼圖
      - 顯示貼圖
