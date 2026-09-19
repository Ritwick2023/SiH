export type NotificationType =
  | 'assessment'
  | 'learning'
  | 'system'
  | 'achievement'
  | 'announcement';

export interface Notification {
  id: string;
  title: string;
  title_hi?: string;
  message: string;
  message_hi?: string;
  timestamp: string;
  timestamp_hi?: string;
  read: boolean;
  type: NotificationType;
  href?: string;
  role?: 'learner' | 'trainer' | 'admin' | 'all';
}
