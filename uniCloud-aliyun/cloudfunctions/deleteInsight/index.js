// 云函数：删除灵感
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { id } = event
    
    if (!id) {
      return {
        code: -1,
        message: 'ID不能为空',
        data: null
      }
    }
    
    // 先删除关联记录
    await db.collection('insights')
      .where({
        'associations.insightId': id
      })
      .update({
        associations: db.command.pull({ insightId: id })
      })
    
    // 删除灵感记录
    const result = await db.collection('insights').doc(id).remove()
    
    if (result.deleted === 0) {
      return {
        code: -1,
        message: '灵感不存在',
        data: null
      }
    }
    
    return {
      code: 0,
      message: '删除成功',
      data: { deleted: result.deleted }
    }
  } catch (error) {
    console.error('删除灵感失败:', error)
    return {
      code: -1,
      message: '删除灵感失败',
      data: null
    }
  }
}