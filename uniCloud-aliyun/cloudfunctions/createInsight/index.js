// 云函数：创建新灵感
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { content, rawContent, summary, tags = [] } = event
    
    if (!content) {
      return {
        code: -1,
        message: '内容不能为空',
        data: null
      }
    }
    
    const now = Date.now()
    
    const newInsight = {
      content,
      rawContent: rawContent || '',
      summary: summary || '',
      tags: Array.isArray(tags) ? tags : [],
      luminosity: 20,
      createdAt: now,
      updatedAt: now,
      lastWokenAt: null,
      wakeCount: 0,
      interactionCount: 0,
      associations: [],
      versions: [{
        content,
        timestamp: now,
        reason: '创建'
      }]
    }
    
    const result = await db.collection('insights').add(newInsight)
    
    return {
      code: 0,
      message: '创建成功',
      data: {
        id: result.id,
        ...newInsight
      }
    }
  } catch (error) {
    console.error('创建灵感失败:', error)
    return {
      code: -1,
      message: '创建灵感失败',
      data: null
    }
  }
}