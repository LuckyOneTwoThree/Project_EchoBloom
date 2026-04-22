// 云函数：获取每日盲盒
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    // 获取随机灵感
    const countResult = await db.collection('insights').count()
    if (countResult.total === 0) {
      return {
        code: -1,
        message: '暂无灵感数据',
        data: null
      }
    }
    
    // 使用聚合随机选取一条
    const insightResult = await db.collection('insights')
      .aggregate()
      .sample({ size: 1 })
      .end()
    
    if (!insightResult.data || insightResult.data.length === 0) {
      return {
        code: -1,
        message: '获取盲盒失败',
        data: null
      }
    }
    
    const insight = insightResult.data[0]
    
    // 获取关联灵感
    const relatedResult = await db.collection('insights')
      .where({
        id: db.command.neq(insight.id),
        tags: db.command.in(insight.tags || [])
      })
      .limit(3)
      .get()
    
    const relatedInsights = relatedResult.data || []
    
    // 计算盲盒类型
    let type = 'basic'
    if (insight.luminosity >= 80) {
      type = 'highlight'
    } else if (relatedInsights.length >= 2) {
      type = 'combo'
    }
    
    // 更新唤醒次数
    await db.collection('insights').doc(insight.id).update({
      wakeCount: (insight.wakeCount || 0) + 1,
      lastWokenAt: Date.now()
    })
    
    return {
      code: 0,
      message: 'success',
      data: {
        insight,
        relatedInsights,
        type
      }
    }
  } catch (error) {
    console.error('获取盲盒失败:', error)
    return {
      code: -1,
      message: '获取盲盒失败',
      data: null
    }
  }
}