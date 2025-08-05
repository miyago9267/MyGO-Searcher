# MyGo貼圖搜尋器

你願意一輩子跟我一起MyGO嗎？

MyGO 搜尋器，滿足你上網戰鬥的各種圖戰需求！

[網頁連結](https://mygo.miyago9267.com)

## 疊甲

本人為17年入坑之老邦人，對於BGD企劃一直都十分支持，手遊上位多AP，動畫企劃、真人樂隊也都有持續關注，歌單更是不斷重複收聽，對老邦和新團的愛是一樣的。

本專案雖推廣雞狗，但也呼籲大家多多支持舊7團，讓邦邦企劃有辦法繼續走下去，武士道已經夠糟蹋自家企劃了，敬請大家玩梗需謹慎，別讓雞狗破壞掉邦邦的名聲。

## 使用技術

- 前端框架 - `Vue3` with `Nuxt3`
- 後端框架 - `NuxtAPI` with `Nuxt3`
  - [API文檔](./docs/API.md)
  - 獨立後端[API](https://github.com/miyago9267/mygoapi)服務 - `FastAPI` (已棄用)

## 部署指南

1. 確保你有`node.js`及`yarn`環境
2. clone本專案Repo
3. 安裝dependencies

  ```bash
  cd MyGo_Searcher
  yarn install
  ```

4. 複製環境變數範本並配置

  ```bash
  cp .env.example .env.development
  ```

5. 啟動及部署Nuxt

```bash
yarn dev # with devmode
yarn build # for production
yarn build:docker # for docker
```

## 說明文檔

- [API 文檔](./docs/API.md)
- [技術實現](./docs/Technical.md)
- [架構設計](./docs/Architecture.md)
- [貢獻指南（包含意見回饋）](./docs/Contributing.md)

~~偷偷說，除了這個根目錄Readme以外其他都是Claude幫我寫的~~

## 未來計劃(TodoList)

- [ ] 前端優化
  - [ ] 增加亮暗色
  - [X] 增加排序
- [X] 優化後端
  - [X] 改善api並開放
  - [ ] 增加標籤(趕工中)
    - [X] 以集數作為tag
    - [ ] 以人物為tag(WIP)
  - [ ] 增加敘述(趕工中)

## 更新紀錄

請詳見[CHANGELOG](./CHANGELOG.md)及[RELEASE](https://github.com/miyago9267/MyGo_Searcher/releases)

## License

[MIT](./LICENSE)

本專案以MIT規範開源，歡迎大家自由使用、修改及分支開發，但請務必保留原作者署名。
