<template>
  <view class="recording-container">
    <view 
      class="recording-button"
      :class="{ recording: isRecording, 'recording-long': recordingTime > 2000 }"
      @click="toggleRecording"
    >
      <view class="button-inner">
        <view class="wave-container" v-if="isRecording">
          <view class="wave wave-1"></view>
          <view class="wave wave-2"></view>
          <view class="wave wave-3"></view>
        </view>
        <view class="mic-icon" v-else>
          <view class="mic-body"></view>
          <view class="mic-top"></view>
        </view>
      </view>
      <view class="recording-indicator" v-if="isRecording">
        <view class="pulse"></view>
      </view>
    </view>
    <view class="recording-hint" v-if="isRecording">
      {{ formatTime(recordingTime) }}
    </view>
    <view class="recording-hint" v-else>
      {{ hintText }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'record-start'): void
  (e: 'record-stop', duration: number): void
}>()

const isRecording = ref(false)
const recordingTime = ref(0)
let timer: number | null = null

const hintText = computed(() => {
  return '点击录音，再次点击停止'
})

function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

function startRecording() {
  isRecording.value = true
  recordingTime.value = 0
  emit('record-start')
  
  timer = setInterval(() => {
    recordingTime.value += 100
  }, 100) as unknown as number
}

function stopRecording() {
  if (isRecording.value) {
    isRecording.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    emit('record-stop', recordingTime.value)
  }
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.recording-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.recording-button {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-glow);
  
  &:active {
    transform: scale(0.95);
  }
  
  &.recording {
    background: linear-gradient(135deg, var(--color-error), #dc2626);
    animation: pulse 1s ease-in-out infinite;
  }
  
  &.recording-long {
    width: 220rpx;
    height: 220rpx;
  }
}

.button-inner {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mic-icon {
  position: relative;
  width: 60rpx;
  height: 80rpx;
  
  .mic-body {
    width: 100%;
    height: 60rpx;
    background: white;
    border-radius: 30rpx 30rpx 10rpx 10rpx;
  }
  
  .mic-top {
    position: absolute;
    top: -10rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 30rpx;
    height: 20rpx;
    background: white;
    border-radius: 5rpx;
  }
}

.wave-container {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 40rpx;
}

.wave {
  width: 8rpx;
  background: white;
  border-radius: 4rpx;
  animation: wave 0.5s ease-in-out infinite alternate;
  
  &.wave-1 {
    height: 20rpx;
    animation-delay: 0s;
  }
  
  &.wave-2 {
    height: 35rpx;
    animation-delay: 0.1s;
  }
  
  &.wave-3 {
    height: 25rpx;
    animation-delay: 0.2s;
  }
}

.recording-indicator {
  position: absolute;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(239, 68, 68, 0.3);
  animation: ring 1.5s ease-out infinite;
}

.pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  animation: pulse 1.5s ease-out infinite;
}

.recording-hint {
  margin-top: 40rpx;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@keyframes wave {
  from {
    transform: scaleY(0.5);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes ring {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes pulse {
  from {
    transform: scale(0.8);
    opacity: 0.8;
  }
  to {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>
