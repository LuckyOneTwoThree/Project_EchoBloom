exports.main = async (event, context) => {
  const db = uniCloud.database()
  try {
    const { id } = event
    if (!id) {
      return { code: -1, message: '缺少参数id', data: null }
    }
    const result = await db.collection('insights').doc(id).get()
    if (!result.data || result.data.length === 0) {
      return { code: -1, message: '灵感不存在', data: null }
    }
    return { code: 0, message: 'success', data: result.data[0] }
  } catch (error) {
    console.error('获取灵感详情失败:', error)
    return { code: -1, message: '获取灵感详情失败', data: null }
  }
}