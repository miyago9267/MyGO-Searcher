# 技術實現細節

## Runtime 與框架

- Nuxt 4、Vue 3、TypeScript
- Nitro/H3 server routes
- Bun 負責安裝、開發、測試與 build
- Production image 使用 Node.js 22 執行 Nitro output
- UnoCSS、Nuxt UI 與 Element Plus 提供前端樣式及元件

## 圖片資料流程

圖片 metadata 由 MongoDB 或 `public/data/image_map.json` 提供，主要欄位如下：

- `id`: 圖片識別碼，可為 string 或 number
- `key`: R2 UUID Object Key
- `filename`: 原始檔名
- `alt`、`description`: 台詞與描述
- `author`、`tags`: 人物及標籤
- `episode`: 作品與集數分類
- `popularity`: 人氣值

`server/utils/dataProcessing.ts` 將 `key` 正規化為 `storagePath`。
若舊資料沒有 `key`，才會由 `episode` 與 `filename` 建立 legacy path。

`server/utils/imageUrlResolver.ts` 負責圖片 URL：

1. 已是完整 HTTP URL 時直接保留。
2. 其餘路徑與 `NUXT_IMG_BASE_URL` 組合。
3. URL 定址不參與作品或集數分類判斷。

## Repository 與 Service

### Repository

- `MongoRepository`: 讀取 MongoDB 圖片資料及更新人氣。
- `FileRepository`: 讀取本地 JSON，並作為 MongoDB 不可用時的 fallback。

### ImageService

`server/services/imageService.ts` 提供分頁圖片列表：

- 優先讀取 MongoDB，失敗時改讀本地 JSON。
- 支援 `id`、`random`、`episode`、`alphabetical`、`popularity` 排序。
- 在 service layer 組合完整圖片 URL。

### SearchService

`server/services/searchService.ts` 將資料來源、搜尋演算法與圖片 URL 解析分離。
API route 預設使用 `FileRepository` 的 metadata 搜尋，因此搜尋邏輯不依賴
MongoDB 或特定圖床目錄結構。

### PopularityService

`server/services/popularityService.ts` 接收 copy 或 download 行為，嘗試更新 MongoDB 與本地 JSON。統計寫入失敗不會阻斷前端的複製或下載操作。

## 搜尋實作

### 關鍵字搜尋

`server/utils/search/searchEngine.ts` 會搜尋以下 metadata：

- `alt`
- `description`
- `author`
- `tags`
- `episode`

搜尋流程支援：

- OpenCC 繁簡轉換
- Levenshtein 編輯距離模糊搜尋
- `custom_keymap.json` 自定義關鍵字映射
- 結果計分、去重與排序
- 台詞命中位置的 `matches` 資訊

### 語義搜尋

`server/services/semanticSearchService.ts` 使用 Transformers.js 與 EmbeddingGemma
建立 embedding index。此功能由 `semantic=true` 啟用，模型或推論失敗時會退回
關鍵字搜尋。

語義索引儲存在 `node_modules/.cache/semantic-search-index.json`，並使用 metadata hash 判斷是否可重用。

## 前端資料流

`app/composables/useImages.ts` 管理圖片列表、搜尋、分頁與載入狀態，透過 `app/apis/` 呼叫 `/api/v1`。

篩選與排序的責任分工：

- API 提供分頁、搜尋與排序。
- `app/utils/filterImages.ts` 處理已載入結果的作品集數與人物篩選。
- 圖片 URL 直接使用 API 回傳的完整 URL，不在前端推導圖床路徑。

## Runtime Config

主要設定如下：

- MongoDB connection URL 與 collection
- 圖片 CDN base URL
- 前端 API base URL，預設 `/api/v1`

MongoDB 未設定或讀取失敗時，圖片列表會使用本地 JSON。圖片 CDN 與 metadata 分離，因此可替換圖源而不修改搜尋資料模型。

## 測試範圍

目前測試涵蓋：

- 圖片 metadata 與 storage path 處理
- 圖片 URL 解析
- 關鍵字搜尋與 SearchService
- 篩選與排序
- 語義搜尋 service 的基本行為
- Nuxt smoke test
