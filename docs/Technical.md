# 技術實現細節

## 搜尋引擎實現

### Levenshtein 距離算法

MyGO Searcher 使用 Levenshtein 距離算法來實現模糊搜尋功能。

**核心函數** (`server/algo/levenshtein.ts`):

- `leven_distance(str1: string, str2: string): number` - 計算兩字串間的編輯距離
- `calculateSimilarity(str1: string, str2: string): number` - 計算相似度 (0-1)

### 中文處理

**繁簡體轉換**:

- 使用 OpenCC 進行自動繁簡體轉換
- 支援台灣正體和簡體中文互轉

**模糊替換**:

- `generateFuzzyVariants(keyword: string): Set<string>` - 生成模糊匹配變體
- 支援常見錯字和同音字替換

## 資料層架構

### Repository 模式實現

**Repository 基礎介面** (`server/types/repository.ts`):

- `findAll(): Promise<T[]>` - 獲取所有資料
- `findById(id: string): Promise<T | null>` - 根據ID查找
- `findByQuery(query: object): Promise<T[]>` - 條件查詢
- `save(entity: T): Promise<T>` - 儲存實體
- `update(id: string, updates: Partial<T>): Promise<T | null>` - 更新實體
- `delete(id: string): Promise<boolean>` - 刪除實體

**實現類型**:

- 本地 JSON 檔案存取實現
- MongoDB 資料庫實現

### 快取策略

- 多層快取系統：記憶體快取 + 查詢結果快取
- 自動快取失效機制

## 服務層設計

### ImageService 類別

**主要屬性**:

- `repository: Repository<ImageItem>` - 資料存取層
- `cache: CacheManager` - 快取管理器

**核心方法**:

- `getPaginatedImages(params): Promise<PaginatedResponse<ImageItem>>` - 分頁獲取圖片
- `sortImages(images, order): ImageItem[]` - 圖片排序
- 支援排序類型：id、popularity、random、episode、alphabetical

### SearchService 類別

**主要屬性**:

- `repository: Repository<ImageItem>` - 資料存取
- `customKeyMap: Record<string, string[]>` - 自定義關鍵字映射

**核心方法**:

- `search(params): Promise<SearchResponse>` - 執行搜尋
- `fuzzySearch(images, query): SearchResult[]` - 模糊搜尋
- `exactSearch(images, query): SearchResult[]` - 精確搜尋
- 相似度閾值：0.3

## 資料庫設計

### MongoDB 集合結構

#### 圖片集合 (images)

**主要欄位**:

- `id: string` - 唯一標識符 (例：mygo_01_001)
- `filename: string` - 檔案名稱
- `alt: string` - 圖片描述文字
- `author: string` - 作者名稱
- `episode: string` - 集數標識
- `tags: string[]` - 標籤陣列
- `popularity: number` - 人氣值
- `createdAt/updatedAt: Date` - 時間戳

#### 統計集合 (statistics)

**主要欄位**:

- `imageId: string` - 關聯圖片ID
- `action: string` - 動作類型 (copy, view, etc.)
- `timestamp: Date` - 操作時間
- `userAgent: string` - 用戶代理
- `ip: string` - IP位址（匿名化）

### 索引策略

**圖片集合索引**:

- `{ "id": 1 }` - 主鍵索引
- `{ "popularity": -1 }` - 人氣排序索引
- `{ "episode": 1 }` - 集數篩選索引
- `{ "alt": "text" }` - 全文搜尋索引
- `{ "tags": 1 }` - 標籤篩選索引

**統計集合索引**:

- `{ "imageId": 1 }` - 圖片關聯索引
- `{ "timestamp": -1 }` - 時間排序索引
- `{ "imageId": 1, "timestamp": -1 }` - 複合索引

## 前端架構

### Composables 設計

#### useImages Composable

**返回屬性**:

- `images: Ref<ImageItem[]>` - 圖片列表 (只讀)
- `loading: Ref<boolean>` - 載入狀態 (只讀)
- `error: Ref<string | null>` - 錯誤信息 (只讀)

**核心方法**:

- `fetchImages(params): Promise<Response>` - 獲取圖片列表
- `searchImages(query, fuzzy): Promise<Response>` - 搜尋圖片

#### useInfiniteScroll Composable

**返回屬性**:

- `items: Ref<T[]>` - 項目列表 (只讀)
- `loading: Ref<boolean>` - 載入狀態 (只讀)
- `hasMore: Ref<boolean>` - 是否有更多資料 (只讀)

**核心方法**:

- `loadMore(): Promise<void>` - 載入更多資料
- `reset(): void` - 重置狀態

### 狀態管理

#### imageStore (Pinia)

**狀態屬性**:

- `images: ImageItem[]` - 圖片資料
- `filters: FilterOptions` - 篩選條件
- `searchQuery: string` - 搜尋關鍵字

**計算屬性**:

- `filteredImages: ComputedRef<ImageItem[]>` - 篩選後的圖片列表

**動作方法**:

- `setImages(newImages)` - 設定圖片資料
- `setFilters(newFilters)` - 設定篩選條件
- `setSearchQuery(query)` - 設定搜尋關鍵字

## 效能優化策略

### 前端優化

**圖片懶載入** (`components/LazyImage.vue`):

- 使用 `IntersectionObserver` API
- 支援載入/錯誤狀態處理
- 平滑淡入動畫效果

**虛擬滾動** (`composables/useVirtualScroll.ts`):

- 計算可見範圍和項目位置
- 減少 DOM 節點數量
- 提升大列表渲染效能

### 後端優化

#### 查詢優化

**OptimizedSearchService 類別**:

- 搜尋結果快取機制
- 並行執行精確和模糊搜尋
- 結果合併和去重處理

#### 資料庫連接池

**DatabaseManager 類別** (單例模式):

**連接池配置**:

- `maxPoolSize: 10` - 最大連接數
- `minPoolSize: 2` - 最小連接數  
- `serverSelectionTimeoutMS: 5000` - 服務器選擇超時
- `socketTimeoutMS: 45000` - Socket 超時
- `maxIdleTimeMS: 30000` - 最大空閒時間

## 監控和日誌

### 效能監控

**PerformanceMiddleware**:

- 請求處理時間記錄
- 慢查詢警告 (>1000ms)
- 記憶體使用量監控

### 錯誤處理

**ErrorHandler 類別**:

**錯誤信息記錄**:

- 錯誤訊息和堆疊追蹤
- 操作上下文和時間戳
- Node.js 版本和記憶體使用情況

**生產環境整合**:

- 支援第三方錯誤追蹤服務 (如 Sentry)
- 統一錯誤格式和狀態碼回應
