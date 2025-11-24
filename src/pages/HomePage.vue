<template>
  <f7-page>
    <f7-navbar title="Misskey Client" />
    
    <f7-block strong inset v-if="!authStore.isAuthenticated">
      <p>ようこそMisskey Clientへ！</p>
      <p>始めるにはログインしてください。</p>
      <f7-button fill large @click="router.push('/login')">
        ログイン
      </f7-button>
    </f7-block>
    
    <f7-block v-else>
      <f7-block-title large>タイムライン</f7-block-title>
      <f7-list>
        <f7-list-item
          link="/timeline/home"
          title="ホーム"
          subtitle="フォロー中のノート"
        >
          <template #media>
            <f7-icon f7="house" />
          </template>
        </f7-list-item>
        
        <f7-list-item
          link="/timeline/local"
          title="ローカル"
          subtitle="ローカルタイムライン"
        >
          <template #media>
            <f7-icon f7="person_2" />
          </template>
        </f7-list-item>
        
        <f7-list-item
          link="/timeline/social"
          title="ソーシャル"
          subtitle="ソーシャルタイムライン"
        >
          <template #media>
            <f7-icon f7="person_3" />
          </template>
        </f7-list-item>
        
        <f7-list-item
          link="/timeline/global"
          title="グローバル"
          subtitle="連合タイムライン"
        >
          <template #media>
            <f7-icon f7="globe" />
          </template>
        </f7-list-item>
      </f7-list>
      
      <f7-block-title large>その他</f7-block-title>
      <f7-list>
        <f7-list-item
          link="/notifications"
          title="通知"
          :badge="notificationCount"
          badge-color="red"
        >
          <template #media>
            <f7-icon f7="bell" />
          </template>
        </f7-list-item>
        
        <f7-list-item
          link="/profile"
          title="プロフィール"
        >
          <template #media>
            <f7-icon f7="person" />
          </template>
        </f7-list-item>
        
        <f7-list-item
          link="/settings"
          title="設定"
        >
          <template #media>
            <f7-icon f7="gear" />
          </template>
        </f7-list-item>
      </f7-list>
    </f7-block>
    
    <f7-fab position="right-bottom" @click="router.push('/post')" v-if="authStore.isAuthenticated">
      <f7-icon f7="plus" />
    </f7-fab>
  </f7-page>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';

const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const notificationCount = computed(() => notificationsStore.unreadCount);
</script>
