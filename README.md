# MyGo貼圖搜尋器

你願意一輩子跟我一起MyGO嗎？

[已部署網頁連結](https://mygo.miyago9267.com)

[舊版Vite分支](https://github.com/miyago9267/MyGO-Searcher/tree/vite)

## 使用技術

- 前端框架 - `Vue3` with `Nuxt3`
- 後端框架 - `NuxtAPI` with `Nuxt3`
  - 獨立後端[API](https://github.com/miyago9267/mygoapi)服務 - `FastAPI`

## 部署指南

1. clone下本專案
2. 安裝dependencies

```bash
cd MyGo_Searcher
npm install # or yarn install
```
3. 設定環境變數(非必要)
```
echo "API_BASE_URL=<API_BASE_URL>" >> .env.development
```
4. 啟動及部署Nuxt

```bash
yarn dev # with devmode
yarn build # for production
```

## 使用API

### 內建API

本分支使用Nuxt框架自帶Server系統內建之API路由

#### 取得所有貼圖

```http
GET /api/mygo/all_img
```

#### 查詢關鍵字列表

```http
GET /api/mygo/img?keyword={keyword: string}<&fuzzy={fuzzy: boolean}>
```

#### 取得隨機貼圖

```http
GET /api/mygo/random_img
```

### 獨立API

關於獨立拆分之API，請參考
[API專案](https://github.com/miyago9267/mygoapi)

## 未來計劃(TodoList)

- [ ] 前端優化
  - [ ] 增加亮暗色
  - [ ] 增加排序
- [ ] 優化後端
  - [X] 改善api並開放
  - [ ] 增加標籤(趕工中)
    - [ ] 以集數作為tag
    - [ ] 以人物為tag
  - [ ] 增加敘述(趕工中)

## 更新紀錄

請詳見[CHANGELOG](./CHANGELOG.md)及[RELEASE](https://github.com/miyago9267/MyGo_Searcher/releases)

## License

[MIT](./LICENSE)

本專案以MIT規範開源，歡迎大家自由使用、修改及分支開發，但請務必保留原作者署名。
