<template>
  <view class="garden-page">
    <view class="garden-header">
      <text class="header-title">思维星云</text>
      <view class="view-toggle">
        <view 
          class="toggle-btn" 
          :class="{ active: viewMode === 'nebula' }"
          @click="viewMode = 'nebula'"
        >
          <text class="toggle-text">星云</text>
        </view>
        <view 
          class="toggle-btn" 
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <text class="toggle-text">列表</text>
        </view>
      </view>
    </view>
    
    <view class="nebula-view" v-if="viewMode === 'nebula'">
      <NebulaCanvas />
      
      <view class="legend">
        <view class="legend-item">
          <view class="legend-dot low"></view>
          <text class="legend-text">微光</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot medium"></view>
          <text class="legend-text">星光</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot high"></view>
          <text class="legend-text">鎏金</text>
        </view>
      </view>
    </view>
    
    <view class="list-view" v-else>
      <view class="filter-bar">
        <view 
          class="filter-btn" 
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
        >
          <text class="filter-text">全部</text>
        </view>
        <view 
          class="filter-btn" 
          :class="{ active: filter === 'gold' }"
          @click="filter = 'gold'"
        >
          <text class="filter-text">鎏金</text>
        </view>
        <view 
          class="filter-btn" 
          :class="{ active: filter === 'recent' }"
          @click="filter = 'recent'"
        >
          <text class="filter-text">最近</text>
        </view>
      </view>
      
      <view class="insight-grid">
        <InsightCard 
          v-for="insight in filteredInsights" 
          :key="insight.id" 
          :insight="insight" 
          @click="openInsight"
        />
      </view>
    </view>
    
    <CustomTabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInsightStore } from '@/stores/insight'
import NebulaCanvas from '@/components/NebulaCanvas.vue'
import InsightCard from '@/components/InsightCard.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import type { Insight } from '@/types'

const insightStore = useInsightStore()

const viewMode = ref<'nebula' | 'list'>('nebula')
const filter = ref<'all' | 'gold' | 'recent'>('all')

const filteredInsights = computed(() => {
  let insights = [...insightStore.insights]
  
  switch (filter.value) {
    case 'gold':
      insights = insights.filter(i => i.luminosity >= 80)
      break
    case 'recent':
      insights = insights.sort((a, b) => b.createdAt - a.createdAt)
      break
    default:
      insights = insights.sort((a, b) => b.luminosity - a.luminosity)
  }
  
  return insights
})

function openInsight(insight: Insight) {
  uni.navigateTo({
    url: `/pages/insight/insight?id=${insight.id}`
  })
}

onMounted(async () => {
  if (insightStore.insights.length === 0) {
    await insightStore.loadInsightsFromCloud()
  }
})
</script>

<style lang="scss" scoped>
.garden-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-card) 100%);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.garden-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  padding-top: calc(var(--spacing-lg) + env(safe-area-inset-top));
  backdrop-filter: blur(10px);
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30rpx rgba(168, 85, 247, 0.3);
}

.view-toggle {
  display: flex;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1rpx solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: 6rpx;
  box-shadow: 
    var(--shadow-sm),
    inset 0 1rpx 2rpx rgba(255, 255, 255, 0.8);
}

.toggle-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 50%, #4f46e5 100%);
    opacity: 0;
    transition: opacity var(--transition-normal);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    opacity: 0;
    transition: opacity var(--transition-fast);
    z-index: 1;
  }
  
  &.active {
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 1;
    }
    
    .toggle-text {
      color: #ffffff;
      font-weight: 600;
    }
    
    box-shadow: 
      0 4rpx 20rpx rgba(139, 92, 246, 0.4),
      0 2rpx 6rpx rgba(99, 102, 241, 0.3);
    transform: translateY(-2rpx);
  }
  
  &:active:not(.active) {
    background: rgba(139, 92, 246, 0.06);
    transform: scale(0.98);
  }
}

.toggle-text {
  position: relative;
  z-index: 2;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all var(--transition-fast);
  letter-spacing: 1rpx;
}

.nebula-view {
  padding: var(--spacing-lg);
  height: calc(100vh - 320rpx);
}

.legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-base);
  padding: var(--spacing-base) var(--spacing-lg);
  background: rgba(168, 85, 247, 0.03);
  border-radius: var(--radius-lg);
  margin-left: var(--spacing-lg);
  margin-right: var(--spacing-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.legend-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  position: relative;
  
  &.low {
    background-color: #64748b;
    box-shadow: 0 0 10rpx rgba(100, 116, 139, 0.5);
  }
  
  &.medium {
    background-color: var(--color-accent-star);
    box-shadow: 0 0 15rpx var(--color-accent-star), 0 0 30rpx rgba(251, 191, 36, 0.3);
    animation: pulse 2s infinite;
  }
  
  &.high {
    background-color: var(--color-accent-gold);
    box-shadow: 0 0 20rpx var(--color-accent-gold), 0 0 40rpx rgba(245, 158, 11, 0.4);
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.legend-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

.list-view {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.filter-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  position: relative;
}

.filter-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-base);
  background: transparent;
  border-radius: 0;
  border: none;
  transition: all var(--transition-fast);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rpx;
    left: 20%;
    width: 60%;
    height: 4rpx;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
    border-radius: 2rpx;
    transform: scaleX(0);
    transition: transform var(--transition-normal);
    transform-origin: center;
  }
  
  &.active {
    &::after {
      transform: scaleX(1);
    }
    
    .filter-text {
      color: var(--color-accent-primary);
      font-weight: 600;
    }
  }
  
  &:active {
    .filter-text {
      opacity: 0.7;
      transform: scale(0.98);
    }
  }
}

.filter-text {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  font-weight: 500;
  transition: all var(--transition-fast);
  letter-spacing: 1rpx;
}

.insight-grid {
  display: flex;
  flex-direction: column;
}
</style>
