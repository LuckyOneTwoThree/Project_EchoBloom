import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Insight, Association, AssociationType, LuminosityLevel, DailyBlindBox } from '@/types'

const mockInsights: Insight[] = [
  {
    id: '1',
    content: '用户体验的核心是减少认知负荷，让用户在无意识中完成操作',
    rawContent: '我觉得啊，用户体验这个东西，最重要的就是别让用户费脑子，就是那种，你不用想太多就能完成操作，对吧？就是减少认知负荷嘛',
    summary: '用户体验核心是减少认知负荷',
    tags: ['产品设计', '用户体验'],
    luminosity: 85,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    wakeCount: 15,
    interactionCount: 8,
    associations: [
      { insightId: '2', type: 'semantic', strength: 0.8 },
      { insightId: '5', type: 'logical', strength: 0.7 }
    ],
    versions: []
  },
  {
    id: '2',
    content: '极简主义不是减少功能，而是减少干扰，让核心价值更突出',
    rawContent: '极简主义设计啊，不是说功能越少越好，而是要把那些没用的干扰去掉，让真正重要的东西能被用户一眼看到',
    summary: '极简主义是减少干扰而非减少功能',
    tags: ['设计', '极简主义'],
    luminosity: 72,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    wakeCount: 12,
    interactionCount: 6,
    associations: [
      { insightId: '1', type: 'semantic', strength: 0.8 },
      { insightId: '3', type: 'complementary', strength: 0.6 }
    ],
    versions: []
  },
  {
    id: '3',
    content: '好的产品应该像氧气一样，存在但不被感知',
    rawContent: '我一直在想，最好的产品是什么样的？应该是那种，用户用着很舒服，但根本感觉不到它的存在，就像呼吸一样自然',
    summary: '好产品应像氧气般自然存在',
    tags: ['产品哲学', '用户体验'],
    luminosity: 90,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    wakeCount: 20,
    interactionCount: 12,
    associations: [
      { insightId: '2', type: 'complementary', strength: 0.6 },
      { insightId: '4', type: 'logical', strength: 0.75 }
    ],
    versions: []
  },
  {
    id: '4',
    content: '用户不会记住完美的产品，但会记住糟糕的体验',
    rawContent: '你说用户会记住什么？他们不会记得哪个APP有多完美，但要是有一次特别差的体验，他们肯定能记好久',
    summary: '糟糕体验比完美产品更易被记住',
    tags: ['用户心理学', '产品设计'],
    luminosity: 65,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    wakeCount: 8,
    interactionCount: 4,
    associations: [
      { insightId: '3', type: 'logical', strength: 0.75 },
      { insightId: '6', type: 'semantic', strength: 0.5 }
    ],
    versions: []
  },
  {
    id: '5',
    content: '设计的目的不是追求美感，而是解决问题',
    rawContent: '很多设计师容易陷入误区，觉得设计就是要好看，但其实设计的本质是解决用户的问题，好看只是附加价值',
    summary: '设计本质是解决问题而非追求美感',
    tags: ['设计', '产品思维'],
    luminosity: 78,
    createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    wakeCount: 14,
    interactionCount: 7,
    associations: [
      { insightId: '1', type: 'logical', strength: 0.7 },
      { insightId: '7', type: 'complementary', strength: 0.65 }
    ],
    versions: []
  },
  {
    id: '6',
    content: '用户的耐心比你想象的更短，必须在3秒内抓住注意力',
    rawContent: '现在用户的注意力太分散了，你必须在很短的时间内抓住他们的眼球，我觉得大概3秒吧，不然他们就划走了',
    summary: '用户注意力窗口仅约3秒',
    tags: ['用户行为', '增长策略'],
    luminosity: 55,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    wakeCount: 6,
    interactionCount: 3,
    associations: [
      { insightId: '4', type: 'semantic', strength: 0.5 }
    ],
    versions: []
  },
  {
    id: '7',
    content: '优秀的产品经理懂得在正确的时机说不',
    rawContent: '做产品最考验人的不是说yes，而是懂得什么时候说no，很多功能看起来很好，但其实会分散核心价值',
    summary: '产品经理需懂得适时拒绝',
    tags: ['产品管理', '决策'],
    luminosity: 82,
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    wakeCount: 16,
    interactionCount: 9,
    associations: [
      { insightId: '5', type: 'complementary', strength: 0.65 },
      { insightId: '8', type: 'logical', strength: 0.7 }
    ],
    versions: []
  },
  {
    id: '8',
    content: '数据是产品决策的指南针，但不是唯一依据',
    rawContent: '做产品决策肯定要看数据，但也不能完全依赖数据，有时候直觉和经验也很重要，要平衡',
    summary: '数据是指南针但非唯一决策依据',
    tags: ['数据分析', '产品决策'],
    luminosity: 68,
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastWokenAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    wakeCount: 10,
    interactionCount: 5,
    associations: [
      { insightId: '7', type: 'logical', strength: 0.7 }
    ],
    versions: []
  }
]

async function callCloudFunction(name: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] 跳过云函数 ${name} 调用，使用本地数据`)
    return { code: -1, message: '开发环境跳过云函数', data: null }
  }
  
  try {
    const result = await uniCloud.callFunction({
      name,
      data
    })
    return result.result
  } catch (error) {
    console.error(`云函数 ${name} 调用失败:`, error)
    return { code: -1, message: '云函数调用失败', data: null }
  }
}

export const useInsightStore = defineStore('insight', () => {
  const insights = ref<Insight[]>(mockInsights)
  const points = ref(1250)
  const isCloudEnabled = ref(false)

  const sortedInsights = computed(() => {
    return [...insights.value].sort((a, b) => b.luminosity - a.luminosity)
  })

  const goldInsights = computed(() => {
    return insights.value.filter(i => i.luminosity >= 80)
  })

  const todayInsights = computed(() => {
    const today = new Date().setHours(0, 0, 0, 0)
    return insights.value.filter(i => i.createdAt >= today)
  })

  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function getLuminosityLevel(luminosity: number): LuminosityLevel {
    if (luminosity >= 80) return 'high'
    if (luminosity >= 50) return 'medium'
    return 'low'
  }

  function getAssociationLabel(type: AssociationType): string {
    const labels: Record<AssociationType, string> = {
      semantic: '语义相似',
      logical: '逻辑同源',
      complementary: '互补拼接',
      conflict: '反向冲突'
    }
    return labels[type]
  }

  function addInsight(content: string, rawContent?: string): Insight {
    const tags = generateTags(content)
    const summary = generateSummary(content)
    
    const newInsight: Insight = {
      id: generateId(),
      content,
      rawContent,
      summary,
      tags,
      luminosity: 20,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wakeCount: 0,
      interactionCount: 0,
      associations: [],
      versions: []
    }

    insights.value.push(newInsight)
    updateAssociations(newInsight)
    points.value += 10

    return newInsight
  }

  function generateTags(content: string): string[] {
    const tagKeywords: Record<string, string[]> = {
      '用户体验': ['用户体验', 'UX', '用户', '体验'],
      '产品设计': ['产品设计', '设计', '产品'],
      '极简主义': ['极简', '极简主义', '简洁'],
      '设计': ['设计', '设计师'],
      '产品哲学': ['产品哲学', '哲学'],
      '用户心理学': ['用户心理', '心理学', '心理'],
      '产品思维': ['产品思维', '思维'],
      '用户行为': ['用户行为', '行为'],
      '增长策略': ['增长', '策略', '运营'],
      '产品管理': ['产品经理', '产品管理', 'PM'],
      '决策': ['决策', '选择'],
      '数据分析': ['数据', '分析', '数据驱动']
    }

    const matchedTags: string[] = []
    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(kw => content.includes(kw))) {
        matchedTags.push(tag)
      }
    }
    return matchedTags.length > 0 ? matchedTags : ['未分类']
  }

  function generateSummary(content: string): string {
    const sentences = content.split(/[。！？]/).filter(s => s.trim().length > 5)
    if (sentences.length === 0) return content.slice(0, 30) + '...'
    return sentences[0].slice(0, 40) + '...'
  }

  function updateAssociations(newInsight: Insight) {
    const existingInsights = insights.value.filter(i => i.id !== newInsight.id)
    
    existingInsights.forEach(insight => {
      const score = calculateAssociationScore(newInsight, insight)
      if (score > 0.3) {
        const type = determineAssociationType(newInsight, insight, score)
        insight.associations.push({
          insightId: newInsight.id,
          type,
          strength: score
        })
        newInsight.associations.push({
          insightId: insight.id,
          type,
          strength: score
        })
      }
    })
  }

  function calculateAssociationScore(a: Insight, b: Insight): number {
    let score = 0
    
    const tagIntersection = a.tags.filter(t => b.tags.includes(t)).length
    score += (tagIntersection / Math.max(a.tags.length, b.tags.length)) * 0.5

    const textSimilarity = calculateTextSimilarity(a.content, b.content)
    score += textSimilarity * 0.5

    return Math.round(score * 100) / 100
  }

  function calculateTextSimilarity(a: string, b: string): number {
    const wordsA = a.toLowerCase().split(/\s+/).filter(w => w.length > 1)
    const wordsB = b.toLowerCase().split(/\s+/).filter(w => w.length > 1)
    
    if (wordsA.length === 0 || wordsB.length === 0) return 0
    
    const intersection = wordsA.filter(w => wordsB.includes(w)).length
    return intersection / Math.max(wordsA.length, wordsB.length)
  }

  function determineAssociationType(a: Insight, b: Insight, score: number): AssociationType {
    if (score > 0.7) return 'semantic'
    if (score > 0.5) return 'logical'
    return 'complementary'
  }

  function getInsightById(id: string): Insight | undefined {
    return insights.value.find(i => i.id === id)
  }

  function getRelatedInsights(id: string): Insight[] {
    const insight = getInsightById(id)
    if (!insight) return []
    
    return insight.associations
      .map(assoc => getInsightById(assoc.insightId))
      .filter((i): i is Insight => i !== undefined)
      .sort((a, b) => {
        const aStrength = insight.associations.find(assoc => assoc.insightId === a.id)?.strength || 0
        const bStrength = insight.associations.find(assoc => assoc.insightId === b.id)?.strength || 0
        return bStrength - aStrength
      })
  }

  function wakeInsight(id: string) {
    const insight = getInsightById(id)
    if (insight) {
      insight.lastWokenAt = Date.now()
      insight.wakeCount++
      insight.luminosity = Math.min(100, insight.luminosity + 2)
      points.value += 5
    }
  }

  function interactInsight(id: string) {
    const insight = getInsightById(id)
    if (insight) {
      insight.interactionCount++
      insight.luminosity = Math.min(100, insight.luminosity + 5)
      points.value += 15
    }
  }

  function addVersion(id: string, content: string) {
    const insight = getInsightById(id)
    if (insight) {
      insight.versions.push({
        id: generateId(),
        content,
        createdAt: Date.now()
      })
      insight.content = content
      insight.updatedAt = Date.now()
      insight.luminosity = Math.min(100, insight.luminosity + 8)
      points.value += 20
    }
  }

  function getDailyBlindBox(): DailyBlindBox {
    const randomIndex = Math.floor(Math.random() * insights.value.length)
    const insight = insights.value[randomIndex]
    const related = getRelatedInsights(insight.id).slice(0, 2)
    
    const type: 'basic' | 'highlight' | 'combo' = insight.luminosity >= 80 ? 'highlight' : 
                 related.length >= 2 ? 'combo' : 'basic'

    return { insight, relatedInsights: related, type }
  }

  function mergeInsights(sourceId: string, targetId: string) {
    const source = getInsightById(sourceId)
    const target = getInsightById(targetId)
    
    if (source && target) {
      target.content += `\n\n---\n${source.content}`
      target.tags = [...new Set([...target.tags, ...source.tags])]
      target.luminosity = Math.min(100, Math.round((target.luminosity + source.luminosity) / 2) + 10)
      target.updatedAt = Date.now()
      
      insights.value = insights.value.filter(i => i.id !== sourceId)
      
      insights.value.forEach(insight => {
        insight.associations = insight.associations.filter(a => a.insightId !== sourceId)
        const existingAssoc = insight.associations.find(a => a.insightId === targetId)
        if (!existingAssoc && insight.id !== targetId) {
          const score = calculateAssociationScore(insight, target)
          if (score > 0.3) {
            insight.associations.push({
              insightId: targetId,
              type: determineAssociationType(insight, target, score),
              strength: score
            })
          }
        }
      })
      
      points.value += 50
    }
  }

  async function loadInsightsFromCloud() {
    const result = await callCloudFunction('getInsights')
    if (result.code === 0) {
      insights.value = result.data.list
      isCloudEnabled.value = true
      return true
    }
    return false
  }

  async function createInsightToCloud(content: string, rawContent?: string) {
    const result = await callCloudFunction('createInsight', { content, rawContent })
    if (result.code === 0) {
      const newInsight = result.data
      insights.value.unshift(newInsight)
      return newInsight
    }
    return null
  }

  async function getDailyBlindBoxFromCloud(): Promise<DailyBlindBox | null> {
    const result = await callCloudFunction('getDailyBlindBox')
    if (result.code === 0) {
      return result.data
    }
    return null
  }

  async function getRelatedInsightsFromCloud(id: string) {
    const result = await callCloudFunction('getRelatedInsights', { id })
    if (result.code === 0) {
      return result.data
    }
    return []
  }

  async function updateLuminosityToCloud(id: string, delta: number) {
    const result = await callCloudFunction('updateLuminosity', { id, delta })
    if (result.code === 0) {
      const insight = getInsightById(id)
      if (insight) {
        insight.luminosity = Math.min(100, Math.max(0, insight.luminosity + delta))
      }
      return true
    }
    return false
  }

  async function mergeInsightsToCloud(sourceId: string, targetId: string) {
    const result = await callCloudFunction('mergeInsights', { sourceId, targetId })
    if (result.code === 0) {
      insights.value = insights.value.filter(i => i.id !== sourceId)
      const targetIndex = insights.value.findIndex(i => i.id === targetId)
      if (targetIndex !== -1) {
        insights.value[targetIndex] = result.data
      }
      return true
    }
    return false
  }

  async function initMockData() {
    const result = await callCloudFunction('initData')
    return result.code === 0
  }

  return {
    insights,
    points,
    isCloudEnabled,
    sortedInsights,
    goldInsights,
    todayInsights,
    generateId,
    getLuminosityLevel,
    getAssociationLabel,
    addInsight,
    getInsightById,
    getRelatedInsights,
    wakeInsight,
    interactInsight,
    addVersion,
    getDailyBlindBox,
    mergeInsights,
    loadInsightsFromCloud,
    createInsightToCloud,
    getDailyBlindBoxFromCloud,
    getRelatedInsightsFromCloud,
    updateLuminosityToCloud,
    mergeInsightsToCloud,
    initMockData
  }
})
