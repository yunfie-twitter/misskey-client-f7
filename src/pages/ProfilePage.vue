<template>
  <f7-page>
    <f7-navbar title="プロフィール" back-link="戻る" />
    <f7-block v-if="user">
      <p><strong>{{ user.name }}</strong></p>
      <p>@{{ user.username }}</p>
    </f7-block>
  </f7-page>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>
