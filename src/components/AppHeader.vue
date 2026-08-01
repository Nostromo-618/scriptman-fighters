<script setup lang="ts">
import { ref } from "vue";
import { VdThemeSwitcher, VdOffcanvas } from "@vanduo-oss/vd3";
import AppLogo from "./AppLogo.vue";
import AboutModal from "./AboutModal.vue";

const mobileMenuOpen = ref(false);
const aboutModalOpen = ref(false);

const REPO_URL = "https://github.com/Nostromo-618/scriptman-fighters";

function openAboutModal() {
  mobileMenuOpen.value = false;
  aboutModalOpen.value = true;
}

function fromMenu(action: () => void) {
  mobileMenuOpen.value = false;
  action();
}
</script>

<template>
  <header class="app-header">
    <div class="app-header-inner">
      <button type="button" class="app-logo" @click="aboutModalOpen = true">
        <AppLogo />
      </button>

      <div class="header-right">
        <VdThemeSwitcher id="theme-toggle-btn" :menu="false" />

        <div class="header-controls">
          <button
            type="button"
            class="header-icon-btn"
            aria-label="About Scriptman Fighters"
            @click="aboutModalOpen = true"
          >
            <i class="ph-duotone ph-info" aria-hidden="true"></i>
          </button>
          <a
            class="header-icon-btn"
            :href="REPO_URL"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i class="ph-duotone ph-github-logo" aria-hidden="true"></i>
          </a>
        </div>

        <button
          type="button"
          class="header-icon-btn mobile-menu-toggle"
          aria-label="Open header menu"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          @click="mobileMenuOpen = true"
        >
          <i class="ph-duotone ph-list" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <VdOffcanvas v-model="mobileMenuOpen" placement="right">
      <nav class="header-menu" aria-label="Header menu">
        <button type="button" class="header-menu-item" @click="fromMenu(openAboutModal)">
          <i class="ph-duotone ph-info" aria-hidden="true"></i>
          <span>About</span>
        </button>
        <a
          class="header-menu-item"
          :href="REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          @click="mobileMenuOpen = false"
        >
          <i class="ph-duotone ph-github-logo" aria-hidden="true"></i>
          <span>GitHub</span>
          <i class="ph-duotone ph-arrow-square-out" aria-hidden="true" style="margin-left: auto; font-size: 0.875rem;"></i>
        </a>
      </nav>
    </VdOffcanvas>
  </header>

  <AboutModal v-model:open="aboutModalOpen" :show-trigger="false" />
</template>
