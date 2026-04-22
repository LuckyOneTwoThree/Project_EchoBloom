// 云函数：更新灵感
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { id, content, tags, reason = '编辑' } = event
    
    if (!id || !content) {
      return {
        code: -1,
        message: 'ID和内容不能为空',
        data: null
      }
    }
    
    const now = Date.now()
    
    // 获取原记录
    const oldResult = await db.collection('insights').doc(id).get()
    if (!oldResult.data || oldResult.data.length === 0) {
      return {
        code: -1,
        message: '灵感不存在',
        data: null
      }
    }
    
    const oldInsight = oldResult.data[0]
    
    // 更新记录
    const updateData = {
      content,
      tags: Array.isArray(tags) ? tags : oldInsight.tags || [],
      updatedAt: now,
      interactionCount: oldInsight.interactionCount + 1
    }
    
    // 添加版本记录
    if (oldInsight.versions) {
      updateData.versions = db.command.push({
        content: oldInsight.content,
        timestamp: now,
        reason
      })
    }
    
    await db.collection('insights').doc(id).update(updateData)
    
    // 获取更新后的记录
    const result = await db.collection('insights').doc(id).get()
    
    return {
      code: 0,
      message: '更新成功',
      data: result.data[0]
    }
  } catch (error) {
    console.error('更新灵感失败:', error)
    return {
      code: -1,
      message: '更新灵感失败',
      data: null
    }
  }
}