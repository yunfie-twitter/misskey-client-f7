<template>
  <f7-page>
    <f7-navbar title="通知" back-link="戻る" />
    <f7-list media-list v-if="notifications.length > 0">
      <f7-list-item v-for="notif in notifications" :key="notif.id" :title="notif.type" />
    </f7-list>
    <f7-block v-else class="text-align-center"><p>通知がありません</p></f7-block>
  </f7-page>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';
const notificationsStore = useNotificationsStore();
const notifications = computed(() => notificationsStore.notifications);
onMounted(() => notificationsStore.fetchNotifications());
</script>
