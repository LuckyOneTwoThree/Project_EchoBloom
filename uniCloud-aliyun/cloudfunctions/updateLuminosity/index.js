// 云函数：更新发光度
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { id, delta } = event
    
    if (!id || delta === undefined) {
      return {
        code: -1,
        message: 'ID和变化量不能为空',
        data: null
      }
    }
    
    // 使用原子操作更新发光度
    const result = await db.collection('insights').doc(id).update({
      luminosity: db.command.inc(delta)
    })
    
    if (result.updated === 0) {
      return {
        code: -1,
        message: '灵感不存在',
        data: null
      }
    }
    
    // 获取更新后的记录
    const insightResult = await db.collection('insights').doc(id).get()
    
    return {
      code: 0,
      message: '更新成功',
      data: insightResult.data[0]
    }
  } catch (error) {
    console.error('更新发光度失败:', error)
    return {
      code: -1,
      message: '更新发光度失败',
      data: null
    }
  }
}