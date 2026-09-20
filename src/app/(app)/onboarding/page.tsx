import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import OnboardingWizard from './OnboardingWizard';


export default async function OnboardingPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/auth/login');
  }

  const t = await getTranslations('onboarding');

  // NOTE: In production we would check if the user already has a role
  // and redirect to /dashboard if onboarding is already complete

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-2xl bg-white p-8 shadow-card border border-[#D8DFEE]">
        <div className="text-center mb-8">
           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1C4CA1]/10 text-[#1C4CA1] mb-3">
             🏛️ MoSPI FRAC Competency Baseline
           </span>
           <h1 className="text-2xl font-bold text-[#1F273A]">
             {t('title')}
           </h1>
           <p className="mt-2 text-sm text-[#1F273A]/70">
             {t('subtitle')}
           </p>
        </div>

        <OnboardingWizard
          userId={user.id}
          orgId={user.user_metadata?.organization_id || ''}
        />
      </div>
    </div>
  );
}
