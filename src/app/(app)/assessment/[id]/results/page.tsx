import { getAuthenticatedUser } from '@/lib/auth';
import { getPersonaFRAC } from '@/data/fracCadres';
import AssessmentResultsClient from './AssessmentResultsClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ level?: string; score?: string }>;
}

export default async function AssessmentResultsPage({ params, searchParams }: PageProps) {
  const { id: competencyId } = await params;
  const { level, score } = await searchParams;

  const user = await getAuthenticatedUser();
  const personaFrac = getPersonaFRAC(user);
  const matchedComp = personaFrac.competencies.find((c) => c.id === competencyId);

  const DEMO_COMPETENCIES: Record<string, { name: string; name_hi: string }> = {
    'comp-capi': { name: 'CAPI Tablet Operation', name_hi: 'कैपी टैबलेट संचालन' },
    'comp-demarcation': { name: 'Block Demarcation & Urban Frame Survey', name_hi: 'ब्लॉक सीमांकन और यूएफएस' },
    'comp-nsso': { name: 'NSSO Protocol Mastery', name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता' },
    'comp-survey': { name: 'Survey Sampling & Design', name_hi: 'सर्वेक्षण नमूनाकरण और डिज़ाइन' },
    'comp-data': { name: 'Data Entry & Scrutiny Rules', name_hi: 'डेटा प्रविष्टि और जांच नियम' },
    'comp-scrutiny': { name: 'Field Scrutiny & Validation Rules', name_hi: 'क्षेत्र संवीक्षा और सत्यापन नियम' },
    'comp-r-prog': { name: 'Statistical Computing with R & Python', name_hi: 'आर और पायथन के साथ सांख्यिकीय संगणना' },
    'comp-teamwork': { name: 'Teamwork & Collaboration', name_hi: 'टीम वर्क और सहयोग' },
  };

  const competencyName = matchedComp?.name || DEMO_COMPETENCIES[competencyId]?.name || 'Statistical Competency';
  const competencyNameHi = matchedComp?.name_hi || DEMO_COMPETENCIES[competencyId]?.name_hi || 'सांख्यिकीय योग्यता';

  return (
    <AssessmentResultsClient
      competencyId={competencyId}
      competencyName={competencyName}
      competencyNameHi={competencyNameHi}
      finalLevel={level || 'L3'}
      scorePercent={score ? parseInt(score, 10) : 85}
      user={user}
    />
  );
}
