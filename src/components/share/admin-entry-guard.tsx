import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

export const CHATBOX_ADMIN_KEY = 'ALLOW_CHATBOX_ADMIN';

export const enableChatboxAdminAccess = () => {
  try {
    sessionStorage.setItem(CHATBOX_ADMIN_KEY, '1');
  } catch (e) {
    // ignore storage errors
  }
}

export default function AdminEntryGuard({ children }: { children: ReactNode }) {
  let allowed = false;
  try {
    allowed = sessionStorage.getItem(CHATBOX_ADMIN_KEY) === '1';
  } catch (e) {
    allowed = false;
  }
  if (!allowed) return <Navigate to="/" replace />;
  return <>{children}</>;
}


