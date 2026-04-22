<template>
  <view class="custom-tabbar">
    <view 
      class="tab-item" 
      :class="{ active: currentIndex === 0 }"
      @click="switchTab(0)"
    >
      <view class="tab-icon-wrapper">
        <view class="home-icon">
          <view class="home-shape">
            <view class="home-roof"></view>
            <view class="home-body"></view>
          </view>
          <view class="icon-glow" v-if="currentIndex === 0"></view>
        </view>
      </view>
      <text class="tab-text">首页</text>
    </view>
    <view 
      class="tab-item capture"
      :class="{ active: currentIndex === 1 }"
      @click="switchTab(1)"
    >
      <view class="capture-wrapper">
        <view class="capture-btn">
          <view class="capture-inner">
            <view class="mic-icon">
              <view class="mic-shape"></view>
            </view>
            <text class="capture-text">捕捉</text>
          </view>
        </view>
      </view>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: currentIndex === 2 }"
      @click="switchTab(2)"
    >
      <view class="tab-icon-wrapper">
        <view class="star-icon">
          <view class="star-shape"></view>
          <view class="icon-glow" v-if="currentIndex === 2"></view>
        </view>
      </view>
      <text class="tab-text">星云</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  current: number
}>()

const currentIndex = ref(props.current)

watch(() => props.current, (val) => {
  currentIndex.value = val
})

function switchTab(index: number) {
  currentIndex.value = index
  const pages = ['/pages/index/index', '/pages/capture/capture', '/pages/garden/garden']
  uni.reLaunch({
    url: pages[index]
  })
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: calc(128rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.99) 100%);
  border-top: 1rpx solid rgba(139, 92, 246, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 
    0 -4rpx 20rpx rgba(0, 0, 0, 0.04),
    0 -1rpx 4rpx rgba(0, 0, 0, 0.03);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  padding-bottom: 12rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.capture {
    flex: 0 0 auto;
    width: 120rpx;
    padding-bottom: 0;
  }
  
  &.active {
    .tab-text {
      color: var(--color-accent-primary);
      font-weight: 600;
    }
    
    .home-icon .home-roof {
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    }
    
    .home-icon .home-body {
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    }
    
    .star-icon .star-shape {
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    }
  }
}

.tab-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.9);
  }
}

.home-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-icon .home-shape {
  position: relative;
  width: 100%;
  height: 100%;
}

.home-icon .home-roof {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20rpx solid transparent;
  border-right: 20rpx solid transparent;
  border-bottom: 16rpx solid var(--color-text-secondary);
  transition: all 0.3s ease;
}

.home-icon .home-body {
  position: absolute;
  bottom: 2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 30rpx;
  height: 20rpx;
  background-color: var(--color-text-secondary);
  border-radius: 3rpx;
  transition: all 0.3s ease;
}

.star-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon .star-shape {
  width: 100%;
  height: 100%;
  background-color: var(--color-text-secondary);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  transition: all 0.3s ease;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52rpx;
  height: 52rpx;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent);
  border-radius: 50%;
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0;
  }
}

.capture-wrapper {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.capture-btn {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  z-index: 2;
}

.capture-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 50%, #4f46e5 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8rpx 32rpx rgba(139, 92, 246, 0.5),
    0 4rpx 12rpx rgba(99, 102, 241, 0.3),
    inset 0 -6rpx 16rpx rgba(0, 0, 0, 0.25),
    inset 0 6rpx 16rpx rgba(255, 255, 255, 0.3);
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  transform: translateY(-10rpx);
  transition: all var(--transition-normal);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8rpx;
    left: 8rpx;
    right: 8rpx;
    bottom: 8rpx;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  &:active {
    transform: translateY(-6rpx) scale(0.94);
    box-shadow: 
      0 4rpx 16rpx rgba(139, 92, 246, 0.4),
      inset 0 -4rpx 12rpx rgba(0, 0, 0, 0.25),
      inset 0 4rpx 12rpx rgba(255, 255, 255, 0.25);
  }
}

.mic-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.mic-icon .mic-shape {
  width: 18rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 9rpx 9rpx 4rpx 4rpx;
  position: relative;
  box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.25);
  
  &::before {
    content: '';
    position: absolute;
    top: -5rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 14rpx;
    height: 8rpx;
    background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
    border-radius: 3rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.25);
  }
}

.capture-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.tab-text {
  font-size: 22rpx;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all 0.3s ease;
  letter-spacing: 0.5rpx;
}
</style>
