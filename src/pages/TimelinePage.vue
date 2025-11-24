<template>
  <f7-page ptr @ptr:refresh="onRefresh">
    <f7-navbar :title="timelineTitle" back-link="戻る" />
    <f7-list media-list v-if="notes.length > 0">
      <f7-list-item
        v-for="note in notes" :key="note.id"
        :title="note.user.name" :text="note.text"
      />
    </f7-list>
    <f7-fab position="right-bottom" @click="$f7router.navigate('/post')">
      <f7-icon f7="plus" />
    </f7-fab>
  </f7-page>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTimelineStore } from '@/stores/timeline';
const route = useRoute();
const timelineStore = useTimelineStore();
const timelineType = computed(() => route.params.type);
const notes = computed(() => timelineStore.timelines[timelineType.value] || []);
const timelineTitle = computed(() => ({ home: 'ホーム', local: 'ローカル', social: 'ソーシャル', global: 'グローバル' })[timelineType.value]);
const onRefresh = async (done) => { await timelineStore.fetchTimeline(timelineType.value); done(); };
onMounted(() => timelineStore.fetchTimeline(timelineType.value));
</script>
