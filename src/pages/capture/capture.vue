<template>
  <view class="capture-page">
    <view class="capture-header">
      <text class="header-title">捕捉灵感</text>
      <text class="header-subtitle">记录一次，复利一生</text>
    </view>
    
    <view class="capture-main">
      <RecordingButton 
        @record-start="handleRecordStart"
        @record-stop="handleRecordStop"
      />
      
      <view class="capture-options">
        <view class="option-btn" @click="showTextInput = true">
          <view class="option-icon">✏️</view>
          <text class="option-label">文字速记</text>
        </view>
        <view class="option-btn">
          <view class="option-icon">📷</view>
          <text class="option-label">图片识别</text>
        </view>
        <view class="option-btn">
          <view class="option-icon">🎙️</view>
          <text class="option-label">语音转写</text>
        </view>
      </view>
    </view>
    
    <view class="recent-section" v-if="recentInsights.length > 0">
      <view class="section-header">
        <text class="section-title">最近灵感</text>
      </view>
      <view class="recent-list">
        <view 
          class="recent-item" 
          v-for="insight in recentInsights" 
          :key="insight.id"
          @click="openInsight(insight.id)"
        >
          <text class="recent-content">{{ insight.summary || insight.content.slice(0, 30) }}...</text>
          <text class="recent-time">{{ formatTime(insight.createdAt) }}</text>
        </view>
      </view>
    </view>
    
    <view class="input-modal" v-if="showTextInput" @click.self="showTextInput = false">
      <TextInputPanel 
        @close="showTextInput = false"
        @submit="handleTextSubmit"
      />
    </view>
    
    <view class="processing-modal" v-if="isProcessing">
      <view class="processing-content">
        <view class="processing-spinner"></view>
        <text class="processing-text">AI 正在处理...</text>
        <text class="processing-subtext">{{ processingStep }}</text>
      </view>
    </view>
    
    <CustomTabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInsightStore } from '@/stores/insight'
import RecordingButton from '@/components/RecordingButton.vue'
import TextInputPanel from '@/components/TextInputPanel.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import type { Insight } from '@/types'

const insightStore = useInsightStore()

const showTextInput = ref(false)
const isProcessing = ref(false)
const processingStep = ref('')

const recentInsights = computed(() => {
  return [...insightStore.insights]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
})

function handleRecordStart() {
  processingStep.value = '正在录音...'
}

function handleRecordStop(duration: number) {
  if (duration < 500) {
    uni.showToast({ title: '录音时间太短', icon: 'none' })
    return
  }
  
  isProcessing.value = true
  processingStep.value = '正在转录...'
  
  setTimeout(() => {
    processingStep.value = '正在润色...'
  }, 800)
  
  setTimeout(() => {
    processingStep.value = '正在分类...'
  }, 1600)
  
  setTimeout(() => {
    const mockContent = generateMockContent()
    insightStore.addInsight(mockContent, mockContent)
    isProcessing.value = false
    uni.showToast({ title: '灵感已保存', icon: 'success' })
  }, 2400)
}

function generateMockContent(): string {
  const contents = [
    '用户体验的核心是减少认知负荷，让用户在无意识中完成操作',
    '极简主义不是减少功能，而是减少干扰，让核心价值更突出',
    '好的产品应该像氧气一样，存在但不被感知',
    '设计的目的不是追求美感，而是解决问题',
    '优秀的产品经理懂得在正确的时机说不',
    '数据是产品决策的指南针，但不是唯一依据',
    '用户的耐心比你想象的更短，必须在3秒内抓住注意力'
  ]
  return contents[Math.floor(Math.random() * contents.length)]
}

function handleTextSubmit(content: string) {
  insightStore.addInsight(content)
  showTextInput.value = false
  uni.showToast({ title: '灵感已保存', icon: 'success' })
}

function openInsight(id: string) {
  uni.navigateTo({
    url: `/pages/insight/insight?id=${id}`
  })
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}
</script>

<style lang="scss" scoped>
.capture-page {
  min-height: 100vh;
  background-color: var(--color-bg-primary);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.capture-header {
  text-align: center;
  padding: var(--spacing-xl);
  padding-top: calc(var(--spacing-xl) + env(safe-area-inset-top));
}

.header-title {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.capture-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
}

.capture-options {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-base);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1rpx solid rgba(147, 51, 234, 0.1);
  
  &:active {
    background-color: var(--color-bg-hover);
  }
}

.option-icon {
  font-size: 48rpx;
}

.option-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.recent-section {
  padding: 0 var(--spacing-lg);
}

.section-header {
  margin-bottom: var(--spacing-base);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.recent-list {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1rpx solid rgba(147, 51, 234, 0.1);
  overflow: hidden;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1rpx solid rgba(147, 51, 234, 0.08);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: var(--color-bg-hover);
  }
}

.recent-content {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  flex: 1;
  margin-right: var(--spacing-base);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.input-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

.input-modal .input-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.processing-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 200;
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-base);
}

.processing-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid rgba(168, 85, 247, 0.15);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.processing-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.processing-subtext {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
