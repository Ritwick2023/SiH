'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSafeLocale } from '@/lib/useSafeLocale';

interface CompetencyRating {
  id: string;
  name: string;
  name_hi: string;
  level: number;
}

const DEFAULT_ONBOARDING_COMPETENCIES: CompetencyRating[] = [
  { id: 'comp-capi', name: 'CAPI Tablet Operation', name_hi: 'कैपी टैबलेट संचालन', level: 2 },
  { id: 'comp-nsso', name: 'NSSO Protocol Mastery', name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता', level: 1 },
  { id: 'comp-survey', name: 'Survey Sampling & Design', name_hi: 'सर्वेक्षण नमूनाकरण और डिज़ाइन', level: 1 },
  { id: 'comp-data', name: 'Data Entry & Scrutiny', name_hi: 'डेटा प्रविष्टि और जांच', level: 2 },
  { id: 'comp-teamwork', name: 'Teamwork & Collaboration', name_hi: 'टीम वर्क और सहयोग', level: 3 },
];

export default function OnboardingWizard({ userId, orgId }: { userId?: string; orgId?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<CompetencyRating[]>(DEFAULT_ONBOARDING_COMPETENCIES);
  const [formData, setFormData] = useState({
    cadre: '',
    roleId: '',
    designation: '',
    department: '',
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleRatingChange = (id: string, newLevel: number) => {
    setRatings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, level: newLevel } : item))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Save onboarding preferences & baseline ratings
    try {
      if (formData.cadre === 'FOD') {
        document.cookie = 'locale=hi; path=/; max-age=604800';
      }
      // Save completed baseline state in localStorage as backup
      const storageKey = userId ? `statvidya_onboarding_ratings_${userId}` : 'statvidya_onboarding_ratings';
      localStorage.setItem(storageKey, JSON.stringify({ ratings, orgId }));
    } catch {}

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
      router.refresh();
    }, 1000);
  };

  const cadres = [
    { id: 'ISS', name: t('cadres.iss') },
    { id: 'SSS', name: t('cadres.sss') },
    { id: 'FOD', name: t('cadres.nssoFOD') },
    { id: 'NSSTA', name: t('cadres.nsstaFaculty') },
  ];

  const rolesByCadre: Record<string, { id: string; name: string }[]> = {
    'ISS': [
      { id: 'role-director', name: t('roles.deputyDirector') },
    ],
    'SSS': [
      { id: 'role-sso', name: t('roles.statisticalOfficer') },
      { id: 'role-jso', name: t('roles.statisticalOfficer') },
    ],
    'FOD': [
      { id: 'role-field-investigator', name: t('roles.fieldInvestigator') },
    ],
    'NSSTA': [
      { id: 'role-faculty', name: t('roles.nsstaFaculty') },
    ],
  };

  return (
    <div className="mt-8">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                step === s
                  ? 'bg-blue-700 text-white shadow-sm'
                  : step > s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-75">
        {/* Step 1: Cadre Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {t('onboarding.step1.subtitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cadres.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setFormData({ ...formData, cadre: c.id, roleId: '' });
                    handleNext();
                  }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.cadre === c.id
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {t('onboarding.step3.subtitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesByCadre[formData.cadre]?.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setFormData({ ...formData, roleId: r.id });
                    handleNext();
                  }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.roleId === r.id
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{r.name}</div>
                </button>
              ))}
            </div>
            {formData.cadre === 'FOD' && (
              <div className="mt-6 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm flex items-start gap-3">
                <span className="text-lg">ℹ️</span>
                <p>{t('onboarding.languageNote')}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Official Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-w-md mx-auto py-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {t('onboarding.step2.subtitle')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('onboarding.department')}
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder={isHindi ? "उदा. एनएसएसओ (क्षेत्र संक्रिया प्रभाग)" : "e.g. NSSO (Field Operations Division)"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('onboarding.designation')}
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder={isHindi ? "उदा. क्षेत्र अन्वेषक (ग्रेड II)" : "e.g. Field Investigator (Grade II)"}
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm mt-4 cursor-pointer"
            >
              {t('common.next')}
            </button>
          </div>
        )}

        {/* Step 4: Baseline Self-Assessment */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                {t('onboarding.step4.title')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('onboarding.step4.subtitle')}
              </p>
            </div>

            <div className="space-y-4 my-6">
              {ratings.map((comp) => (
                <div key={comp.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {isHindi ? comp.name_hi : comp.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isHindi ? comp.name : comp.name_hi}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {isHindi ? `स्तर ${comp.level}` : `Level ${comp.level}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleRatingChange(comp.id, lvl)}
                        className={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                          comp.level === lvl
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t('common.loading')}
                </>
              ) : (
                t('common.submit')
              )}
            </button>
          </div>
        )}
      </div>

      {/* Back button logic */}
      <div className="mt-8 flex items-center h-10">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors cursor-pointer"
          >
            ← {t('onboarding.back')}
          </button>
        )}
      </div>
    </div>
  );
}
