<template>
  <f7-app v-bind="f7params">
    <f7-view main url="/" :push-state="true" :push-state-separator="" />
  </f7-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import routes from '@/router/routes';

const authStore = useAuthStore();

const f7params = ref({
  name: 'Misskey Client',
  theme: 'auto',
  routes: routes,
  view: {
    pushState: true,
    pushStateRoot: '',
    pushStateSeparator: ''
  },
  dialog: {
    buttonOk: 'OK',
    buttonCancel: 'キャンセル'
  }
});

onMounted(() => {
  authStore.initAuth();
});
</script>
