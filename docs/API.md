# MyGO Searcher RESTful API Documentation

## API 版本

- **Version**: v1
- **Base URL**: `/api/v1`
- **Response 格式**: JSON
- **Encode**: UTF-8

## 通用回應格式

### 成功回應

```json
{
  "data": [...],
  "meta": {
    // 你媽
  }
}
```

### 錯誤回應

```json
{
  "statusCode": 400,
  "statusMessage": "Error message"
}
```

## API Route

### 1. 存活狀態 (舊版Ping)

功能同舊版的`/api/ping`

```http
GET /api/v1/health
```

檢查 API 服務狀態和版本資訊。

**回應：**

```json
{
  "status": "ok",
  "timestamp": "2025-08-05T12:00:00.000Z",
  "service": "MyGO Searcher API",
  "version": "1.0.0"
}
```

### 2. 獲取圖片列表

```http
GET /api/v1/images
```

獲取圖片列表，支援分頁和多種排序方式，針對無限滾動優化。

**查詢參數：**

- `page` (number, 可選): 頁碼，預設 1，從 1 開始
- `limit` (number, 可選): 每頁數量，預設 20，範圍 1-100
- `order` (string, 可選): 排序方式，預設 `id`
  - `id`: 按 ID 數字順序排序
  - `random`: 隨機排序
  - `episode`: 按集數排序 (MyGO 集數優先於 AveMujica 集數)
  - `alphabetical`: 按字典序排序 (依據 alt 屬性)
  - `popularity`: 按人氣排序 (最熱門的在前面)

**回應：**

```json
{
  "data": [
    {
      "id": "114514",
      "url": "https://example.com/images/mygo/01/為什麼要演奏春日影_001.jpg",
      "alt": "為什麼要演奏春日影",
      "author": "長崎素食",
      "episode": "長崎素食導致的",
      "filename": "為什麼要演奏春日影_001.jpg",
      "popularity": 42
    }
  ],
  "meta": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. 搜尋圖片

```http
GET /api/v1/images/search
```

根據關鍵字搜尋圖片，支援模糊搜尋和中文繁簡體轉換。

**查詢參數：**

- `q` (string, 必填): 搜尋關鍵字
- `fuzzy` (boolean, 可選): 是否啟用模糊搜尋，預設 `false`
- `page` (number, 可選): 頁碼，預設 1
- `limit` (number, 可選): 每頁數量，預設 20，範圍 1-100
- `order` (string, 可選): 排序方式，預設 `id`

**搜尋特性：**

- 支援繁體中文和簡體中文搜尋
- 模糊搜尋支援常見字詞替換 (如：你/姊、他/她、欸/耶)
- 使用編輯距離進行相似度匹配
- 支援自定義關鍵字映射

**回應：**

```json
{
  "data": [
    {
      "id": "114514",
      "url": "https://example.com/images/mygo/01/為什麼要演奏春日影_001.jpg",
      "alt": "為什麼要演奏春日影",
      "author": "長崎素食",
      "episode": "長崎素食導致的",
      "similarity": 0.95
    }
  ],
  "meta": {
    "query": "搜尋關鍵字",
    "fuzzy": false,
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 4. 獲取隨機圖片

```http
GET /api/v1/images/random
```

獲取指定數量的隨機圖片。

**查詢參數：**

- `count` (number, 可選): 圖片數量，預設 1，最大 100

**回應：**

```json
{
  "data": [
    {
      "id": "114514",
      "url": "https://example.com/images/mygo/01/為什麼要演奏春日影_001.jpg",
      "alt": "為什麼要演奏春日影",
      "author": "長崎素食",
      "episode": "長崎素食導致的"
    }
  ],
  "meta": {
    "count": 1,
    "requested": 1
  }
}
```

### 5. 獲取特定圖片

```http
GET /api/v1/images/{id}
```

獲取指定 ID 圖片的詳細資訊。
現在沒啥用，因為圖片的ID完全是我整理的順序，沒有什麼參考性，只能在有表的狀況下使用。

**路徑參數：**

- `id` (string): 圖片ID，例如 `mygo_01_001`

**回應：**

```json
{
  "data": {
      "id": "114514",
      "url": "https://example.com/images/mygo/01/為什麼要演奏春日影_001.jpg",
      "alt": "為什麼要演奏春日影",
      "author": "長崎素食",
      "episode": "長崎素食導致的",
      "filename": "為什麼要演奏春日影_001.jpg",
      "popularity": 42
  }
}
```

## 錯誤代碼

| 狀態碼 | 說明 | 常見原因 |
|--------|------|----------|
| `400` | 請求參數錯誤 | 缺少必要參數、參數格式錯誤 |
| `404` | 資源不存在 | 圖片ID不存在 |
| `500` | 服務器內部錯誤 | 資料庫連接失敗、文件讀取錯誤 |

## 舊版API兼容

### 遷移對照表

| 舊版API | 新版API | 主要變更 |
|---------|---------|----------|
| `GET /api/mygo/img?keyword={q}` | `GET /api/v1/images/search?q={q}` | 參數名稱從 `keyword` 改為 `q` |
| `GET /api/mygo/all_img` | `GET /api/v1/images` | 新增分頁支援 |
| `GET /api/mygo/random_img?amount={count}` | `GET /api/v1/images/random?count={count}` | 參數名稱從 `amount` 改為 `count` |
| `GET /api/ping` | `GET /api/v1/health` | 回應格式更豐富 |

### 新版本主要改進

1. **語義化URL設計**: 採用資源導向的RESTful設計
2. **統一回應格式**: 所有API使用一致的 `data`/`meta` 結構
3. **錯誤處理**: 使用HTTP status code和結構化錯誤訊息
4. **分頁支援**: 支援分頁機制，避免舊版的載入首頁就要一次大量傳輸資料問題
5. **參數標準化**: 更新參數命名標準
6. **版本控制**: 分離舊版和新版API路由，便於未來升級
7. **多種排序**: 支援ID、隨機、集數、字母等多種排序方式

### 舊版API狀態

**重要通知**: 舊版API (`/api/mygo/*`, `/api/ping`) 目前仍然可用，但已進入維護模式，預計再兩三個版本內會移除，且不會再新增功能。建議所有新專案使用新版API，現有專案請儘早規劃遷移。

## 使用範例

### JavaScript/TypeScript

```javascript
// 搜尋圖片
const searchImages = async (query) => {
  const response = await fetch(`/api/v1/images/search?q=${encodeURIComponent(query)}&fuzzy=true`);
  const result = await response.json();
  return result;
};

// 獲取分頁圖片
const getImages = async (page = 1, limit = 20, order = 'id') => {
  const response = await fetch(`/api/v1/images?page=${page}&limit=${limit}&order=${order}`);
  const result = await response.json();
  return result;
};

// 更新人氣統計
const updatePopularity = async (imageId, action) => {
  const response = await fetch('/api/v1/images/popularity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageId,
      action
    })
  });
  const result = await response.json();
  return result;
};
```

### cURL

```bash
# 健康檢查
curl -X GET "/api/v1/health"

# 搜尋圖片
curl -X GET "/api/v1/images/search?q=MyGO&fuzzy=true&page=1&limit=10"

# 獲取隨機圖片
curl -X GET "/api/v1/images/random?count=5"
```

## 技術實現

- **應用框架**: Nuxt3 + H3
- **Database**: MongoDB (可選，支援本地文件fallback)
- **搜尋引擎**: 自幹，用編輯距離進行模糊匹配，未來仍有拓展算法空間
- **圖片儲存**: 寫死靜態路徑，可透過修改映射（就第二點的DB）進行路徑的修改
- **快取策略**: 開機快取 + 文件快取

## 效能考量

- 所有API都有適當的快取機制
- 分頁查詢優化，避免大量資料傳輸
- 搜尋結果按相關性排序
- 支援HTTP Keep-Alive連接複用
