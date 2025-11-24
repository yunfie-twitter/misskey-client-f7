<template>
  <f7-page>
    <f7-navbar title="投稿" back-link="戻る" />
    <f7-list no-hairlines-md>
      <f7-list-input type="textarea" :value="text" @input="text = $event.target.value" placeholder="いまどうしてる？" />
    </f7-list>
    <f7-block>
      <f7-button fill large @click="post">投稿</f7-button>
    </f7-block>
  </f7-page>
</template>
<script setup>
import { ref } from 'vue';
import { f7 } from 'framework7-vue';
import { useRouter } from 'vue-router';
import { misskeyApi } from '@/utils/api';
const router = useRouter();
const text = ref('');
const post = async () => {
  if (!text.value.trim()) return;
  try {
    await misskeyApi('notes/create', { text: text.value });
    f7.toast.create({ text: '投稿しました', position: 'center', closeTimeout: 2000 }).open();
    router.back();
  } catch (error) {
    f7.dialog.alert('投稿に失敗しました: ' + error.message);
  }
};
</script>
