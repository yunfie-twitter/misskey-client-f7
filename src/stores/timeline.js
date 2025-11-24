import { defineStore } from 'pinia';
import { misskeyApi } from '@/utils/api';

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelines: {
      home: [],
      local: [],
      social: [],
      global: []
    },
    loading: false,
    hasMore: true,
  }),
  
  actions: {
    async fetchTimeline(type, limit = 20, untilId = null) {
      this.loading = true;
      try {
        const endpoint = this.getEndpoint(type);
        const params = { limit };
        if (untilId) params.untilId = untilId;
        
        const notes = await misskeyApi(endpoint, params);
        
        if (untilId) {
          this.timelines[type].push(...notes);
        } else {
          this.timelines[type] = notes;
        }
        
        this.hasMore = notes.length === limit;
        return notes;
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    getEndpoint(type) {
      const endpoints = {
        home: 'notes/timeline',
        local: 'notes/local-timeline',
        social: 'notes/hybrid-timeline',
        global: 'notes/global-timeline'
      };
      return endpoints[type] || endpoints.home;
    },
    
    prependNote(type, note) {
      this.timelines[type].unshift(note);
    },
    
    clearTimeline(type) {
      this.timelines[type] = [];
    }
  }
});
