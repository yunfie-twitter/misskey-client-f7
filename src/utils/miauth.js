import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/stores/auth';
import { misskeyApi } from './api';

export class MiAuth {
  constructor(instanceUrl, appName = 'Misskey Client F7') {
    this.instanceUrl = instanceUrl.replace(/\/$/, '');
    this.appName = appName;
    this.sessionId = uuidv4();
  }
  
  getAuthUrl(permissions = ['read:account', 'write:notes', 'read:notifications', 'write:notifications']) {
    const params = new URLSearchParams({
      name: this.appName,
      permission: permissions.join(','),
      callback: window.location.origin + '/login?callback=true'
    });
    
    return `${this.instanceUrl}/miauth/${this.sessionId}?${params.toString()}`;
  }
  
  async checkAuth() {
    try {
      const response = await fetch(`${this.instanceUrl}/api/miauth/${this.sessionId}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Authentication check failed');
      }
      
      const data = await response.json();
      
      if (data.ok && data.token) {
        return {
          token: data.token,
          user: data.user
        };
      }
      
      return null;
    } catch (error) {
      console.error('MiAuth check error:', error);
      return null;
    }
  }
}

export async function verifyApiKey(instanceUrl, apiKey) {
  try {
    const response = await fetch(`${instanceUrl}/api/i`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        i: apiKey
      })
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('API key verification error:', error);
    throw error;
  }
}
