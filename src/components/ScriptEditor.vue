<template>
  <VdModal
    v-model:open="isOpen"
    size="xl"
    class="sf-modal sf-modal--script-editor"
    @close="onClose"
  >
    <VdCard class="script-editor-card sf-modal-scope">
      <template #header>
        <div class="script-editor-header">
          <div class="script-editor-top">
            <div class="script-editor-title-row">
              <h2 class="script-editor-title">✏️ Custom Fighter Script Editor</h2>

              <div class="script-editor-toggle">
                <VdSwitch v-model="sideBySideMode" size="sm" />
                <span>Side-by-Side</span>
              </div>

              <div v-if="!sideBySideMode" class="slot-switcher">
                <VdButton
                  size="sm"
                  :variant="activeSlot === 'slot1' ? 'success' : 'secondary'"
                  @click="switchSlot('slot1')"
                >
                  Script A
                </VdButton>
                <VdButton
                  size="sm"
                  :variant="activeSlot === 'slot2' ? 'success' : 'secondary'"
                  @click="switchSlot('slot2')"
                >
                  Script B
                </VdButton>
              </div>

              <VdBadge variant="secondary" class="script-lang-badge">JavaScript</VdBadge>
            </div>

            <VdButton variant="ghost" aria-label="Close editor" @click="onClose">
              <i class="ph-duotone ph-x" aria-hidden="true"></i>
            </VdButton>
          </div>

          <div class="script-editor-actions">
            <template v-if="!sideBySideMode">
              <VdButton
                size="sm"
                variant="secondary"
                @click="handleResetSlot(activeSlot)"
              >
                Load Default ({{ activeSlot === "slot1" ? "A" : "B" }})
              </VdButton>
              <VdButton
                size="sm"
                variant="secondary"
                @click="handleImportSlot(activeSlot)"
              >
                Import ({{ activeSlot === "slot1" ? "A" : "B" }})
              </VdButton>
              <VdButton
                size="sm"
                variant="secondary"
                @click="handleExportSlot(activeSlot)"
              >
                Export ({{ activeSlot === "slot1" ? "A" : "B" }})
              </VdButton>
            </template>
            <VdButton
              size="sm"
              variant="success"
              :disabled="hasAnyError || isSaving"
              @click="handleSave"
            >
              {{ isSaving ? "Saving..." : "Save & Close" }}
            </VdButton>
          </div>

          <div class="script-editor-warning">
            <i class="ph-duotone ph-shield-warning" aria-hidden="true"></i>
            <span>
              <strong>Security:</strong> Only run scripts you understand. Never paste code from untrusted sources.
            </span>
          </div>

          <div class="script-editor-errors">
            <template v-if="sideBySideMode">
              <div
                :class="[
                  'script-error-box',
                  errorA ? 'script-error-box--invalid' : 'script-error-box--valid',
                ]"
              >
                <span style="color: var(--vd-text-secondary); margin-right: 0.5rem;">A:</span>
                {{ errorA || "✓ Valid" }}
              </div>
              <div
                :class="[
                  'script-error-box',
                  errorB ? 'script-error-box--invalid' : 'script-error-box--valid',
                ]"
              >
                <span style="color: var(--vd-text-secondary); margin-right: 0.5rem;">B:</span>
                {{ errorB || "✓ Valid" }}
              </div>
            </template>
            <div
              v-else
              :class="[
                'script-error-box',
                currentError ? 'script-error-box--invalid' : 'script-error-box--valid',
              ]"
            >
              {{ currentError || "✓ Script is valid" }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="isLoading" class="script-editor-loading">
        <VdProgress :indeterminate="true" />
        <span style="color: var(--vd-text-secondary); font-size: 0.875rem;">
          Loading Script Editor...
        </span>
      </div>

      <div v-else class="script-editor-body">
        <template v-if="sideBySideMode">
          <div class="script-editor-pane">
            <div class="script-editor-pane-header">
              <span class="script-editor-pane-title--a">Script A (Strategic)</span>
              <div class="script-editor-actions">
                <VdButton size="sm" variant="ghost" @click="handleResetSlot('slot1')">
                  Load Default
                </VdButton>
                <VdButton size="sm" variant="ghost" @click="handleImportSlot('slot1')">
                  Import
                </VdButton>
                <VdButton size="sm" variant="ghost" @click="handleExportSlot('slot1')">
                  Export
                </VdButton>
              </div>
            </div>
            <div class="script-editor-code">
              <VdCodeEditor v-model="codeA" language="javascript" wrap />
            </div>
          </div>

          <div class="script-editor-pane">
            <div class="script-editor-pane-header">
              <span class="script-editor-pane-title--b">Script B (Chaotic)</span>
              <div class="script-editor-actions">
                <VdButton size="sm" variant="ghost" @click="handleResetSlot('slot2')">
                  Load Default
                </VdButton>
                <VdButton size="sm" variant="ghost" @click="handleImportSlot('slot2')">
                  Import
                </VdButton>
                <VdButton size="sm" variant="ghost" @click="handleExportSlot('slot2')">
                  Export
                </VdButton>
              </div>
            </div>
            <div class="script-editor-code">
              <VdCodeEditor v-model="codeB" language="javascript" wrap />
            </div>
          </div>
        </template>

        <template v-else>
          <div class="script-editor-pane" style="width: 100%;">
            <div class="script-editor-code">
              <VdCodeEditor v-model="activeCode" language="javascript" wrap />
            </div>
          </div>
        </template>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        hidden
        @change="handleFileChange"
      />
    </VdCard>
  </VdModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import {
  VdModal,
  VdCard,
  VdButton,
  VdSwitch,
  VdBadge,
  VdProgress,
} from "@vanduo-oss/vd3";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import {
  getDefaultTemplate,
  loadScript,
  saveScript,
  exportScript,
  importScript,
  compileScript,
} from "@/services/CustomScriptRunner";

interface Props {
  modelValue: boolean;
  onSave?: (code: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onSave: () => {},
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [code: string];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const codeA = ref("");
const codeB = ref("");
const errorA = ref<string | null>(null);
const errorB = ref<string | null>(null);
const isSaving = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < 768;
const sideBySideMode = ref(!isMobileViewport());
const activeSlot = ref<"slot1" | "slot2">("slot1");
const isLoading = ref(false);

const activeCode = computed({
  get: () => (activeSlot.value === "slot1" ? codeA.value : codeB.value),
  set: (value: string) => {
    if (activeSlot.value === "slot1") codeA.value = value;
    else codeB.value = value;
  },
});

const currentError = computed(() =>
  activeSlot.value === "slot1" ? errorA.value : errorB.value,
);

const hasAnyError = computed(() => {
  if (sideBySideMode.value) return !!errorA.value || !!errorB.value;
  return !!currentError.value;
});

const switchSlot = (slot: "slot1" | "slot2") => {
  activeSlot.value = slot;
};

watch(isOpen, (open, prevOpen) => {
  if (open && !prevOpen) {
    codeA.value = loadScript("slot1");
    codeB.value = loadScript("slot2");
    errorA.value = null;
    errorB.value = null;
    sideBySideMode.value = !isMobileViewport();
    isLoading.value = false;
  }
});

watch(codeA, () => {
  if (codeA.value) {
    const result = compileScript(codeA.value);
    errorA.value = result.error || null;
  }
});

watch(codeB, () => {
  if (codeB.value) {
    const result = compileScript(codeB.value);
    errorB.value = result.error || null;
  }
});

onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen.value) return;
    if (e.key === "Escape") {
      emit("update:modelValue", false);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
});

const handleSave = () => {
  isSaving.value = true;
  saveScript(codeA.value, "slot1");
  saveScript(codeB.value, "slot2");
  props.onSave(codeA.value);
  emit("save", codeA.value);
  isSaving.value = false;
  emit("update:modelValue", false);
};

const pendingImportSlot = ref<"slot1" | "slot2">("slot1");

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result as string;
    const importedCode = importScript(content);
    if (importedCode) {
      const targetSlot = pendingImportSlot.value;
      if (targetSlot === "slot1") codeA.value = importedCode;
      else codeB.value = importedCode;
    } else {
      alert("Invalid script file. Please select a valid exported script.");
    }
  };
  reader.readAsText(file);
  (e.target as HTMLInputElement).value = "";
};

const handleResetSlot = (slot: "slot1" | "slot2") => {
  const slotLabel = slot === "slot1" ? "Script A" : "Script B";
  if (
    confirm(
      `Load default template for ${slotLabel}? Your current code will be replaced.`,
    )
  ) {
    const template = getDefaultTemplate(slot);
    if (slot === "slot1") {
      codeA.value = template;
      saveScript(template, "slot1");
    } else {
      codeB.value = template;
      saveScript(template, "slot2");
    }
  }
};

const handleImportSlot = (slot: "slot1" | "slot2") => {
  pendingImportSlot.value = slot;
  fileInputRef.value?.click();
};

const handleExportSlot = (slot: "slot1" | "slot2") => {
  exportScript(slot === "slot1" ? codeA.value : codeB.value);
};

const onClose = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.script-editor-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.script-editor-card :deep(.vd-card-body) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.script-lang-badge {
  display: none;
}

@media (min-width: 640px) {
  .script-lang-badge {
    display: inline-flex;
  }
}
</style>
