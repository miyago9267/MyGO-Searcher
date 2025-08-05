# 開發者貢獻指南

MyGO Searcher 是一個開源項目，我們歡迎任何形式的貢獻，包括但不限於：

- Bug 修復
- 功能開發
- 文檔改進
- UI/UX 改進
- 效能優化
- 各類Issue及意見

## 注意事項

### 如何提出Issue

在提交 Issue 前，請先檢查以下事項：

- 是否已經有相同的 Issue 存在
- 是否已經有相關的討論或 PR
- 提供足夠的細節，包括重現步驟、預期行為和實際行為
- 如果是 Bug，請提供相關的日誌或錯誤訊息
- 如果是功能請求，請描述清楚你的需求和使用場景
- 如果是資料（圖源）相關的增刪改建議，請提供集數、時間戳和相關的圖片連結

### 提交規範

我使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```bash
# 格式：type(scope): description

# 類型：
feat:     新功能
fix:      Bug 修復
docs:     文檔更新
style:    代碼格式（不影響功能）
refactor: 重構
test:     測試
chore:    構建過程或輔助工具的變動
```

#### PR 模板

提交 PR 時請包含以下資訊：

```markdown
## 變更描述
<!-- 簡要描述你的變更 -->

## 變更類型
- [ ] Bug 修復
- [ ] 新功能
- [ ] 文檔更新
- [ ] 重構
- [ ] 效能改進
- [ ] 其他

## 測試
- [ ] 我已經運行了現有的測試
- [ ] 我已經為新功能添加了測試
- [ ] 所有測試都通過了

## 截圖（如適用）
<!-- 如果有 UI 變更，請提供截圖 -->

## 相關 Issue
<!-- 如果解決了某個 issue，請引用它 -->
Closes #123
```

## 社群資源

### 獲取幫助

- **GitHub Issues**: 報告 Bug 或請求功能
- **GitHub Discussions**: 技術討論和問題求助

### 參與社群

- 參與 Issue 討論
- 回答其他開發者的問題
- 分享你的使用經驗
- 提供功能建議

## 發布流程

### 版本號規則

我們遵循 [Semantic Versioning](https://semver.org/)：

- `MAJOR.MINOR.PATCH`
- `2.1.0` → `2.1.1` (patch: bug fixes)
- `2.1.0` → `2.2.0` (minor: new features)
- `2.1.0` → `3.0.0` (major: breaking changes)

### 發布檢查清單

- [ ] 所有測試通過
- [ ] 文檔已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本號已更新
- [ ] 建立 Release Notes
