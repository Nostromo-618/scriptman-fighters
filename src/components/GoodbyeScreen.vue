<template>
  <div class="goodbye-screen">
    <div class="goodbye-inner">
      <div>
        <div class="goodbye-icon-wrap">
          <i class="ph-duotone ph-hand-waving" aria-hidden="true"></i>
        </div>
        <h1 class="goodbye-title">Farewell</h1>
        <p class="goodbye-text">
          We're sorry to see you go. To protect both you and the project, accepting the disclaimer is required to use this application.
        </p>
      </div>

      <div style="padding-top: 2rem;">
        <p class="goodbye-text" style="font-size: 0.875rem; margin-bottom: 1rem;">
          Changed your mind? You can always return and review the terms again.
        </p>
        <VdButton variant="success" size="lg" @click="props.onReturn">
          <i class="ph-duotone ph-arrow-left" aria-hidden="true"></i>
          Return to Disclaimer
        </VdButton>
      </div>

      <p style="padding-top: 3rem; font-size: 0.75rem; color: var(--vd-text-secondary);">
        © 2025 ScriptMan Fighters Team
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VdButton } from "@vanduo-oss/vd3";

interface Props {
  onReturn: () => void;
}

const props = defineProps<Props>();
</script>

<style scoped>
.goodbye-inner :deep(.vd-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
