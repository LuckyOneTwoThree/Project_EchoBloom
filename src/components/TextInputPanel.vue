<template>
  <view class="input-panel">
    <view class="input-header">
      <text class="header-title">快速记录</text>
      <view class="close-btn" @click="emit('close')">
        <text class="close-icon">×</text>
      </view>
    </view>
    <textarea
      v-model="content"
      class="input-area"
      placeholder="输入你的灵感..."
      placeholder-class="placeholder"
      :maxlength="500"
      auto-height
      focus
    />
    <view class="input-footer">
      <view class="char-count">
        {{ content.length }}/500
      </view>
      <view class="submit-btn" :class="{ active: content.trim().length > 0 }" @click="submit">
        <text class="submit-text">保存灵感</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', content: string): void
}>()

const content = ref('')

function submit() {
  if (content.value.trim()) {
    emit('submit', content.value.trim())
    content.value = ''
  }
}
</script>

<style lang="scss" scoped>
.input-panel {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-hover);
  border-radius: 50%;
}

.close-icon {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  line-height: 1;
}

.input-area {
  width: 100%;
  min-height: 200rpx;
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border: 1rpx solid rgba(168, 85, 247, 0.15);
  resize: none;
}

.placeholder {
  color: var(--color-text-muted);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
}

.char-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.submit-btn {
  background-color: var(--color-bg-hover);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-base);
  transition: all 0.2s ease;
  
  &.active {
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    
    .submit-text {
      color: var(--color-text-primary);
    }
  }
}

.submit-text {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-muted);
}
</style>
