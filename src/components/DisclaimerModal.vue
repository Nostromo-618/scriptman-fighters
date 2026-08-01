<template>
  <VdModal
    v-model:open="isModalOpen"
    size="xl"
    :close-on-backdrop="false"
    @update:open="handleOpenChange"
  >
    <template #header>
      <div>
        <h2 class="vd-h3" style="margin: 0;">Disclaimer & Terms of Use</h2>
        <p style="margin: 0.25rem 0 0; color: var(--vd-text-secondary); font-size: 0.875rem;">
          Last Updated: January , 2026
        </p>
      </div>
    </template>

    <div class="about-panel sf-modal-scope sf-modal-scope--disclaimer" style="padding-top: 0;">
      <div style="color: var(--vd-text-secondary); display: flex; flex-direction: column; gap: 1rem;">
        <section>
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Important Notice</h3>
          <p>
            <strong>ScriptMan Fighters</strong> is provided as an experimental, demonstration application for exploratory and educational purposes. By using this application, you acknowledge and agree to the following terms:
          </p>
        </section>

        <section>
          <h4 style="font-weight: 600; font-family: ui-monospace, monospace; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">No Warranties</h4>
          <p style="font-size: 0.875rem;">
            This software is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy.
          </p>
        </section>

        <section>
          <h4 style="font-weight: 600; font-family: ui-monospace, monospace; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">No Liability</h4>
          <p style="font-size: 0.875rem;">
            The developer(s) shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of productivity, or personal injury arising from the use or inability to use this application.
          </p>
        </section>

        <section>
          <h4 style="font-weight: 600; font-family: ui-monospace, monospace; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">User Responsibility</h4>
          <p style="font-size: 0.875rem;">
            You assume full responsibility for the use of this application, any consequences resulting from such use, and the security and backup of your data.
          </p>
        </section>

        <section>
          <h4 style="font-weight: 600; font-family: ui-monospace, monospace; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">Experimental Nature</h4>
          <p style="font-size: 0.875rem; font-style: italic;">
            The application may contain bugs, errors, or incomplete features. The developer(s) make no guarantees regarding functionality, performance, data persistence, or continued availability.
          </p>
        </section>

        <section>
          <h4 style="font-weight: 600; font-family: ui-monospace, monospace; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">Data Storage</h4>
          <p style="font-size: 0.875rem;">
            All data (scripts, settings, etc.) is stored locally on your device using browser localStorage. We are not responsible for data loss due to browser settings or updates.
          </p>
        </section>

        <p style="font-size: 0.875rem; font-weight: 500; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--vd-border-subtle);">
          By clicking "Accept", you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree, you must click "Decline".
        </p>
      </div>
    </div>

    <template #footer>
      <div class="disclaimer-modal-footer">
        <VdButton variant="secondary" @click="handleDecline">Decline</VdButton>
        <VdButton variant="success" @click="handleAccept">Accept & Continue</VdButton>
      </div>
    </template>
  </VdModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VdModal, VdButton } from "@vanduo-oss/vd3";

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

const props = defineProps<Props>();

const isModalOpen = ref(true);

const handleOpenChange = (open: boolean) => {
  if (!open) {
    isModalOpen.value = true;
  }
};

const handleAccept = () => {
  isModalOpen.value = false;
  props.onAccept();
};

const handleDecline = () => {
  isModalOpen.value = false;
  props.onDecline();
};
</script>

