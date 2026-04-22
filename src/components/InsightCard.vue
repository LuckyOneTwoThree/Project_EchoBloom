<template>
  <view class="insight-card" :class="luminosityClass" @click="handleClick">
    <view class="card-header">
      <view class="luminosity-badge" :class="luminosityClass">
        <view class="star-icon" :class="luminosityClass"></view>
        <text class="luminosity-text">{{ insight.luminosity }}</text>
      </view>
      <view class="meta-info">
        <text class="wake-count">唤醒 {{ insight.wakeCount }}次</text>
      </view>
    </view>
    
    <text class="card-content">{{ insight.content }}</text>
    
    <view class="card-footer">
      <view class="tags-row">
        <text class="tag" v-for="tag in insight.tags.slice(0, 3)" :key="tag">{{ tag }}</text>
      </view>
      <view class="association-count">
        <text class="count-text">{{ insight.associations.length }} 关联</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInsightStore } from '@/stores/insight'
import type { Insight } from '@/types'

const props = defineProps<{
  insight: Insight
}>()

const emit = defineEmits<{
  (e: 'click', insight: Insight): void
}>()

const insightStore = useInsightStore()

const luminosityClass = computed(() => {
  return insightStore.getLuminosityLevel(props.insight.luminosity)
})

function handleClick() {
  emit('click', props.insight)
}
</script>

<style lang="scss" scoped>
.insight-card {
  background: linear-gradient(145deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  border: 1rpx solid var(--color-border-light);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-base);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3rpx;
    background: linear-gradient(90deg, transparent, var(--color-accent-primary), transparent);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    width: 60%;
    height: 50%;
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.02) 0%, transparent 100%);
    pointer-events: none;
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: var(--shadow-sm);
    &::before {
      opacity: 1;
    }
  }
  
  &.low {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
    border-color: rgba(203, 213, 224, 0.3);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.5), transparent);
    }
  }
  
  &.medium {
    border-color: rgba(251, 191, 36, 0.25);
    background: linear-gradient(145deg, rgba(251, 191, 36, 0.04) 0%, rgba(255, 255, 255, 0.98) 100%);
    box-shadow: 
      var(--shadow-base),
      0 0 30rpx rgba(251, 191, 36, 0.08);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent);
    }
  }
  
  &.high {
    border-color: rgba(245, 158, 11, 0.35);
    background: linear-gradient(145deg, rgba(245, 158, 11, 0.05) 0%, rgba(139, 92, 246, 0.03) 50%, rgba(255, 255, 255, 0.98) 100%);
    box-shadow: 
      var(--shadow-lg),
      0 0 40rpx rgba(245, 158, 11, 0.12);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.6), transparent);
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.luminosity-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: calc(var(--radius-sm) + 4rpx);
  transition: all 0.3s ease;
  
  &.low {
    background: linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.1));
    border: 1rpx solid rgba(148, 163, 184, 0.25);
    .star-icon {
      background: linear-gradient(135deg, #94a3b8, #64748b);
      box-shadow: 0 0 8rpx rgba(148, 163, 184, 0.5);
    }
    .luminosity-text {
      color: #94a3b8;
      font-weight: 700;
    }
  }
  
  &.medium {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1));
    border: 1rpx solid rgba(251, 191, 36, 0.35);
    .star-icon {
      background: linear-gradient(135deg, var(--color-accent-star), #f59e0b);
      box-shadow: 0 0 12rpx var(--color-accent-star);
      animation: starPulse 2s infinite;
    }
    .luminosity-text {
      color: var(--color-accent-star);
      font-weight: 700;
    }
  }
  
  &.high {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.15));
    border: 1rpx solid rgba(245, 158, 11, 0.45);
    .star-icon {
      background: linear-gradient(135deg, var(--color-accent-gold), #f97316);
      box-shadow: 0 0 16rpx var(--color-accent-gold), 0 0 32rpx rgba(245, 158, 11, 0.4);
      animation: starPulse 1.5s infinite;
    }
    .luminosity-text {
      color: var(--color-accent-gold);
      font-weight: 700;
      text-shadow: 0 0 12rpx rgba(245, 158, 11, 0.5);
    }
  }
}

@keyframes starPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
}

.star-icon {
  width: 24rpx;
  height: 24rpx;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  transition: all 0.3s ease;
}

.luminosity-text {
  font-size: calc(var(--font-size-xs) + 2rpx);
  font-weight: 700;
}

.meta-info {
  display: flex;
  gap: var(--spacing-sm);
}

.wake-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
  background: rgba(147, 51, 234, 0.08);
  padding: 4rpx 12rpx;
  border-radius: var(--radius-sm);
}

.card-content {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  line-height: 1.85;
  margin-bottom: var(--spacing-xl);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 400;
  letter-spacing: 0.5rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.02);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1rpx solid var(--color-border-light);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--color-accent-primary);
  background: linear-gradient(135deg, var(--color-accent-surface) 0%, rgba(139, 92, 246, 0.04) 100%);
  padding: 8rpx 16rpx;
  border-radius: var(--radius-base);
  border: 1rpx solid rgba(139, 92, 246, 0.15);
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:active {
    background: rgba(139, 92, 246, 0.15);
    transform: scale(0.96);
  }
}

.association-count {
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border-radius: calc(var(--radius-sm) + 2rpx);
  border: 1rpx solid rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(59, 130, 246, 0.15);
    transform: scale(0.95);
  }
}

.count-text {
  font-size: calc(var(--font-size-xs) + 2rpx);
  color: var(--color-accent-secondary);
  font-weight: 600;
}
</style>
