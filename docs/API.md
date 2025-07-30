# MyGO Searcher RESTful API Documentation

## API 版本
- **版本**: v1
- **基礎URL**: `/api/v1`

## 通用回應格式

### 成功回應
```json
{
  "data": [...],
  "meta": {
    // 元資料 (分頁資訊等)
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

## API 端點

### 1. 健康檢查
```
GET /api/v1/health
```

**回應：**
```json
{
  "status": "ok",
  "timestamp": "2025-07-30T12:00:00.000Z",
  "service": "MyGO Searcher API",
  "version": "1.0.0"
}
```

### 2. 獲取所有圖片
```
GET /api/v1/images
```

**查詢參數：**
- `page` (number, 可選): 頁碼，預設 1
- `limit` (number, 可選): 每頁數量，預設 20

**回應：**
```json
{
  "data": [
    {
      "id": "image001",
      "url": "https://example.com/image001.jpg",
      "alt": "圖片描述",
      "author": "作者",
      "episode": "集數",
      "filename": "image001.jpg"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. 搜尋圖片
```
GET /api/v1/images/search
```

**查詢參數：**
- `q` (string, 必填): 搜尋關鍵字
- `fuzzy` (boolean, 可選): 是否啟用模糊搜尋，預設 false
- `page` (number, 可選): 頁碼，預設 1
- `limit` (number, 可選): 每頁數量，預設 20

**回應：**
```json
{
  "data": [
    {
      "id": "image001",
      "url": "https://example.com/image001.jpg",
      "alt": "圖片描述",
      "author": "作者",
      "episode": "集數"
    }
  ],
  "meta": {
    "query": "搜尋關鍵字",
    "fuzzy": false,
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 4. 獲取隨機圖片
```
GET /api/v1/images/random
```

**查詢參數：**
- `count` (number, 可選): 圖片數量，預設 1，最大 100

**回應：**
```json
{
  "data": [
    {
      "id": "image001",
      "url": "https://example.com/image001.jpg",
      "alt": "圖片描述",
      "author": "作者",
      "episode": "集數"
    }
  ],
  "meta": {
    "count": 1,
    "requested": 1
  }
}
```

### 5. 獲取特定圖片詳情
```
GET /api/v1/images/{id}
```

**路徑參數：**
- `id` (string): 圖片ID

**回應：**
```json
{
  "data": {
    "id": "image001",
    "url": "https://example.com/image001.jpg",
    "alt": "圖片描述",
    "author": "作者",
    "episode": "集數",
    "filename": "image001.jpg"
  }
}
```

## 錯誤代碼

- `400` - 請求參數錯誤
- `404` - 資源不存在
- `500` - 服務器內部錯誤

## 遷移指南

### 舊API → 新API對照

| 舊API | 新API | 說明 |
|-------|-------|------|
| `/api/mygo/img` | `/api/v1/images/search` | 搜尋功能，參數從 `keyword` 改為 `q` |
| `/api/mygo/all_img` | `/api/v1/images` | 獲取所有圖片，新增分頁支援 |
| `/api/mygo/random_img` | `/api/v1/images/random` | 隨機圖片，參數從 `amount` 改為 `count` |
| `/api/ping` | `/api/v1/health` | 健康檢查，回應格式更豐富 |

### 主要改進

1. **語義化URL**: 使用資源導向的URL設計
2. **統一回應格式**: 所有API使用一致的data/meta結構
3. **更好的錯誤處理**: 使用HTTP狀態碼和結構化錯誤訊息
4. **分頁支援**: 所有列表API都支援分頁
5. **參數標準化**: 使用標準化的參數名稱
6. **版本控制**: URL中包含版本號，便於未來升級
