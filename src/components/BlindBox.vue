<template>
  <view class="blind-box" v-if="blindBox">
    <view class="box-header">
      <view class="box-badge" :class="blindBox.type">
        {{ typeLabel }}
      </view>
      <text class="box-title">今日灵感盲盒</text>
    </view>
    
    <view class="main-insight" @click="openInsight(blindBox.insight.id)">
      <view class="insight-card" :class="luminosityClass">
        <view class="luminosity-indicator">
          <view class="star" :class="luminosityClass"></view>
          <text class="luminosity-value">{{ blindBox.insight.luminosity }}</text>
        </view>
        <text class="insight-content">{{ blindBox.insight.content }}</text>
        <view class="insight-meta">
          <view class="tags">
            <text class="tag" v-for="tag in blindBox.insight.tags.slice(0, 2)" :key="tag">{{ tag }}</text>
          </view>
          <text class="date">{{ formatDate(blindBox.insight.createdAt) }}</text>
        </view>
      </view>
    </view>
    
    <view class="related-section" v-if="blindBox.relatedInsights.length > 0">
      <text class="related-title">关联灵感</text>
      <view class="related-list">
        <view 
          class="related-card" 
          v-for="rel in blindBox.relatedInsights" 
          :key="rel.id"
          @click="openInsight(rel.id)"
        >
          <view class="related-dot"></view>
          <text class="related-content">{{ rel.summary || rel.content.slice(0, 30) }}...</text>
        </view>
      </view>
    </view>
    
    <view class="box-actions">
      <view class="action-btn valuable" @click="markValuable">
        <view class="action-icon">✓</view>
        <text class="action-text">仍有价值</text>
      </view>
      <view class="action-btn skip" @click="skipInsight">
        <view class="action-icon">→</view>
        <text class="action-text">跳过</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInsightStore } from '@/stores/insight'
import type { DailyBlindBox } from '@/types'

const props = defineProps<{
  blindBox: DailyBlindBox | null
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
  (e: 'next'): void
}>()

const insightStore = useInsightStore()

const typeLabel = computed(() => {
  if (!props.blindBox) return ''
  const labels: Record<string, string> = {
    basic: '基础',
    highlight: '高光',
    combo: '组合'
  }
  return labels[props.blindBox.type] || ''
})

const luminosityClass = computed(() => {
  if (!props.blindBox) return 'low'
  return insightStore.getLuminosityLevel(props.blindBox.insight.luminosity)
})

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function openInsight(id: string) {
  emit('open', id)
}

function markValuable() {
  if (props.blindBox) {
    insightStore.interactInsight(props.blindBox.insight.id)
    uni.showToast({ title: '光度+5', icon: 'success' })
  }
}

function skipInsight() {
  if (props.blindBox) {
    insightStore.wakeInsight(props.blindBox.insight.id)
  }
  emit('next')
}
</script>

<style lang="scss" scoped>
.blind-box {
  background: linear-gradient(145deg, var(--color-bg-card) 0%, rgba(250, 245, 255, 0.6) 50%, rgba(240, 249, 255, 0.4) 100%);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-base);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -80rpx;
    right: -80rpx;
    width: 240rpx;
    height: 240rpx;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -60rpx;
    left: -60rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

.box-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.box-badge {
  padding: 8rpx 20rpx;
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 1rpx;
  
  &.basic {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.06) 100%);
    color: var(--color-accent-secondary);
    border: 1rpx solid rgba(99, 102, 241, 0.15);
  }
  
  &.highlight {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
    color: var(--color-accent-gold);
    border: 1rpx solid rgba(251, 191, 36, 0.2);
  }
  
  &.combo {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.06) 100%);
    color: var(--color-accent-primary);
    border: 1rpx solid rgba(139, 92, 246, 0.2);
  }
}

.box-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 1rpx;
}

.main-insight {
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.insight-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3rpx;
    background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent);
    transition: all var(--transition-normal);
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
  
  &.low {
    .luminosity-indicator .star {
      background-color: #94a3b8;
    }
  }
  
  &.medium {
    border-color: rgba(251, 191, 36, 0.2);
    box-shadow: var(--shadow-sm), 0 0 24rpx rgba(251, 191, 36, 0.06);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.4), transparent);
    }
    
    .luminosity-indicator .star {
      background-color: var(--color-accent-star);
      box-shadow: 0 0 12rpx var(--color-accent-star);
    }
  }
  
  &.high {
    border-color: rgba(245, 158, 11, 0.3);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 158, 11, 0.04) 50%, rgba(139, 92, 246, 0.02) 100%);
    box-shadow: var(--shadow-base), 0 0 32rpx rgba(245, 158, 11, 0.1);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent);
    }
    
    .luminosity-indicator .star {
      background-color: var(--color-accent-gold);
      box-shadow: 0 0 16rpx var(--color-accent-gold);
      animation: glow 2s ease-in-out infinite;
    }
  }
}

.luminosity-indicator {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: var(--spacing-base);
}

.star {
  width: 28rpx;
  height: 28rpx;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.luminosity-value {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

.insight-content {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  line-height: 1.85;
  margin-bottom: var(--spacing-lg);
  letter-spacing: 0.5rpx;
}

.insight-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--color-accent-primary);
  background: linear-gradient(135deg, var(--color-accent-surface) 0%, rgba(139, 92, 246, 0.04) 100%);
  padding: 6rpx 14rpx;
  border-radius: var(--radius-base);
  border: 1rpx solid rgba(139, 92, 246, 0.12);
  font-weight: 500;
}

.date {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 400;
}

.related-section {
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.related-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-base);
  display: block;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.related-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-base);
  padding: var(--spacing-base) var(--spacing-lg);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
  border-radius: var(--radius-lg);
  border: 1rpx solid var(--color-border-light);
  transition: all var(--transition-fast);
  
  &:active {
    background: rgba(139, 92, 246, 0.04);
    transform: scale(0.98);
  }
}

.related-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-accent-primary), var(--color-accent-secondary));
  margin-top: 10rpx;
  flex-shrink: 0;
  box-shadow: 0 0 8rpx rgba(139, 92, 246, 0.3);
}

.related-content {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.box-actions {
  display: flex;
  gap: var(--spacing-base);
  position: relative;
  z-index: 1;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-base) var(--spacing-lg);
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &.valuable {
    background: linear-gradient(145deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 50%, #4f46e5 100%);
    box-shadow: 0 4rpx 20rpx rgba(139, 92, 246, 0.35), 0 2rpx 6rpx rgba(99, 102, 241, 0.2);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }
    
    .action-icon {
      color: white;
      font-weight: 700;
    }
    
    .action-text {
      color: white;
      font-weight: 600;
    }
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 12rpx rgba(139, 92, 246, 0.3);
    }
  }
  
  &.skip {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
    border: 1rpx solid var(--color-border-light);
    box-shadow: var(--shadow-sm);
    
    .action-icon {
      color: var(--color-text-muted);
    }
    
    .action-text {
      color: var(--color-text-secondary);
      font-weight: 500;
    }
    
    &:active {
      transform: scale(0.96);
      background: rgba(248, 250, 252, 0.95);
    }
  }
}

.action-icon {
  font-size: var(--font-size-lg);
}

.action-text {
  font-size: var(--font-size-base);
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 16rpx var(--color-accent-gold);
  }
  50% {
    box-shadow: 0 0 32rpx var(--color-accent-gold);
  }
}
</style>
