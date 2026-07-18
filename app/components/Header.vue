<template>
  <div class="app-header">
    <div class="app-header__inner">
      <div class="app-header__copy">
        <span class="app-header__title">MyGO表情包搜尋器</span>
        <span class="app-header__subtitle">一輩子跟我一起MyGO嗎</span>
      </div>
      <button-color />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
})
</script>

<style scoped>
.app-header {
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 24px 32px;
  background: var(--bg-sub);
}

.app-header__inner {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.app-header__copy {
  min-width: 0;
}

.app-header__title,
.app-header__subtitle {
  display: block;
  color: var(--font-default);
}

.app-header__title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.app-header__subtitle {
  font-size: 16px;
  line-height: 1.5;
}

.app-header__subtitle {
  margin-top: 4px;
}

@media (max-width: 480px) {
  .app-header {
    padding-right: max(20px, env(safe-area-inset-right));
    padding-left: max(20px, env(safe-area-inset-left));
  }

  .app-header__inner {
    gap: 12px;
  }

  .app-header__title {
    font-size: clamp(24px, 7vw, 28px);
    line-height: 1.2;
    white-space: nowrap;
  }
}
</style>
