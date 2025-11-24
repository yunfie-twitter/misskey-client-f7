<template>
  <f7-page>
    <f7-navbar title="ログイン" back-link="戻る" />
    
    <f7-block-title>インスタンスを選択</f7-block-title>
    
    <f7-list no-hairlines-md>
      <f7-list-input
        label="インスタンスURL"
        type="url"
        placeholder="https://misskey.io"
        :value="instanceUrl"
        @input="instanceUrl = $event.target.value"
        clear-button
      >
        <template #info>
          例: misskey.io, misskey.voc-loid.work
        </template>
      </f7-list-input>
    </f7-list>
    
    <f7-block-title>認証方法を選択</f7-block-title>
    
    <f7-list>
      <f7-list-item
        link="#"
        title="Miauthで認証"
        @click="loginWithMiauth"
        :class="{ 'disabled': !isValidUrl }"
      >
        <template #after>
          <f7-icon f7="arrow_right_circle" />
        </template>
      </f7-list-item>
      
      <f7-list-item
        link="#"
        title="APIキーで認証"
        @click="showApiKeyDialog"
        :class="{ 'disabled': !isValidUrl }"
      >
        <template #after>
          <f7-icon f7="key" />
        </template>
      </f7-list-item>
    </f7-list>
    
    <f7-block v-if="savedInstances.length > 0">
      <f7-block-title>保存済みインスタンス</f7-block-title>
      <f7-list>
        <f7-list-item
          v-for="instance in savedInstances"
          :key="instance.url"
          :title="instance.name || instance.url"
          :subtitle="instance.url"
          link="#"
          @click="selectInstance(instance)"
        />
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { MiAuth, verifyApiKey } from '@/utils/miauth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const instanceUrl = ref('');
const savedInstances = computed(() => authStore.instances);

const isValidUrl = computed(() => {
  try {
    const url = instanceUrl.value.startsWith('http') 
      ? instanceUrl.value 
      : `https://${instanceUrl.value}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
});

const normalizeUrl = (url) => {
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, '');
};

const loginWithMiauth = () => {
  if (!isValidUrl.value) {
    f7.dialog.alert('有効なURLを入力してください');
    return;
  }
  
  const url = normalizeUrl(instanceUrl.value);
  const miauth = new MiAuth(url);
  
  // Save session info
  sessionStorage.setItem('miauth_session', miauth.sessionId);
  sessionStorage.setItem('miauth_instance', url);
  
  // Open auth window
  window.location.href = miauth.getAuthUrl();
};

const showApiKeyDialog = () => {
  if (!isValidUrl.value) {
    f7.dialog.alert('有効なURLを入力してください');
    return;
  }
  
  f7.dialog.prompt(
    'APIキーを入力してください',
    'APIキー認証',
    async (apiKey) => {
      if (!apiKey) return;
      
      f7.preloader.show();
      try {
        const url = normalizeUrl(instanceUrl.value);
        const user = await verifyApiKey(url, apiKey);
        
        const instance = {
          url,
          name: user.host || url,
        };
        
        authStore.addInstance(instance);
        authStore.setCurrentInstance(instance);
        authStore.setAuth(apiKey, user);
        
        f7.dialog.alert('認証に成功しました', () => {
          router.push({ name: 'timeline', params: { type: 'home' } });
        });
      } catch (error) {
        f7.dialog.alert('認証に失敗しました: ' + error.message);
      } finally {
        f7.preloader.hide();
      }
    }
  );
};

const selectInstance = (instance) => {
  authStore.switchInstance(instance);
  instanceUrl.value = instance.url.replace('https://', '').replace('http://', '');
};

const handleCallback = async () => {
  const sessionId = sessionStorage.getItem('miauth_session');
  const instanceUrl = sessionStorage.getItem('miauth_instance');
  
  if (!sessionId || !instanceUrl) return;
  
  f7.preloader.show();
  
  try {
    const miauth = new MiAuth(instanceUrl);
    miauth.sessionId = sessionId;
    
    const result = await miauth.checkAuth();
    
    if (result && result.token) {
      const instance = {
        url: instanceUrl,
        name: result.user.host || instanceUrl,
      };
      
      authStore.addInstance(instance);
      authStore.setCurrentInstance(instance);
      authStore.setAuth(result.token, result.user);
      
      sessionStorage.removeItem('miauth_session');
      sessionStorage.removeItem('miauth_instance');
      
      f7.dialog.alert('認証に成功しました', () => {
        router.push({ name: 'timeline', params: { type: 'home' } });
      });
    } else {
      f7.dialog.alert('認証に失敗しました');
    }
  } catch (error) {
    f7.dialog.alert('認証に失敗しました: ' + error.message);
  } finally {
    f7.preloader.hide();
  }
};

onMounted(() => {
  if (route.query.callback === 'true') {
    handleCallback();
  }
});
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
