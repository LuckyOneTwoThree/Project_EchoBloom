<template>
  <view class="home-page">
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>
    <view class="bg-orb orb-3"></view>

    <view class="header">
      <view class="header-top">
        <view class="greeting-section">
          <text class="greeting-label">{{ greetingLabel }}</text>
          <view class="brand-row">
            <view class="logo">
              <view class="logo-orbit orbit-1"></view>
              <view class="logo-orbit orbit-2"></view>
              <view class="logo-core"></view>
            </view>
            <view class="brand-info">
              <text class="brand-name">EchoStream</text>
              <text class="brand-sub">灵感回声</text>
            </view>
          </view>
        </view>
        <view class="points-badge" @click="initMockData">
          <view class="points-spark"></view>
          <text class="points-num">{{ insightStore.points }}</text>
          <text class="points-unit">灵感值</text>
        </view>
      </view>

      <view class="stats-row">
        <view class="stat-card">
          <view class="stat-icon-wrap purple">
            <view class="stat-dot"></view>
          </view>
          <text class="stat-value">{{ insightStore.insights.length }}</text>
          <text class="stat-label">灵感总数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-card">
          <view class="stat-icon-wrap gold">
            <view class="stat-star"></view>
          </view>
          <text class="stat-value">{{ insightStore.goldInsights.length }}</text>
          <text class="stat-label">鎏金灵感</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-card">
          <view class="stat-icon-wrap green">
            <view class="stat-ring"></view>
          </view>
          <text class="stat-value">{{ todayCount }}</text>
          <text class="stat-label">今日记录</text>
        </view>
      </view>
    </view>

    <scroll-view class="main-scroll" scroll-y enhanced :show-scrollbar="false">
      <view class="main-content">
        <view class="empty-state" v-if="insightStore.insights.length === 0">
          <view class="empty-orb"></view>
          <view class="empty-orb small"></view>
          <text class="empty-title">还没有灵感</text>
          <text class="empty-desc">点击下方捕捉按钮，记录你的第一个灵感</text>
          <view class="empty-action" @click="goToCapture">
            <text class="empty-action-text">开始捕捉</text>
          </view>
        </view>

        <template v-else>
          <view class="section animate-item" style="--delay: 0.05s">
            <view class="section-header">
              <view class="section-label-row">
                <view class="section-dot"></view>
                <text class="section-title">今日灵感盲盒</text>
              </view>
              <view class="section-action-btn" @click="refreshBlindBox">
                <view class="refresh-icon" :class="{ spinning: isRefreshing }"></view>
                <text class="section-action-text">换一个</text>
              </view>
            </view>
            <BlindBox
              :blind-box="dailyBlindBox"
              @open="openInsight"
              @next="refreshBlindBox"
            />
          </view>

          <view class="section animate-item" style="--delay: 0.15s">
            <view class="section-header">
              <view class="section-label-row">
                <view class="section-dot gold"></view>
                <text class="section-title">高光灵感</text>
              </view>
              <view class="section-action-btn" @click="goToGarden">
                <text class="section-action-text">查看全部</text>
                <view class="arrow-icon"></view>
              </view>
            </view>
            <view class="insight-list">
              <view
                class="insight-item animate-item"
                v-for="(insight, index) in topInsights"
                :key="insight.id"
                :style="{ '--delay': `${0.2 + index * 0.08}s` }"
              >
                <InsightCard
                  :insight="insight"
                  @click="(insight) => openInsight(insight.id)"
                />
              </view>
            </view>
          </view>

          <view class="dev-section" v-if="showDevTools">
            <view class="dev-card" @click="initMockData">
              <view class="dev-icon-wrap">
                <text class="dev-icon">🚀</text>
              </view>
              <view class="dev-info">
                <text class="dev-title">初始化测试数据</text>
                <text class="dev-desc">填充示例灵感数据</text>
              </view>
              <view class="dev-arrow"></view>
            </view>
          </view>
        </template>

        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>

    <CustomTabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInsightStore } from '@/stores/insight'
import BlindBox from '@/components/BlindBox.vue'
import InsightCard from '@/components/InsightCard.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import type { DailyBlindBox } from '@/types'

const insightStore = useInsightStore()

const dailyBlindBox = ref<DailyBlindBox | null>(null)
const isRefreshing = ref(false)
const showDevTools = ref(true)

const greetingLabel = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，灵感不眠'
  if (hour < 9) return '早安，新的一天'
  if (hour < 12) return '上午好，思绪正浓'
  if (hour < 14) return '午间小憩，灵感涌现'
  if (hour < 18) return '下午好，继续创造'
  if (hour < 22) return '晚上好，沉淀思绪'
  return '夜深了，灵感不眠'
})

const todayCount = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0)
  return insightStore.insights.filter(i => i.createdAt >= today).length
})

const topInsights = computed(() => {
  return insightStore.sortedInsights.slice(0, 3)
})

function refreshBlindBox() {
  isRefreshing.value = true
  dailyBlindBox.value = insightStore.getDailyBlindBox()
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

function openInsight(id: string) {
  uni.navigateTo({
    url: `/pages/insight/insight?id=${id}`
  })
}

function goToGarden() {
  uni.reLaunch({
    url: '/pages/garden/garden'
  })
}

function goToCapture() {
  uni.reLaunch({
    url: '/pages/capture/capture'
  })
}

async function initMockData() {
  uni.showLoading({ title: '初始化中...' })
  const success = await insightStore.initMockData()
  uni.hideLoading()
  if (success) {
    uni.showToast({ title: '初始化成功', icon: 'success' })
    await insightStore.loadInsightsFromCloud()
    refreshBlindBox()
  } else {
    uni.showToast({ title: '初始化失败', icon: 'error' })
  }
}

onMounted(() => {
  refreshBlindBox()
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-gradient-start) 0%, var(--color-bg-primary) 30%);
  position: relative;
  overflow: hidden;
}

.bg-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(120rpx);
  z-index: 0;
}

.orb-1 {
  width: 500rpx;
  height: 500rpx;
  top: -180rpx;
  right: -140rpx;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-2 {
  width: 400rpx;
  height: 400rpx;
  top: 300rpx;
  left: -200rpx;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  animation: orbFloat 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300rpx;
  height: 300rpx;
  bottom: 200rpx;
  right: -100rpx;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.1), transparent 70%);
  animation: orbFloat 12s ease-in-out infinite;
  animation-delay: 3s;
}

.header {
  position: relative;
  z-index: 2;
  padding: 0 32rpx;
  padding-top: calc(32rpx + env(safe-area-inset-top));
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 36rpx;
}

.greeting-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.greeting-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 400;
  letter-spacing: 1rpx;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.logo {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
}

.logo-orbit {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2rpx solid transparent;
  border-radius: 50%;
}

.orbit-1 {
  border-top-color: var(--color-accent-primary);
  border-right-color: var(--color-accent-primary);
  animation: orbitSpin 6s linear infinite;
}

.orbit-2 {
  border-bottom-color: var(--color-accent-secondary);
  border-left-color: var(--color-accent-secondary);
  animation: orbitSpin 8s linear infinite reverse;
  top: -4rpx;
  left: -4rpx;
  width: calc(100% + 8rpx);
  height: calc(100% + 8rpx);
}

.logo-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32rpx;
  height: 32rpx;
  background: linear-gradient(145deg, var(--color-accent-primary), var(--color-accent-secondary));
  border-radius: 50%;
  box-shadow:
    0 0 20rpx rgba(139, 92, 246, 0.4),
    0 0 40rpx rgba(139, 92, 246, 0.2);
  animation: corePulse 2.5s ease-in-out infinite;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 2rpx;
  line-height: 1.2;
}

.brand-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4rpx;
  letter-spacing: 2rpx;
}

.points-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.06) 100%);
  padding: 14rpx 24rpx;
  border-radius: 100rpx;
  border: 1rpx solid rgba(251, 191, 36, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.96);
    background: rgba(251, 191, 36, 0.15);
  }
}

.points-spark {
  width: 24rpx;
  height: 24rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    animation: sparkPulse 2s ease-in-out infinite;
  }
}

.points-num {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-accent-gold);
  line-height: 1;
}

.points-unit {
  font-size: var(--font-size-xs);
  color: rgba(217, 119, 6, 0.6);
  font-weight: 500;
}

.stats-row {
  display: flex;
  align-items: center;
  background: linear-gradient(165deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.96) 100%);
  border-radius: 28rpx;
  padding: 28rpx 12rpx;
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2rpx;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2), transparent);
  }
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.stat-icon-wrap {
  width: 44rpx;
  height: 44rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;

  &.purple {
    background: rgba(139, 92, 246, 0.1);
  }

  &.gold {
    background: rgba(251, 191, 36, 0.1);
  }

  &.green {
    background: rgba(16, 185, 129, 0.1);
  }
}

.stat-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  box-shadow: 0 0 8rpx rgba(139, 92, 246, 0.4);
}

.stat-star {
  width: 16rpx;
  height: 16rpx;
  background: linear-gradient(135deg, #fbbf24, #d97706);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  box-shadow: 0 0 8rpx rgba(251, 191, 36, 0.5);
}

.stat-ring {
  width: 14rpx;
  height: 14rpx;
  border: 3rpx solid rgba(16, 185, 129, 0.6);
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4rpx;
    height: 4rpx;
    background: rgba(16, 185, 129, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 400;
}

.stat-divider {
  width: 1rpx;
  height: 56rpx;
  background: linear-gradient(180deg, transparent, var(--color-border-light), transparent);
}

.main-scroll {
  position: relative;
  z-index: 2;
  height: calc(100vh - 340rpx - env(safe-area-inset-top));
}

.main-content {
  padding: 32rpx 32rpx 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  position: relative;
}

.empty-orb {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.04));
  border: 2rpx solid rgba(139, 92, 246, 0.1);
  margin-bottom: 32rpx;
  position: relative;
  animation: emptyFloat 4s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40rpx;
    height: 40rpx;
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    border-radius: 50%;
    opacity: 0.3;
    animation: corePulse 2.5s ease-in-out infinite;
  }

  &.small {
    width: 80rpx;
    height: 80rpx;
    position: absolute;
    top: 40rpx;
    right: 80rpx;
    background: linear-gradient(145deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.04));
    border-color: rgba(251, 191, 36, 0.1);
    animation-delay: 1s;

    &::after {
      width: 20rpx;
      height: 20rpx;
      background: linear-gradient(135deg, #fbbf24, #d97706);
    }
  }
}

.empty-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.empty-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 56rpx;
  background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%);
  border-radius: 100rpx;
  box-shadow: 0 6rpx 24rpx rgba(139, 92, 246, 0.35);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.96);
    box-shadow: 0 3rpx 12rpx rgba(139, 92, 246, 0.3);
  }
}

.empty-action-text {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #fff;
  letter-spacing: 2rpx;
}

.section {
  margin-bottom: 36rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-label-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.section-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));

  &.gold {
    background: linear-gradient(135deg, #fbbf24, #d97706);
  }
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 1rpx;
}

.section-action-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  background: var(--color-accent-surface);
  border-radius: 100rpx;
  transition: all 0.2s ease;

  &:active {
    background: rgba(139, 92, 246, 0.1);
    transform: scale(0.96);
  }
}

.section-action-text {
  font-size: var(--font-size-xs);
  color: var(--color-accent-primary);
  font-weight: 500;
}

.refresh-icon {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid var(--color-accent-primary);
  border-top-color: transparent;
  border-radius: 50%;
  transition: all 0.3s ease;

  &.spinning {
    animation: spin 0.6s linear infinite;
  }
}

.arrow-icon {
  width: 12rpx;
  height: 12rpx;
  border-top: 2rpx solid var(--color-accent-primary);
  border-right: 2rpx solid var(--color-accent-primary);
  transform: rotate(45deg);
}

.insight-list {
  display: flex;
  flex-direction: column;
}

.insight-item {
  &:last-child {
    :deep(.insight-card) {
      margin-bottom: 0;
    }
  }
}

.dev-section {
  margin-top: 48rpx;
  padding-top: 24rpx;
  border-top: 1rpx dashed var(--color-border-light);
}

.dev-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 24rpx;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.4));
  border-radius: 20rpx;
  border: 1rpx dashed var(--color-border-light);
  transition: all 0.2s ease;

  &:active {
    background: rgba(139, 92, 246, 0.04);
    transform: scale(0.98);
  }
}

.dev-icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.06);
  border-radius: 12rpx;
}

.dev-icon {
  font-size: 28rpx;
}

.dev-info {
  flex: 1;
}

.dev-title {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 2rpx;
}

.dev-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.dev-arrow {
  width: 12rpx;
  height: 12rpx;
  border-top: 2rpx solid var(--color-text-muted);
  border-right: 2rpx solid var(--color-text-muted);
  transform: rotate(45deg);
  opacity: 0.5;
}

.bottom-spacer {
  height: 40rpx;
}

.animate-item {
  animation: fadeInUp 0.5s ease-out both;
  animation-delay: var(--delay, 0s);
}

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes corePulse {
  0%, 100% {
    box-shadow: 0 0 20rpx rgba(139, 92, 246, 0.4), 0 0 40rpx rgba(139, 92, 246, 0.2);
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    box-shadow: 0 0 28rpx rgba(139, 92, 246, 0.5), 0 0 56rpx rgba(139, 92, 246, 0.25);
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30rpx); }
}

@keyframes sparkPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16rpx); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
