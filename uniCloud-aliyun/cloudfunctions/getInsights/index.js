// 云函数：获取灵感列表
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('insights')
  
  try {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = event
    
    const result = await collection
      .orderBy(sortBy, sortOrder)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
      
    const countResult = await collection.count()
    
    return {
      code: 0,
      message: 'success',
      data: {
        list: result.data,
        total: countResult.total,
        page,
        pageSize
      }
    }
  } catch (error) {
    console.error('获取灵感列表失败:', error)
    return {
      code: -1,
      message: '获取灵感列表失败',
      data: null
    }
  }
}