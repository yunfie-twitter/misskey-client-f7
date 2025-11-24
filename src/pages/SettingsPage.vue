<template>
  <f7-page>
    <f7-navbar title="設定" back-link="戻る" />
    <f7-list>
      <f7-list-item link="#" title="ログアウト" @click="logout" />
    </f7-list>
  </f7-page>
</template>
<script setup>
import { f7 } from 'framework7-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const logout = () => {
  f7.dialog.confirm('ログアウトしますか？', () => {
    authStore.logout();
    router.push('/');
  });
};
</script>
