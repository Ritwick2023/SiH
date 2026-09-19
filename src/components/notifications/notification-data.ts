import { Notification } from './types';

export const LEARNER_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-l-1',
    title: 'New assessment assigned',
    title_hi: 'नया मूल्यांकन सौंपा गया',
    message: 'You have been assigned the Problem Solving & Logical Reasoning competency test.',
    message_hi: 'आपको समस्या समाधान एवं तार्किक विवेचना योग्यता परीक्षण सौंपा गया है।',
    timestamp: '10 minutes ago',
    timestamp_hi: '10 मिनट पहले',
    read: false,
    type: 'assessment',
    href: '/assignments',
    role: 'learner',
  },
  {
    id: 'n-l-2',
    title: 'Learning pathway updated',
    title_hi: 'शिक्षण मार्ग अद्यतन',
    message: 'Your recommended learning pathway has been updated based on your recent skill gaps.',
    message_hi: 'आपके हालिया कौशल अंतराल के आधार पर आपकी अनुशंसित शिक्षण मार्ग को अद्यतन किया गया है।',
    timestamp: '1 hour ago',
    timestamp_hi: '1 घंटा पहले',
    read: false,
    type: 'learning',
    href: '/pathways',
    role: 'learner',
  },
  {
    id: 'n-l-3',
    title: 'Assessment completed',
    title_hi: 'मूल्यांकन पूर्ण हुआ',
    message: 'Your assessment result for Decision Making & Prioritization is now ready to review.',
    message_hi: 'निर्णय लेने एवं प्राथमिकता निर्धारण के लिए आपका मूल्यांकन परिणाम समीक्षा हेतु तैयार है।',
    timestamp: 'Yesterday',
    timestamp_hi: 'कल',
    read: true,
    type: 'achievement',
    href: '/assignments',
    role: 'learner',
  },
  {
    id: 'n-l-4',
    title: 'Annual Training Calendar published',
    title_hi: 'वार्षिक प्रशिक्षण कैलेंडर प्रकाशित',
    message: 'NSSTA official 2026-27 training schedule and course catalogue have been uploaded.',
    message_hi: 'NSSTA का आधिकारिक 2026-27 प्रशिक्षण कार्यक्रम और पाठ्यक्रम कैटलॉग अपलोड कर दिया गया है।',
    timestamp: '2 days ago',
    timestamp_hi: '2 दिन पहले',
    read: true,
    type: 'announcement',
    href: '/documents',
    role: 'learner',
  },
];

export const TRAINER_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-t-1',
    title: 'Learner cohort needs attention',
    title_hi: 'शिक्षार्थी समूह पर ध्यान देने की आवश्यकता',
    message: '3 trainees in Field Survey module scored below Level 2 proficiency threshold.',
    message_hi: 'फील्ड सर्वे मॉड्यूल में 3 प्रशिक्षुओं ने स्तर 2 प्रवीणता सीमा से कम अंक प्राप्त किए।',
    timestamp: '25 minutes ago',
    timestamp_hi: '25 मिनट पहले',
    read: false,
    type: 'system',
    href: '/review-queue',
    role: 'trainer',
  },
  {
    id: 'n-t-2',
    title: 'New training module published',
    title_hi: 'नया प्रशिक्षण मॉड्यूल प्रकाशित',
    message: 'Advanced Sampling Methods course material is now live in the document repository.',
    message_hi: 'उन्नत नमूनाकरण विधियाँ पाठ्यक्रम सामग्री दस्तावेज़ भंडार में लाइव है।',
    timestamp: '2 hours ago',
    timestamp_hi: '2 घंटे पहले',
    read: false,
    type: 'learning',
    href: '/documents',
    role: 'trainer',
  },
  {
    id: 'n-t-3',
    title: 'Assessment completion report available',
    title_hi: 'मूल्यांकन समापन रिपोर्ट उपलब्ध',
    message: 'Batch Q3 competency evaluation report is generated and ready for faculty review.',
    message_hi: 'बैच Q3 क्षमता मूल्यांकन रिपोर्ट तैयार है और संकाय समीक्षा के लिए उपलब्ध है।',
    timestamp: 'Yesterday',
    timestamp_hi: 'कल',
    read: true,
    type: 'achievement',
    href: '/mcq-generator',
    role: 'trainer',
  },
  {
    id: 'n-t-4',
    title: 'Faculty curriculum meeting',
    title_hi: 'संकाय पाठ्यक्रम बैठक',
    message: 'Mission Karmayogi FRAC curriculum review alignment scheduled for Friday at 3:00 PM.',
    message_hi: 'मिशन कर्मयोगी FRAC पाठ्यक्रम समीक्षा संरेखण शुक्रवार को दोपहर 3:00 बजे निर्धारित है।',
    timestamp: '3 days ago',
    timestamp_hi: '3 दिन पहले',
    read: true,
    type: 'announcement',
    role: 'trainer',
  },
];

export const ADMIN_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-a-1',
    title: 'Workforce competency gap detected',
    title_hi: 'कार्यबल क्षमता अंतराल का पता चला',
    message: 'Critical gap identified in GIS & Spatial Analysis across NSSO Field Division.',
    message_hi: 'NSSO फील्ड डिवीजन में जीआईएस एवं स्थानिक विश्लेषण में गंभीर अंतराल की पहचान की गई।',
    timestamp: '15 minutes ago',
    timestamp_hi: '15 मिनट पहले',
    read: false,
    type: 'assessment',
    href: '/skill-gap',
    role: 'admin',
  },
  {
    id: 'n-a-2',
    title: 'Training effectiveness report updated',
    title_hi: 'प्रशिक्षण प्रभावशीलता रिपोर्ट अद्यतन',
    message: 'Mid-year competency uplift metrics across all 6 cadres are ready for review.',
    message_hi: 'सभी 6 संवर्गों में मध्यावधि क्षमता उत्थान मेट्रिक्स समीक्षा के लिए तैयार हैं।',
    timestamp: '3 hours ago',
    timestamp_hi: '3 घंटे पहले',
    read: false,
    type: 'system',
    href: '/admin/analytics',
    role: 'admin',
  },
  {
    id: 'n-a-3',
    title: 'Department analytics refreshed',
    title_hi: 'विभाग विश्लेषिकी ताज़ा',
    message: 'Quarterly workforce readiness index updated to 78% across 4,000+ personnel.',
    message_hi: '4,000+ कर्मियों में त्रैमासिक कार्यबल तैयारी सूचकांक बढ़कर 78% हो गया।',
    timestamp: '1 day ago',
    timestamp_hi: '1 दिन पहले',
    read: true,
    type: 'announcement',
    href: '/admin/analytics',
    role: 'admin',
  },
  {
    id: 'n-a-4',
    title: 'Cadre compliance audit passed',
    title_hi: 'संवर्ग अनुपालन ऑडिट उत्तीर्ण',
    message: 'FRAC standard compliance reached 94% across all MoSPI attached offices.',
    message_hi: 'MoSPI के सभी संलग्न कार्यालयों में FRAC मानक अनुपालन 94% तक पहुंच गया।',
    timestamp: '2 days ago',
    timestamp_hi: '2 दिन पहले',
    read: true,
    type: 'achievement',
    href: '/admin/analytics',
    role: 'admin',
  },
];

/**
 * Returns initial notification dataset based on user role.
 * Defaults to learner notifications.
 */
export function getInitialNotifications(role?: string): Notification[] {
  switch (role?.toLowerCase()) {
    case 'trainer':
      return [...TRAINER_NOTIFICATIONS];
    case 'admin':
      return [...ADMIN_NOTIFICATIONS];
    case 'learner':
    default:
      return [...LEARNER_NOTIFICATIONS];
  }
}

/**
 * Extensible data-fetcher designed for future Supabase integration.
 * When real Supabase `notifications` table is connected, replace this mock
 * implementation with a query without needing to modify the UI components:
 *
 * ```ts
 * const supabase = getSupabaseBrowserClient();
 * const { data, error } = await supabase
 *   .from('notifications')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .order('created_at', { ascending: false });
 * ```
 */
export async function fetchNotifications(
  _userId?: string,
  role?: string
): Promise<Notification[]> {
  return getInitialNotifications(role);
}
