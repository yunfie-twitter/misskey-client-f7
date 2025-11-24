import { useAuthStore } from '@/stores/auth';

export async function misskeyApi(endpoint, params = {}) {
  const authStore = useAuthStore();
  
  if (!authStore.currentInstanceUrl) {
    throw new Error('No instance selected');
  }
  
  if (!authStore.token) {
    throw new Error('Not authenticated');
  }
  
  const url = `${authStore.currentInstanceUrl}/api/${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      i: authStore.token,
      ...params
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return await response.json();
}

export async function misskeyApiNoAuth(instanceUrl, endpoint, params = {}) {
  const url = `${instanceUrl}/api/${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return await response.json();
}
