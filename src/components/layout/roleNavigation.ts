import type { UserRole } from '@/lib/types';
import {
  Home,
  BookOpen,
  Compass,
  ClipboardCheck,
  BarChart3,
  Award,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Target,
  UserCircle,
  Brain,
  Building2,
  TrendingUp,
  Layers,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export interface RoleNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'warning' | 'success';
  isDividerBefore?: boolean;
}

export const LEARNER_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'nav.dashboard',
    icon: Home,
  },
  {
    href: '/courses',
    label: 'nav.myLearning',
    icon: BookOpen,
  },
  {
    href: '/pathways',
    label: 'nav.pathways',
    icon: Compass,
  },
  {
    href: '/assignments',
    label: 'nav.assessment',
    icon: ClipboardCheck,
  },
  {
    href: '/skill-gap',
    label: 'nav.skillGap',
    icon: BarChart3,
  },
  {
    href: '/mcq-generator',
    label: 'nav.quiz',
    icon: Brain,
  },
  {
    href: '/credentials',
    label: 'nav.credentials',
    icon: Award,
  },
  {
    href: '/documents',
    label: 'nav.documents',
    icon: FileText,
    isDividerBefore: true,
  },
  {
    href: '/profile',
    label: 'nav.profile',
    icon: UserCircle,
  },
  {
    href: '#help',
    label: 'nav.helpSupport',
    icon: HelpCircle,
  },
];

export const TRAINER_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'nav.facultyCommandDesk',
    icon: LayoutDashboard,
  },
  {
    href: '/documents',
    label: 'nav.documents',
    icon: FileText,
    badge: '6 Manuals',
    badgeType: 'default',
  },
  {
    href: '/mcq-generator',
    label: 'nav.mcqGenerator',
    icon: Brain,
    badge: 'Item Studio',
    badgeType: 'accent',
  },
  {
    href: '/review-queue',
    label: 'nav.reviewQueue',
    icon: ClipboardCheck,
    badge: '14 QA',
    badgeType: 'warning',
  },
  {
    href: '/assignments',
    label: 'nav.traineeErrorAnalytics',
    icon: Layers,
  },
  {
    href: '/skill-gap',
    label: 'nav.skillGap',
    icon: Target,
  },
  {
    href: '/profile',
    label: 'nav.profile',
    icon: UserCircle,
  },
];

export const ADMIN_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'nav.workforceCommand',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard#correlation',
    label: 'nav.scrutinyCorrelation',
    icon: TrendingUp,
    badge: 'r=-0.84',
    badgeType: 'accent',
  },
  {
    href: '/dashboard#regional-offices',
    label: 'nav.regionalOfficeHealth',
    icon: Building2,
    badge: '2 Flagged',
    badgeType: 'warning',
  },
  {
    href: '/skill-gap',
    label: 'nav.nationalCompetencyMatrix',
    icon: Target,
  },
  {
    href: '/assignments',
    label: 'nav.statutoryAssessmentAudit',
    icon: BarChart3,
  },
  {
    href: '/documents',
    label: 'nav.documents',
    icon: FileText,
    badge: 'Manuals',
    badgeType: 'default',
  },
  {
    href: '/mcq-generator',
    label: 'nav.quiz',
    icon: Brain,
  },
  {
    href: '/review-queue',
    label: 'nav.reviewQueue',
    icon: ClipboardCheck,
    badge: '14 QA',
    badgeType: 'warning',
  },
  {
    href: '/profile',
    label: 'nav.profile',
    icon: UserCircle,
  },
];

export function getNavigationForRole(role: UserRole = 'learner', isHindi = false): RoleNavItem[] {
  const baseItems = (() => {
    switch (role) {
      case 'trainer':
        return TRAINER_NAV_ITEMS;
      case 'admin':
        return ADMIN_NAV_ITEMS;
      case 'learner':
      default:
        return LEARNER_NAV_ITEMS;
    }
  })();

  if (!isHindi) return baseItems;

  return baseItems.map((item) => {
    if (!item.badge) return item;
    let localizedBadge = item.badge;
    if (item.badge === '3 Drills') localizedBadge = '3 अभ्यास';
    else if (item.badge === '6 Manuals') localizedBadge = '6 नियमावलियां';
    else if (item.badge === '10 Modules') localizedBadge = '10 मॉड्यूल';
    else if (item.badge === '14 QA') localizedBadge = '14 क्यूए';
    else if (item.badge === '2 Flagged') localizedBadge = '2 चिह्नित';
    else if (item.badge === 'Item Studio') localizedBadge = 'प्रश्न बैंक';
    else if (item.badge === 'Manuals') localizedBadge = 'नियमावलियां';

    return {
      ...item,
      badge: localizedBadge,
    };
  });
}

export function getRoleIdentity(role: UserRole = 'learner', isHindi = false) {
  switch (role) {
    case 'trainer':
      return {
        title: isHindi ? 'स्टैटविद्या' : 'StatVidya',
        subtitle: isHindi ? 'NSSTA संकाय स्टूडियो' : 'NSSTA Faculty Studio',
        emblemTag: isHindi ? 'NSSTA • सांख्यिकी मंत्रालय' : 'NSSTA • MoSPI',
        themeColor: '#1164BE',
        roleLabel: isHindi ? 'संकाय प्रशिक्षक' : 'Faculty Trainer',
      };
    case 'admin':
      return {
        title: isHindi ? 'स्टैटविद्या' : 'StatVidya',
        subtitle: isHindi ? 'कार्यकारी कमान डेस्क' : 'Executive Command Desk',
        emblemTag: isHindi ? 'MoSPI मुख्यालय • ADG' : 'MoSPI HQ • ADG',
        themeColor: '#1C4CA1',
        roleLabel: isHindi ? 'नीति प्रशासक' : 'Policy Administrator',
      };
    case 'learner':
    default:
      return {
        title: isHindi ? 'स्टैटविद्या' : 'StatVidya',
        subtitle: isHindi ? 'MoSPI क्षमता विकास' : 'MoSPI Capacity Building',
        emblemTag: isHindi ? 'सिविल सेवा • FOD' : 'Civil Services • FOD',
        themeColor: '#1C4CA1',
        roleLabel: isHindi ? 'संवर्ग अधिकारी' : 'Cadre Officer',
      };
  }
}

export function getRoleFooterData(role: UserRole = 'learner', isHindi = false) {
  switch (role) {
    case 'trainer':
      return {
        title: isHindi ? 'पाठ्यक्रम वेक्टर डेटाबेस' : 'Curriculum Vector DB',
        subtitle: isHindi ? '6 मैनुअल • 1,276 खंड' : '6 Manuals • 1,276 Chunks',
        badge: isHindi ? 'वेक्टर इंजन सक्रिय' : 'Vector Engine Active',
      };
    case 'admin':
      return {
        title: isHindi ? 'राष्ट्रीय सांख्यिकी शासन' : 'National Governance',
        subtitle: isHindi ? 'कैबिनेट प्रोटोकॉल सिंक' : 'Cabinet Protocol Sync',
        badge: isHindi ? 'वैधानिक NSC प्रमाणित' : 'Statutory NSC Certified',
      };
    case 'learner':
    default:
      return {
        title: isHindi ? 'CAPI ऑफ़लाइन इंजन' : 'CAPI Offline Engine',
        subtitle: isHindi ? 'IndexedDB एन्क्रिप्टेड कैश' : 'IndexedDB Encrypted Cache',
        badge: isHindi ? 'CAPI सिंक्रनाइज़्ड' : 'CAPI Synchronized',
      };
  }
}
