import { callHealthCheck, callSystemStatus } from '@/config/api';

export interface ConnectionTestResult {
  aiServer: boolean;
  backend: boolean;
  aiServerUrl: string;
  backendUrl: string;
  errors: string[];
}

export const testConnections = async (): Promise<ConnectionTestResult> => {
  const result: ConnectionTestResult = {
    aiServer: false,
    backend: false,
    aiServerUrl: import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:3005',
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
    errors: []
  };

  // Test AI Server connection
  try {
    const healthResponse = await callHealthCheck();
    if (healthResponse.data.success) {
      result.aiServer = true;
      console.log('✅ AI Server connection successful');
    } else {
      result.errors.push('AI Server returned unsuccessful response');
    }
  } catch (error: any) {
    const errorMsg = `AI Server connection failed: ${error.message}`;
    result.errors.push(errorMsg);
    console.error('❌ AI Server connection failed:', error);
  }

  // Test Backend connection (basic check)
  try {
    const response = await fetch(`${result.backendUrl}/api/v1/auth/account`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok || response.status === 401) {
      result.backend = true;
      console.log('✅ Backend connection successful');
    } else {
      result.errors.push(`Backend returned status: ${response.status}`);
    }
  } catch (error: any) {
    const errorMsg = `Backend connection failed: ${error.message}`;
    result.errors.push(errorMsg);
    console.error('❌ Backend connection failed:', error);
  }

  return result;
};

export const logConnectionStatus = (result: ConnectionTestResult) => {
  console.log('🔍 Connection Test Results:');
  console.log(`AI Server (${result.aiServerUrl}): ${result.aiServer ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Backend (${result.backendUrl}): ${result.backend ? '✅ Connected' : '❌ Failed'}`);
  
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  return result;
};
