<template>
  <view class="insight-page" v-if="insight">
    <view class="page-bg-orb orb-1"></view>
    <view class="page-bg-orb orb-2"></view>

    <view class="insight-header">
      <view class="back-btn" @click="goBack">
        <view class="back-arrow"></view>
      </view>
      <view class="header-actions">
        <view class="action-btn" @click="editInsight">
          <view class="edit-icon"></view>
        </view>
        <view class="action-btn" @click="shareInsight">
          <view class="share-icon"></view>
        </view>
      </view>
    </view>

    <scroll-view class="insight-scroll" scroll-y enhanced :show-scrollbar="false">
      <view class="insight-content">
        <view class="hero-card" :class="luminosityClass">
          <view class="hero-glow"></view>
          <view class="hero-particles">
            <view class="particle p1"></view>
            <view class="particle p2"></view>
            <view class="particle p3"></view>
          </view>
          <view class="hero-quote-mark">"</view>
          <text class="hero-text">{{ insight.content }}</text>
          <view class="hero-footer">
            <view class="luminosity-chip" :class="luminosityClass">
              <view class="chip-dot"></view>
              <text class="chip-label">{{ luminosityLabel }}</text>
              <view class="chip-divider"></view>
              <text class="chip-value">{{ insight.luminosity }}</text>
            </view>
            <text class="hero-date">{{ formatDate(insight.createdAt) }}</text>
          </view>
        </view>

        <view class="stats-row animate-item" style="--delay: 0.1s">
          <view class="stat-card">
            <view class="stat-icon-wrap wake">
              <view class="stat-icon-wake"></view>
            </view>
            <text class="stat-num">{{ insight.wakeCount }}</text>
            <text class="stat-desc">唤醒</text>
          </view>
          <view class="stat-card">
            <view class="stat-icon-wrap interact">
              <view class="stat-icon-interact"></view>
            </view>
            <text class="stat-num">{{ insight.interactionCount }}</text>
            <text class="stat-desc">互动</text>
          </view>
          <view class="stat-card">
            <view class="stat-icon-wrap link">
              <view class="stat-icon-link"></view>
            </view>
            <text class="stat-num">{{ insight.associations.length }}</text>
            <text class="stat-desc">关联</text>
          </view>
        </view>

        <view class="tags-section animate-item" style="--delay: 0.15s">
          <view class="section-label-row">
            <view class="section-dot"></view>
            <text class="section-label">标签</text>
          </view>
          <view class="tags-wrap">
            <view class="tag-chip" v-for="(tag, idx) in insight.tags" :key="tag" :style="{ '--tag-hue': tagHues[idx % tagHues.length] }">
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
        </view>

        <view class="related-section animate-item" style="--delay: 0.2s" v-if="relatedInsights.length > 0">
          <view class="section-label-row">
            <view class="section-dot"></view>
            <text class="section-label">关联灵感</text>
            <text class="section-count">{{ relatedInsights.length }}</text>
          </view>
          <view class="related-cards">
            <view
              class="related-card"
              v-for="rel in relatedInsights"
              :key="rel.id"
              @click="openInsight(rel.id)"
            >
              <view class="related-card-accent" :class="getLuminosityClass(rel.luminosity)"></view>
              <view class="related-card-body">
                <view class="related-type-badge">
                  <text class="related-type-text">{{ getAssociationType(rel.id) }}</text>
                </view>
                <text class="related-text">{{ rel.summary || rel.content.slice(0, 50) }}</text>
                <view class="related-card-footer">
                  <view class="related-lum-dot" :class="getLuminosityClass(rel.luminosity)"></view>
                  <text class="related-lum-val">{{ rel.luminosity }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="history-section animate-item" style="--delay: 0.25s" v-if="insight.versions.length > 0">
          <view class="section-label-row">
            <view class="section-dot"></view>
            <text class="section-label">版本历史</text>
            <text class="section-count">{{ insight.versions.length }}</text>
          </view>
          <view class="timeline">
            <view class="timeline-line"></view>
            <view class="timeline-item" v-for="(version, index) in insight.versions" :key="version.id">
              <view class="timeline-node">
                <view class="node-inner"></view>
              </view>
              <view class="timeline-card">
                <view class="timeline-card-header">
                  <text class="version-label">v{{ insight.versions.length - index }}</text>
                  <text class="version-date">{{ formatDate(version.createdAt) }}</text>
                </view>
                <text class="version-content">{{ version.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>

    <view class="insight-footer">
      <view class="footer-inner">
        <view class="footer-btn secondary" @click="markValuable">
          <view class="footer-btn-icon spark"></view>
          <text class="footer-btn-text">仍有价值</text>
        </view>
        <view class="footer-btn primary" @click="addVersion">
          <view class="footer-btn-icon plus"></view>
          <text class="footer-btn-text">补充想法</text>
        </view>
      </view>
    </view>

    <view class="modal-mask" v-if="showVersionInput" @click.self="showVersionInput = false">
      <view class="modal-sheet" :class="{ show: showVersionInput }">
        <view class="modal-handle"></view>
        <view class="modal-header">
          <text class="modal-title">补充想法</text>
          <view class="modal-close" @click="showVersionInput = false">
            <view class="close-x"></view>
          </view>
        </view>
        <view class="modal-body">
          <textarea
            v-model="versionContent"
            class="modal-input"
            placeholder="记录新的思考..."
            placeholder-class="input-placeholder"
            :maxlength="500"
            auto-height
          />
          <view class="modal-char-count">
            <text class="char-text">{{ versionContent.length }}/500</text>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-btn-submit" @click="submitVersion">
            <text class="modal-btn-text">保存</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInsightStore } from '@/stores/insight'
import type { Insight } from '@/types'

const insightStore = useInsightStore()

const insight = ref<Insight | null>(null)
const showVersionInput = ref(false)
const versionContent = ref('')

const tagHues = [270, 220, 340, 180, 30, 150]

const luminosityClass = computed(() => {
  if (!insight.value) return 'low'
  return insightStore.getLuminosityLevel(insight.value.luminosity)
})

const luminosityLabel = computed(() => {
  const level = insightStore.getLuminosityLevel(insight.value?.luminosity || 0)
  const labels: Record<string, string> = {
    low: '微光',
    medium: '星光',
    high: '鎏金'
  }
  return labels[level] || '微光'
})

const relatedInsights = computed(() => {
  if (!insight.value) return []
  return insightStore.getRelatedInsights(insight.value.id)
})

function getLuminosityClass(luminosity: number): string {
  return insightStore.getLuminosityLevel(luminosity)
}

function getAssociationType(id: string): string {
  if (!insight.value) return ''
  const assoc = insight.value.associations.find(a => a.insightId === id)
  return assoc ? insightStore.getAssociationLabel(assoc.type) : ''
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}

function goBack() {
  uni.navigateBack()
}

function openInsight(id: string) {
  uni.redirectTo({
    url: `/pages/insight/insight?id=${id}`
  })
}

function editInsight() {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}

function shareInsight() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

function markValuable() {
  if (insight.value) {
    insightStore.interactInsight(insight.value.id)
    uni.showToast({ title: '光度+5', icon: 'success' })
    insight.value = insightStore.getInsightById(insight.value.id) || null
  }
}

function addVersion() {
  showVersionInput.value = true
}

function submitVersion() {
  if (versionContent.value.trim() && insight.value) {
    insightStore.addVersion(insight.value.id, versionContent.value.trim())
    showVersionInput.value = false
    versionContent.value = ''
    insight.value = insightStore.getInsightById(insight.value.id) || null
    uni.showToast({ title: '版本已保存', icon: 'success' })
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as { options?: { id?: string } }
  const id = currentPage.options?.id

  if (id) {
    insight.value = insightStore.getInsightById(id) || null
  }
})
</script>

<style lang="scss" scoped>
.insight-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-gradient-start) 0%, var(--color-bg-primary) 40%);
  position: relative;
  overflow: hidden;
}

.page-bg-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100rpx);
  opacity: 0.25;
  z-index: 0;
}

.orb-1 {
  width: 500rpx;
  height: 500rpx;
  top: -160rpx;
  right: -120rpx;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%);
}

.orb-2 {
  width: 400rpx;
  height: 400rpx;
  bottom: 240rpx;
  left: -180rpx;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
}

.insight-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 32rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.88) 100%);
  border-radius: 50%;
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
    background: rgba(248, 250, 252, 0.96);
  }
}

.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 3rpx solid var(--color-text-secondary);
  border-bottom: 3rpx solid var(--color-text-secondary);
  transform: rotate(45deg) translate(2rpx, -2rpx);
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.88) 100%);
  border-radius: 50%;
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
    background: rgba(248, 250, 252, 0.96);
  }
}

.edit-icon {
  width: 28rpx;
  height: 28rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 22rpx;
    height: 3rpx;
    background: var(--color-text-muted);
    border-radius: 2rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 5rpx solid var(--color-text-muted);
    border-right: 5rpx solid transparent;
    border-top: 5rpx solid transparent;
    border-bottom: 5rpx solid transparent;
    bottom: -1rpx;
    left: 1rpx;
    transform: rotate(-45deg);
  }
}

.share-icon {
  width: 24rpx;
  height: 24rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 14rpx;
    height: 14rpx;
    border: 2rpx solid var(--color-text-muted);
    border-radius: 50%;
    top: 0;
    right: 0;
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-bottom: 10rpx solid var(--color-text-muted);
    bottom: 0;
    left: 0;
  }
}

.insight-scroll {
  position: relative;
  z-index: 5;
  height: calc(100vh - 140rpx - env(safe-area-inset-top));
}

.insight-content {
  padding: 0 32rpx;
}

.hero-card {
  position: relative;
  border-radius: 36rpx;
  padding: 56rpx 40rpx 40rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  background: linear-gradient(165deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.98) 100%);
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-base);
  animation: heroFadeIn 0.6s ease-out;

  &.low {
    .hero-glow {
      background: radial-gradient(ellipse at 30% 20%, rgba(148, 163, 184, 0.08) 0%, transparent 60%);
    }

    .hero-quote-mark {
      color: rgba(148, 163, 184, 0.12);
    }

    .particle {
      background: rgba(148, 163, 184, 0.25);
    }
  }

  &.medium {
    border-color: rgba(251, 191, 36, 0.2);
    box-shadow: var(--shadow-base), 0 0 40rpx rgba(251, 191, 36, 0.06);

    .hero-glow {
      background: radial-gradient(ellipse at 30% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 60%);
    }

    .hero-quote-mark {
      color: rgba(251, 191, 36, 0.15);
    }

    .particle {
      background: rgba(251, 191, 36, 0.35);
    }
  }

  &.high {
    border-color: rgba(245, 158, 11, 0.3);
    box-shadow: var(--shadow-lg), 0 0 60rpx rgba(245, 158, 11, 0.1);

    .hero-glow {
      background: radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 60%);
    }

    .hero-quote-mark {
      color: rgba(245, 158, 11, 0.18);
    }

    .particle {
      background: rgba(245, 158, 11, 0.4);
    }
  }
}

.hero-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particleFloat 6s ease-in-out infinite;

  &.p1 {
    width: 6rpx;
    height: 6rpx;
    top: 20%;
    right: 15%;
    animation-delay: 0s;
  }

  &.p2 {
    width: 4rpx;
    height: 4rpx;
    top: 60%;
    right: 25%;
    animation-delay: 2s;
  }

  &.p3 {
    width: 5rpx;
    height: 5rpx;
    bottom: 25%;
    left: 20%;
    animation-delay: 4s;
  }
}

.hero-quote-mark {
  position: absolute;
  top: 16rpx;
  left: 32rpx;
  font-size: 120rpx;
  font-family: Georgia, serif;
  line-height: 1;
  pointer-events: none;
}

.hero-text {
  position: relative;
  z-index: 2;
  font-size: 38rpx;
  color: var(--color-text-primary);
  line-height: 2;
  letter-spacing: 2rpx;
  font-weight: 500;
}

.hero-footer {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40rpx;
  padding-top: 28rpx;
  border-top: 1rpx solid var(--color-border-light);
}

.luminosity-chip {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 10rpx 20rpx;
  border-radius: 100rpx;

  &.low {
    background: rgba(148, 163, 184, 0.1);
    border: 1rpx solid rgba(148, 163, 184, 0.2);

    .chip-dot {
      background: linear-gradient(135deg, #94a3b8, #64748b);
    }

    .chip-label {
      color: #64748b;
    }

    .chip-divider {
      background: rgba(148, 163, 184, 0.25);
    }

    .chip-value {
      color: #64748b;
    }
  }

  &.medium {
    background: rgba(251, 191, 36, 0.1);
    border: 1rpx solid rgba(251, 191, 36, 0.25);

    .chip-dot {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      box-shadow: 0 0 8rpx rgba(251, 191, 36, 0.4);
      animation: dotPulse 2s ease-in-out infinite;
    }

    .chip-label {
      color: #b45309;
    }

    .chip-divider {
      background: rgba(251, 191, 36, 0.25);
    }

    .chip-value {
      color: #d97706;
    }
  }

  &.high {
    background: rgba(245, 158, 11, 0.12);
    border: 1rpx solid rgba(245, 158, 11, 0.3);

    .chip-dot {
      background: linear-gradient(135deg, #f59e0b, #b45309);
      box-shadow: 0 0 12rpx rgba(245, 158, 11, 0.5);
      animation: dotPulse 1.5s ease-in-out infinite;
    }

    .chip-label {
      color: #92400e;
    }

    .chip-divider {
      background: rgba(245, 158, 11, 0.25);
    }

    .chip-value {
      color: #b45309;
      font-weight: 700;
    }
  }
}

.chip-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.chip-label {
  font-size: 22rpx;
  font-weight: 500;
}

.chip-divider {
  width: 2rpx;
  height: 20rpx;
  border-radius: 1rpx;
}

.chip-value {
  font-size: 22rpx;
  font-weight: 600;
}

.hero-date {
  font-size: 22rpx;
  color: var(--color-text-muted);
  font-weight: 400;
}

.stats-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 28rpx 16rpx;
  background: linear-gradient(165deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.96) 100%);
  border-radius: 24rpx;
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.stat-icon-wrap {
  width: 48rpx;
  height: 48rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;

  &.wake {
    background: rgba(139, 92, 246, 0.1);
  }

  &.interact {
    background: rgba(59, 130, 246, 0.1);
  }

  &.link {
    background: rgba(16, 185, 129, 0.1);
  }
}

.stat-icon-wake {
  width: 20rpx;
  height: 20rpx;
  border: 3rpx solid rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6rpx;
    height: 6rpx;
    background: rgba(139, 92, 246, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}

.stat-icon-interact {
  width: 18rpx;
  height: 18rpx;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(59, 130, 246, 0.6);
  }

  &::before {
    top: 0;
    left: 0;
  }

  &::after {
    bottom: 0;
    right: 0;
  }
}

.stat-icon-link {
  width: 20rpx;
  height: 20rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 3rpx;
    background: rgba(16, 185, 129, 0.6);
    top: 50%;
    left: 0;
    transform: translateY(-50%) rotate(45deg);
    border-radius: 2rpx;
  }

  &::after {
    content: '';
    position: absolute;
    width: 8rpx;
    height: 8rpx;
    border: 2rpx solid rgba(16, 185, 129, 0.6);
    border-radius: 50%;
    top: -2rpx;
    right: -2rpx;
  }
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-desc {
  font-size: 20rpx;
  color: var(--color-text-muted);
  font-weight: 400;
}

.tags-section {
  margin-bottom: 36rpx;
}

.section-label-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.section-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.section-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 1rpx;
}

.section-count {
  font-size: 22rpx;
  color: var(--color-text-muted);
  margin-left: auto;
  background: var(--color-accent-surface);
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.tag-chip {
  padding: 12rpx 24rpx;
  border-radius: 100rpx;
  background: hsla(var(--tag-hue), 55%, 96%, 1);
  border: 1rpx solid hsla(var(--tag-hue), 55%, 80%, 0.4);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background: hsla(var(--tag-hue), 55%, 92%, 1);
  }
}

.tag-text {
  font-size: 24rpx;
  font-weight: 500;
  color: hsla(var(--tag-hue), 55%, 42%, 1);
}

.related-section {
  margin-bottom: 36rpx;
}

.related-cards {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.related-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.related-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 6rpx;
  height: 100%;
  border-radius: 3rpx 0 0 3rpx;

  &.low {
    background: linear-gradient(180deg, #94a3b8, #cbd5e1);
  }

  &.medium {
    background: linear-gradient(180deg, #d97706, #fbbf24);
    box-shadow: 0 0 10rpx rgba(251, 191, 36, 0.25);
  }

  &.high {
    background: linear-gradient(180deg, #b45309, #f59e0b);
    box-shadow: 0 0 14rpx rgba(245, 158, 11, 0.3);
  }
}

.related-card-body {
  padding: 28rpx 28rpx 28rpx 36rpx;
  background: linear-gradient(165deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.96) 100%);
  border: 1rpx solid var(--color-border-light);
  border-left: none;
  border-radius: 0 24rpx 24rpx 0;
  box-shadow: var(--shadow-sm);
}

.related-type-badge {
  display: inline-flex;
  margin-bottom: 12rpx;
}

.related-type-text {
  font-size: 20rpx;
  font-weight: 500;
  color: var(--color-accent-primary);
  background: var(--color-accent-surface);
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.related-text {
  font-size: 28rpx;
  color: var(--color-text-primary);
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.related-card-footer {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.related-lum-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;

  &.low {
    background: #94a3b8;
  }

  &.medium {
    background: #fbbf24;
    box-shadow: 0 0 6rpx rgba(251, 191, 36, 0.4);
  }

  &.high {
    background: #f59e0b;
    box-shadow: 0 0 8rpx rgba(245, 158, 11, 0.5);
  }
}

.related-lum-val {
  font-size: 20rpx;
  color: var(--color-text-muted);
  font-weight: 500;
}

.history-section {
  margin-bottom: 36rpx;
}

.timeline {
  position: relative;
  padding-left: 40rpx;
}

.timeline-line {
  position: absolute;
  left: 14rpx;
  top: 16rpx;
  bottom: 16rpx;
  width: 2rpx;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.06));
  border-radius: 1rpx;
}

.timeline-item {
  position: relative;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-node {
  position: absolute;
  left: -40rpx;
  top: 24rpx;
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-inner {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  box-shadow: 0 0 8rpx rgba(139, 92, 246, 0.3);
}

.timeline-card {
  padding: 24rpx 28rpx;
  background: linear-gradient(165deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.96) 100%);
  border-radius: 20rpx;
  border: 1rpx solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.version-label {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--color-accent-primary);
  background: var(--color-accent-surface);
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.version-date {
  font-size: 20rpx;
  color: var(--color-text-muted);
}

.version-content {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.bottom-spacer {
  height: 40rpx;
}

.insight-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, rgba(248, 250, 252, 0.92) 30%, rgba(255, 255, 255, 0.98) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.footer-inner {
  display: flex;
  gap: 16rpx;
  padding-top: 28rpx;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 26rpx 0;
  border-radius: 100rpx;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &.primary {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
    box-shadow: 0 6rpx 28rpx rgba(139, 92, 246, 0.35), 0 2rpx 8rpx rgba(99, 102, 241, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, transparent 100%);
      pointer-events: none;
    }

    .footer-btn-text {
      color: #ffffff;
      font-weight: 600;
    }

    &:active {
      transform: scale(0.96);
      box-shadow: 0 3rpx 16rpx rgba(139, 92, 246, 0.3);
    }
  }

  &.secondary {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.88) 100%);
    border: 1rpx solid var(--color-border-light);
    box-shadow: var(--shadow-sm);

    .footer-btn-text {
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    &:active {
      transform: scale(0.96);
      background: rgba(248, 250, 252, 0.96);
    }
  }
}

.footer-btn-icon {
  &.spark {
    width: 24rpx;
    height: 24rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16rpx;
      height: 16rpx;
      border: 3rpx solid var(--color-text-muted);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6rpx;
      height: 6rpx;
      background: var(--color-text-muted);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &.plus {
    width: 24rpx;
    height: 24rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18rpx;
      height: 3rpx;
      background: #ffffff;
      border-radius: 2rpx;
      transform: translate(-50%, -50%);
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 3rpx;
      height: 18rpx;
      background: #ffffff;
      border-radius: 2rpx;
      transform: translate(-50%, -50%);
    }
  }
}

.footer-btn-text {
  font-size: 28rpx;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  animation: maskFadeIn 0.25s ease;
}

.modal-sheet {
  width: 100%;
  background: linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-secondary) 100%);
  border-radius: 36rpx 36rpx 0 0;
  padding: 20rpx 36rpx;
  padding-bottom: calc(36rpx + env(safe-area-inset-bottom));
  transform: translateY(100%);
  animation: sheetSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-handle {
  width: 64rpx;
  height: 8rpx;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4rpx;
  margin: 0 auto 28rpx;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-close {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 50%;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
    background: rgba(0, 0, 0, 0.08);
  }
}

.close-x {
  width: 20rpx;
  height: 20rpx;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20rpx;
    height: 3rpx;
    background: var(--color-text-muted);
    border-radius: 2rpx;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

.modal-body {
  margin-bottom: 24rpx;
}

.modal-input {
  width: 100%;
  min-height: 200rpx;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.85) 100%);
  border-radius: 20rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: var(--color-text-primary);
  border: 1rpx solid var(--color-border-light);
  resize: none;
  line-height: 1.7;
  box-shadow: var(--shadow-sm);
}

.input-placeholder {
  color: var(--color-text-muted);
}

.modal-char-count {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}

.char-text {
  font-size: 20rpx;
  color: var(--color-text-muted);
}

.modal-actions {
  display: flex;
}

.modal-btn-submit {
  flex: 1;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
  padding: 26rpx 0;
  border-radius: 100rpx;
  text-align: center;
  box-shadow: 0 6rpx 28rpx rgba(139, 92, 246, 0.35);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, transparent 100%);
    pointer-events: none;
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 3rpx 16rpx rgba(139, 92, 246, 0.3);
  }
}

.modal-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.animate-item {
  animation: itemFadeInUp 0.5s ease-out both;
  animation-delay: var(--delay, 0s);
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes itemFadeInUp {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-16rpx) scale(1.3);
    opacity: 1;
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes maskFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes sheetSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
