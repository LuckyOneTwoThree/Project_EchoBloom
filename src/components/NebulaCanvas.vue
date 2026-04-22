<template>
  <view class="nebula-container">
    <view 
      class="nebula-scroll-area"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
    >
      <canvas 
        class="nebula-canvas"
        canvas-id="nebulaCanvas"
        id="nebulaCanvas"
      ></canvas>
    </view>
    
    <view class="node-tooltip" v-if="tooltipVisible" :style="tooltipStyle">
      <text class="tooltip-title">{{ tooltipData?.content }}</text>
      <text class="tooltip-tags">{{ tooltipData?.tags.join(', ') }}</text>
    </view>
    
    <view class="empty-state" v-if="nodes.length === 0">
      <text class="empty-icon">🌌</text>
      <text class="empty-text">暂无灵感数据</text>
      <text class="empty-hint">快去捕捉你的第一个灵感吧！</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useInsightStore } from '@/stores/insight'
import type { NebulaNode, NebulaLink } from '@/types'

const insightStore = useInsightStore()

const tooltipVisible = ref(false)
const tooltipData = ref<{ content: string; tags: string[] } | null>(null)
const tooltipStyle = ref({})

const offsetX = ref(0)
const offsetY = ref(0)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)

const stars = ref<Array<{x: number, y: number, size: number, alpha: number}>>([])

const nodes = computed<NebulaNode[]>(() => {
  const insights = insightStore.insights
  
  return insights.map((insight, index) => {
    const x = 50 + Math.random() * 400
    const y = 50 + Math.random() * 900
    const size = 6 + (insight.luminosity / 100) * 10
    
    let color = '#64748b'
    if (insight.luminosity >= 80) color = '#f59e0b'
    else if (insight.luminosity >= 50) color = '#fbbf24'
    
    return {
      id: insight.id,
      x,
      y,
      size,
      color,
      luminosity: insight.luminosity
    }
  })
})

const links = computed<NebulaLink[]>(() => {
  const result: NebulaLink[] = []
  const insights = insightStore.insights
  
  insights.forEach((insight, index) => {
    insight.associations.forEach((assoc) => {
      const targetIndex = insights.findIndex(i => i.id === assoc.insightId)
      if (targetIndex > index) {
        result.push({
          source: insight.id,
          target: assoc.insightId,
          type: assoc.type || 'related',
          strength: assoc.strength || 0.5
        })
      }
    })
  })
  
  return result
})

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    semantic: '#818cf8',
    logical: '#34d399',
    complementary: '#fbbf24',
    related: '#94a3b8'
  }
  return colors[type] || '#94a3b8'
}

function initStars() {
  stars.value = []
  for (let i = 0; i < 100; i++) {
    stars.value.push({
      x: Math.random() * 500,
      y: Math.random() * 1000,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.1
    })
  }
}

function drawCanvas() {
  const ctx = uni.createCanvasContext('nebulaCanvas')
  const width = 500
  const height = 1000
  
  ctx.setFillStyle('#0a0a15')
  ctx.fillRect(0, 0, width, height)
  
  ctx.save()
  ctx.translate(offsetX.value, offsetY.value)
  
  stars.value.forEach(star => {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.setFillStyle(`rgba(255, 255, 255, ${star.alpha})`)
    ctx.fill()
  })
  
  links.value.forEach(link => {
    const sourceNode = nodes.value.find(n => n.id === link.source)
    const targetNode = nodes.value.find(n => n.id === link.target)
    
    if (sourceNode && targetNode) {
      ctx.beginPath()
      ctx.setLineDash([5, 5], 0)
      ctx.moveTo(sourceNode.x, sourceNode.y)
      ctx.lineTo(targetNode.x, targetNode.y)
      
      const color = getNodeColor(link.type)
      ctx.setStrokeStyle(color)
      ctx.setGlobalAlpha(0.15)
      ctx.setLineWidth(1)
      ctx.stroke()
      ctx.setLineDash([], 0)
    }
  })
  
  ctx.setGlobalAlpha(1)
  
  nodes.value.forEach(node => {
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2)
    ctx.setFillStyle(node.color + '30')
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
    ctx.setFillStyle(node.color)
    ctx.fill()
    
    if (node.luminosity >= 70) {
      ctx.beginPath()
      ctx.arc(node.x - node.size * 0.3, node.y - node.size * 0.3, node.size * 0.4, 0, Math.PI * 2)
      ctx.setFillStyle('#ffffff')
      ctx.setGlobalAlpha(0.6)
      ctx.fill()
      ctx.setGlobalAlpha(1)
    }
  })
  
  ctx.restore()
  ctx.draw()
}

let lastDrawTime = 0

function handleTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  isDragging.value = false
}

function handleTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  const deltaX = touch.clientX - startX.value
  const deltaY = touch.clientY - startY.value
  
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    isDragging.value = true
    tooltipVisible.value = false
    
    offsetX.value = Math.max(-500, Math.min(500, offsetX.value + deltaX))
    offsetY.value = Math.max(-500, Math.min(500, offsetY.value + deltaY))
    
    const now = Date.now()
    if (now - lastDrawTime > 16) {
      drawCanvas()
      lastDrawTime = now
    }
  }
  
  startX.value = touch.clientX
  startY.value = touch.clientY
}

function handleTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0]
  
  if (!isDragging.value) {
    checkNodeClick(touch)
    setTimeout(() => {
      tooltipVisible.value = false
    }, 2000)
  }
}

function handleMouseDown(e: MouseEvent) {
  startX.value = e.clientX
  startY.value = e.clientY
  isDragging.value = false
  
  document.addEventListener('mousemove', handleMouseMoveGlobal)
  document.addEventListener('mouseup', handleMouseUpGlobal)
}

function handleMouseMoveGlobal(e: MouseEvent) {
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value
  
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    isDragging.value = true
    tooltipVisible.value = false
    
    offsetX.value = Math.max(-500, Math.min(500, offsetX.value + deltaX))
    offsetY.value = Math.max(-500, Math.min(500, offsetY.value + deltaY))
    
    const now = Date.now()
    if (now - lastDrawTime > 16) {
      drawCanvas()
      lastDrawTime = now
    }
  }
  
  startX.value = e.clientX
  startY.value = e.clientY
}

function handleMouseUpGlobal(e: MouseEvent) {
  document.removeEventListener('mousemove', handleMouseMoveGlobal)
  document.removeEventListener('mouseup', handleMouseUpGlobal)
  
  if (!isDragging.value) {
    checkNodeClick(e)
    setTimeout(() => {
      tooltipVisible.value = false
    }, 2000)
  }
}

function checkNodeClick(touch: Touch | MouseEvent) {
  const query = uni.createSelectorQuery()
  query.select('.nebula-canvas').boundingClientRect((rect) => {
    if (!rect) return
    
    const rectInfo = rect as { width: number; height: number; left: number; top: number }
    const scaleX = 500 / rectInfo.width
    const scaleY = 1000 / rectInfo.height
    const x = (touch.clientX - rectInfo.left - offsetX.value) * scaleX
    const y = (touch.clientY - rectInfo.top - offsetY.value) * scaleY
    
    nodes.value.forEach(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      if (distance < node.size + 15) {
        const insight = insightStore.getInsightById(node.id)
        if (insight) {
          tooltipData.value = {
            content: insight.summary || insight.content.slice(0, 40) + '...',
            tags: insight.tags
          }
          tooltipStyle.value = {
            left: `${touch.clientX - 100}px`,
            top: `${touch.clientY - 80}px`
          }
          tooltipVisible.value = true
        }
      }
    })
  }).exec()
}

onMounted(() => {
  initStars()
  setTimeout(() => {
    drawCanvas()
  }, 300)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMoveGlobal)
  document.removeEventListener('mouseup', handleMouseUpGlobal)
})

watch(() => insightStore.insights.length, () => {
  drawCanvas()
})
</script>

<style lang="scss" scoped>
.nebula-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(var(--radius-lg) + 8rpx);
  overflow: hidden;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
  border: 1rpx solid rgba(168, 85, 247, 0.2);
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.4),
    inset 0 0 40rpx rgba(168, 85, 247, 0.05);
  backdrop-filter: blur(10px);
}

.nebula-scroll-area {
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
  overflow: hidden;
}

.nebula-scroll-area:active {
  cursor: grabbing;
}

.nebula-canvas {
  width: 100%;
  height: 100%;
}

.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-base);
}

.empty-icon {
  font-size: 80rpx;
}

.empty-text {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}

.node-tooltip {
  position: fixed;
  background: linear-gradient(135deg, var(--color-bg-card), var(--color-bg-primary));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: var(--spacing-sm) var(--spacing-base);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  max-width: 400rpx;
}

.tooltip-title {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: 8rpx;
}

.tooltip-tags {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
