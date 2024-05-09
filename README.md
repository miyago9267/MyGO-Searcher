# MyGo貼圖搜尋器

你願意一輩子跟我一起MyGo嗎？
[已部署網頁連結](https://mygo.miyago9267.com)

## 使用技術

- 前端框架 - `Vite` + `Vue`
- [API](https://github.com/miyago9267/mygoapi) - `FastAPI`(暫不開放)

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
    - [ ] 研究一下vue怎麼玩然後改掉我的爛扣哇操
- [ ] 優化後端
    - [ ] serverless化
    - [ ] 改善api並開放