# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-XX-XX

### Features (Version 2.0.0)

- 重構API路由，統一使用RESTful格式，舊版API暫時保留作為過渡，未來則不再更新及支援
      - `GET /api/v1/images/{id}` 獲取特定id圖片
      - `GET /api/v1/images` 獲取所有圖片
      - `GET /api/v1/search` 搜尋圖片
      - `GET /api/v1/random` 隨機獲取圖片
      > 詳見 [API Documentation](docs/API.md)
- 更新圖片資料結構，使用新的資料接口格式
- 加入Filter Options功能，可選擇MyGO集數、AveMujica集數和人物
- 正式加入AveMujica圖包

### Changed (Version 2.0.0)

- 調整Filter Options的資料結構，統一使用`FilterOptions`類型
- 更新前端載入邏輯，從全部圖片載入改為動態滾動載入

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
