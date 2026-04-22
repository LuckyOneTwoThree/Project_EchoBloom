// 云函数：获取关联灵感
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { id, limit = 5 } = event
    
    if (!id) {
      return {
        code: -1,
        message: 'ID不能为空',
        data: null
      }
    }
    
    // 获取当前灵感
    const currentResult = await db.collection('insights').doc(id).get()
    if (!currentResult.data || currentResult.data.length === 0) {
      return {
        code: -1,
        message: '灵感不存在',
        data: null
      }
    }
    
    const currentInsight = currentResult.data[0]
    const currentTags = currentInsight.tags || []
    
    // 获取关联灵感（基于标签匹配）
    const result = await db.collection('insights')
      .where({
        id: db.command.neq(id),
        tags: db.command.in(currentTags)
      })
      .limit(limit)
      .get()
    
    const relatedInsights = result.data || []
    
    // 计算关联类型和强度
    const enrichedInsights = relatedInsights.map(insight => {
      const commonTags = (insight.tags || []).filter(tag => currentTags.includes(tag))
      const matchCount = commonTags.length
      const maxCount = Math.max(currentTags.length, insight.tags?.length || 0)
      const strength = maxCount > 0 ? (matchCount / maxCount) * 100 : 0
      
      // 判断关联类型
      let relationType = 'semantic' // 语义关联
      if (strength >= 80) {
        relationType = 'logical' // 逻辑关联
      } else if (strength >= 40) {
        relationType = 'complementary' // 互补关联
      } else {
        relationType = 'conflict' // 冲突关联
      }
      
      return {
        ...insight,
        relationType,
        strength: Math.round(strength),
        commonTags
      }
    })
    
    // 按关联强度排序
    enrichedInsights.sort((a, b) => b.strength - a.strength)
    
    return {
      code: 0,
      message: 'success',
      data: enrichedInsights
    }
  } catch (error) {
    console.error('获取关联灵感失败:', error)
    return {
      code: -1,
      message: '获取关联灵感失败',
      data: null
    }
  }
}