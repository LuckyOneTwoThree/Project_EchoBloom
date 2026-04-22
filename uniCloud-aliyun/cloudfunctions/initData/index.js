// 云函数：初始化 Mock 数据
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    // 先清空现有数据
    await db.collection('insights').where({}).remove()
    
    const mockInsights = [
      {
        id: 'insight-001',
        content: '宇宙的本质是信息，而非物质。每一个粒子都在传递某种意义。',
        rawContent: '宇宙本质信息物质粒子传递意义',
        summary: '宇宙本质是信息',
        tags: ['哲学', '科学', '宇宙'],
        luminosity: 85,
        createdAt: Date.now() - 86400000 * 7,
        updatedAt: Date.now() - 86400000 * 2,
        lastWokenAt: Date.now() - 86400000,
        wakeCount: 5,
        interactionCount: 12,
        associations: [
          { insightId: 'insight-002', type: 'semantic', strength: 75 },
          { insightId: 'insight-003', type: 'logical', strength: 90 }
        ],
        versions: [
          { content: '宇宙的本质是信息', timestamp: Date.now() - 86400000 * 7, reason: '创建' },
          { content: '宇宙的本质是信息，而非物质', timestamp: Date.now() - 86400000 * 3, reason: '补充' }
        ]
      },
      {
        id: 'insight-002',
        content: '时间是记忆的载体，我们通过记忆感知时间的流逝。',
        rawContent: '时间记忆载体感知流逝',
        summary: '时间是记忆的载体',
        tags: ['哲学', '时间', '心理学'],
        luminosity: 72,
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000,
        lastWokenAt: Date.now() - 86400000 * 2,
        wakeCount: 3,
        interactionCount: 8,
        associations: [
          { insightId: 'insight-001', type: 'semantic', strength: 75 },
          { insightId: 'insight-004', type: 'complementary', strength: 60 }
        ],
        versions: [
          { content: '时间是记忆的载体', timestamp: Date.now() - 86400000 * 5, reason: '创建' }
        ]
      },
      {
        id: 'insight-003',
        content: '量子纠缠揭示了宇宙的非局域性，万物之间都有隐秘的联系。',
        rawContent: '量子纠缠非局域性宇宙联系',
        summary: '量子纠缠揭示非局域性',
        tags: ['科学', '量子物理', '宇宙'],
        luminosity: 90,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 2,
        lastWokenAt: Date.now() - 86400000 * 3,
        wakeCount: 8,
        interactionCount: 15,
        associations: [
          { insightId: 'insight-001', type: 'logical', strength: 90 },
          { insightId: 'insight-005', type: 'semantic', strength: 70 }
        ],
        versions: [
          { content: '量子纠缠揭示了宇宙的非局域性', timestamp: Date.now() - 86400000 * 3, reason: '创建' }
        ]
      },
      {
        id: 'insight-004',
        content: '创造力来源于已有知识的重新组合，而非凭空产生。',
        rawContent: '创造力知识重组',
        summary: '创造力源于知识重组',
        tags: ['心理学', '创造力', '学习'],
        luminosity: 65,
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 2,
        lastWokenAt: Date.now() - 86400000 * 4,
        wakeCount: 2,
        interactionCount: 6,
        associations: [
          { insightId: 'insight-002', type: 'complementary', strength: 60 }
        ],
        versions: [
          { content: '创造力来源于已有知识的重新组合', timestamp: Date.now() - 86400000 * 4, reason: '创建' }
        ]
      },
      {
        id: 'insight-005',
        content: '意识是一种涌现现象，从复杂的神经连接中产生。',
        rawContent: '意识涌现神经连接',
        summary: '意识是涌现现象',
        tags: ['科学', '神经科学', '哲学'],
        luminosity: 78,
        createdAt: Date.now() - 86400000 * 6,
        updatedAt: Date.now() - 86400000,
        lastWokenAt: Date.now() - 86400000 * 5,
        wakeCount: 4,
        interactionCount: 10,
        associations: [
          { insightId: 'insight-003', type: 'semantic', strength: 70 },
          { insightId: 'insight-001', type: 'complementary', strength: 55 }
        ],
        versions: [
          { content: '意识是一种涌现现象', timestamp: Date.now() - 86400000 * 6, reason: '创建' }
        ]
      },
      {
        id: 'insight-006',
        content: '语言塑造思维，不同语言的使用者拥有不同的认知方式。',
        rawContent: '语言思维认知',
        summary: '语言塑造思维',
        tags: ['语言学', '心理学', '哲学'],
        luminosity: 68,
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000,
        lastWokenAt: Date.now() - 86400000 * 2,
        wakeCount: 1,
        interactionCount: 4,
        associations: [
          { insightId: 'insight-004', type: 'semantic', strength: 65 }
        ],
        versions: [
          { content: '语言塑造思维', timestamp: Date.now() - 86400000 * 2, reason: '创建' }
        ]
      },
      {
        id: 'insight-007',
        content: '熵增定律告诉我们，宇宙正在从有序走向无序。',
        rawContent: '熵增定律有序无序',
        summary: '熵增定律',
        tags: ['科学', '热力学', '宇宙'],
        luminosity: 82,
        createdAt: Date.now() - 86400000 * 8,
        updatedAt: Date.now() - 86400000 * 3,
        lastWokenAt: Date.now() - 86400000 * 4,
        wakeCount: 6,
        interactionCount: 11,
        associations: [
          { insightId: 'insight-001', type: 'logical', strength: 85 },
          { insightId: 'insight-005', type: 'conflict', strength: 35 }
        ],
        versions: [
          { content: '熵增定律告诉我们', timestamp: Date.now() - 86400000 * 8, reason: '创建' }
        ]
      },
      {
        id: 'insight-008',
        content: '冥想可以改变大脑结构，增强专注力和情绪调节能力。',
        rawContent: '冥想大脑专注力情绪',
        summary: '冥想改变大脑结构',
        tags: ['心理学', '健康', '哲学'],
        luminosity: 55,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now(),
        lastWokenAt: Date.now() - 86400000,
        wakeCount: 0,
        interactionCount: 2,
        associations: [
          { insightId: 'insight-005', type: 'complementary', strength: 50 }
        ],
        versions: [
          { content: '冥想可以改变大脑结构', timestamp: Date.now() - 86400000, reason: '创建' }
        ]
      }
    ]
    
    // 批量添加数据
    for (const insight of mockInsights) {
      await db.collection('insights').add(insight)
    }
    
    return {
      code: 0,
      message: '初始化成功',
      data: { count: mockInsights.length }
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    return {
      code: -1,
      message: '初始化数据失败',
      data: null
    }
  }
}