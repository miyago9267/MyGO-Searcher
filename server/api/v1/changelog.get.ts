import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async () => {
  try {
    const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md')
    if (!fs.existsSync(changelogPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'CHANGELOG.md not found',
      })
    }

    const content = fs.readFileSync(changelogPath, 'utf-8')
    const lines = content.split('\n')

    // 解析最新版本
    // 格式範例: ## [Version 2.0.0] - 2025-XX-XX
    const versionRegex = /^## \[Version (\d+\.\d+\.\d+)\]/

    let currentVersion = ''
    let isParsingLatest = false
    let currentSection = ''

    const result: {
      version: string
      sections: Record<string, string[]>
    } = {
      version: '',
      sections: {},
    }

    // 狀態機變數
    let foundFirstVersion = false

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      const versionMatch = line.match(versionRegex)

      // 遇到版本標題
      if (versionMatch) {
        // 如果已經在解析最新版本，遇到下一個版本標題就停止 (只抓最新的一個版本)
        if (foundFirstVersion) {
          break
        }

        // 找到最新版本，開始解析
        currentVersion = versionMatch[1] || ''
        result.version = currentVersion
        foundFirstVersion = true
        isParsingLatest = true
        continue
      }

      // 如果還沒開始解析最新版本，跳過
      if (!isParsingLatest) continue

      // 解析區塊標題 (例如 ### Features 或 ### Features (Version 2.0.0))
      const sectionMatch = line.match(/^###\s+([a-zA-Z\s]+)/)
      if (sectionMatch) {
        // 提取區塊名稱，移除可能的版本號後綴
        let sectionName = sectionMatch[1].trim()
        // 移除括號內容，例如 "Features (Version 2.0.0)" -> "Features"
        sectionName = sectionName.replace(/\s*\(.*\)/, '').trim()

        currentSection = sectionName
        result.sections[currentSection] = []
        continue
      }

      // 解析列表項目
      // 支援 "- item" 或 "  - subitem"
      const listItemMatch = line.match(/^(\s*)-\s+(.+)/)
      if (listItemMatch && currentSection) {
        // const indent = listItemMatch[1] // Unused variable removed
        const text = listItemMatch[2].trim()

        // 如果有縮排，視為子項目，這裡我們簡單地保留縮排視覺效果或直接顯示
        // 為了簡單起見，我們直接儲存文字，但如果是子項目，可以在前端處理或這裡加前綴
        // 這裡我們只儲存內容

        if (!result.sections[currentSection]) {
          result.sections[currentSection] = []
        }
        result.sections[currentSection]!.push(text)
      }
    }

    if (!result.version) {
      console.warn('No version found in CHANGELOG.md')
    }

    return result
  }
  catch (error) {
    console.error('Error parsing changelog:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to parse changelog',
    })
  }
})
