// @ts-expect-error import raw
import changelogContent from '~/CHANGELOG.md?raw'

export default defineEventHandler(async () => {
  try {
    const content = changelogContent
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

    let foundFirstVersion = false

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      const versionMatch = line.match(versionRegex)

      if (versionMatch) {
        if (foundFirstVersion) {
          break
        }

        currentVersion = versionMatch[1] || ''
        result.version = currentVersion
        foundFirstVersion = true
        isParsingLatest = true
        continue
      }

      if (!isParsingLatest) continue

      const sectionMatch = line.match(/^###\s+([a-zA-Z\s]+)/)
      if (sectionMatch) {
        let sectionName = sectionMatch[1].trim()
        sectionName = sectionName.replace(/\s*\(.*\)/, '').trim()

        currentSection = sectionName
        result.sections[currentSection] = []
        continue
      }

      const listItemMatch = line.match(/^(\s*)-\s+(.+)/)
      if (listItemMatch && currentSection) {
        const text = listItemMatch[2].trim()

        const sectionList = result.sections[currentSection]
        if (sectionList) {
          sectionList.push(text)
        }
        else {
          result.sections[currentSection] = [text]
        }
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
