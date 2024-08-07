# MyGo貼圖搜尋器

你願意一輩子跟我一起MyGO嗎？
[已部署網頁連結](https://mygo.miyago9267.com)

## 使用技術

- 前端框架 - `Vite` + `Vue`
- 後端[API](https://github.com/miyago9267/mygoapi)服務 - `FastAPI`

## 部署指南

1. clone下本專案
2. 安裝前端dependencies

```bash
cd MyGo_Searcher
npm install # or yarn install
```

3. 修改前端
4. 部署前端

```bash
npx vite --port=PORT
npx vite build
```

## 使用API

使用自架API，請參考
[API專案](https://github.com/miyago9267/mygoapi)

## 未來計劃(TodoList)

- [ ] 前端優化
      - [ ] 增加亮暗色
      - [ ] 增加排序
- [ ] 優化後端
      - [X] 改善api並開放
      - [ ] 增加標籤
        - [ ] 以集數作為tag
        - [ ] 以人物為tag
      - [ ] 增加敘述

## 更新紀錄

請詳見[CHANGELOG](./CHANGELOG.md)及[RELEASE](https://github.com/miyago9267/MyGo_Searcher/releases)