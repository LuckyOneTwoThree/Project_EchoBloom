// 云函数：合并灵感
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { sourceId, targetId, reason = '合并' } = event
    
    if (!sourceId || !targetId) {
      return {
        code: -1,
        message: '源ID和目标ID不能为空',
        data: null
      }
    }
    
    if (sourceId === targetId) {
      return {
        code: -1,
        message: '不能合并到自己',
        data: null
      }
    }
    
    // 获取源灵感和目标灵感
    const sourceResult = await db.collection('insights').doc(sourceId).get()
    const targetResult = await db.collection('insights').doc(targetId).get()
    
    if (!sourceResult.data || sourceResult.data.length === 0) {
      return {
        code: -1,
        message: '源灵感不存在',
        data: null
      }
    }
    
    if (!targetResult.data || targetResult.data.length === 0) {
      return {
        code: -1,
        message: '目标灵感不存在',
        data: null
      }
    }
    
    const source = sourceResult.data[0]
    const target = targetResult.data[0]
    
    const now = Date.now()
    
    // 合并内容
    const mergedContent = `${target.content}\n\n---\n\n${source.content}`
    
    // 合并标签（去重）
    const mergedTags = [...new Set([...(target.tags || []), ...(source.tags || [])])]
    
    // 更新目标灵感
    await db.collection('insights').doc(targetId).update({
      content: mergedContent,
      tags: mergedTags,
      luminosity: Math.min(target.luminosity + Math.floor(source.luminosity / 3), 100),
      updatedAt: now,
      interactionCount: target.interactionCount + 1,
      versions: db.command.push({
        content: target.content,
        timestamp: now,
        reason: `合并自 ${sourceId}`
      })
    })
    
    // 删除源灵感
    await db.collection('insights').doc(sourceId).remove()
    
    // 更新其他灵感中的关联引用
    await db.collection('insights')
      .where({
        'associations.insightId': sourceId
      })
      .update({
        associations: db.command.pull({ insightId: sourceId })
      })
    
    // 获取更新后的目标灵感
    const result = await db.collection('insights').doc(targetId).get()
    
    return {
      code: 0,
      message: '合并成功',
      data: result.data[0]
    }
  } catch (error) {
    console.error('合并灵感失败:', error)
    return {
      code: -1,
      message: '合并灵感失败',
      data: null
    }
  }
}