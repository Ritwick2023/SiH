/**
 * StatVidya Institutional Copilot System Prompt
 * Primarily bound to StatVidya, but conversational and helpful on related topics.
 */

export const STATVIDYA_MANIFESTO = [
  'ROLE: You are the StatVidya Copilot — a high-speed, expert AI assistant embedded in the StatVidya platform (India\'s Official Statistical System workforce upskilling and competency governance system for MoSPI).',
  '',
  'You are knowledgeable, fast, conversational, and direct. You have comprehensive, precise, and up-to-date knowledge of the entire StatVidya application architecture, routes, competencies, and roles.',
  '',
  'COMPLETE PLATFORM MAP & NAVIGATION ROUTES:',
  '- `/dashboard`: Role-based command desk.',
  '  * Learner (Amit Sharma, JSO / Sunita Devi, Field Investigator): Hero Bento with verified Readiness Index %, Karma points ledger, quick daily drills, Competency Radar Chart (comp-capi, comp-demarcation, comp-data, comp-survey, comp-scrutiny), CAPI Field Station (IndexedDB status, encryption status), and MoSPI Field Manuals shelf.',
  '  * Trainer (Dr. Priya Verma, NSSTA Faculty): Curriculum Vector DB (1,276 chunks), Question Review Triage queue, Trainee Error Heatmap, Cohort Diagnostics Studio.',
  '  * Admin (Rajesh Kumar, ADG MoSPI HQ): National Governance Command, Ministerial Briefing drawer, statutory NSC compliance, Regional Office Zonal Health (North, South, East, West, Central), Scrutiny Error vs Training Correlation chart (r = -0.84), Flag for Priority Training action.',
  '- `/skill-gap`: Multi-dimensional Competency Gap Matrix. Visualizes deficits between current verified proficiency (L1-L5) and cadre benchmark levels. Weighted calculation: Gap Deficit * Priority Weight (Critical=3x, Important=2x, Desirable=1x). Provides root-cause diagnosis and direct learning remedies.',
  '- `/assignments`: Comprehensive Statutory Assessment Portal. Features verified timed drills across all statistical competencies:',
  '  * 📱 CAPI Tablet Operations (`/assessment/comp-capi`)',
  '  * 🗺️ Schedule 0.0 & UFS Demarcation (`/assessment/comp-demarcation`)',
  '  * 📊 PLFS Survey Methodology (`/assessment/comp-survey`)',
  '  * 📋 Statistical Scrutiny & Validation (`/assessment/comp-scrutiny`)',
  '  * 🧩 Problem Solving (`/assessment/problem-solving`)',
  '  * 🔍 Critical Thinking (`/assessment/critical-thinking`)',
  '  * 💬 Field Communication (`/assessment/communication`)',
  '  * ⚖️ Decision Making (`/assessment/decision-making`)',
  '  Includes countdown timers, review palettes, and 100% offline field execution with IndexedDB synchronization.',
  '- `/mcq-generator`: MoSPI Document Practice & MCQ Station. Ingests official MoSPI guidelines and field instruction manuals. Generates authentic self-paced questions grounded in selected manuals. Calibrates across 3 clean difficulty levels: Easy, Medium, and Hard (no verbose parentheticals). Choose 1, 5, 10, or 25 questions.',
  '- `/documents`: Interactive MoSPI Documentation Library & Vector Ingestion Station. Upload official survey manuals (PDF/TXT) directly. Includes live search bar, competency filter pills (CAPI Operations, Demarcation, Data Scrutiny, Sampling & Design, Field Validation), chunk count analytics, in-website confirmation modal for deletion, and direct "Practice Questions from Manuals" action.',
  '- `/pathways`: iGOT Karmayogi Personalized Learning Pathways. Curated official training courses mapped directly to identified competency gaps. Prioritizes Critical and Important gap courses from NSSTA, MoSPI Training Division, and iGOT Karmayogi.',
  '- `/review-queue`: Faculty Item Analysis & Review Queue. Allows trainers to triage AI-generated questions, verify competency alignment, inspect low-confidence items, and approve/reject questions for national banks.',
  '- `/profile`: Official Cadre Dossier & Verification Profile. Displays official cadre, employee ID, verified FRAC competency badges (Assessment-Verified vs Self-Assessed), growth timeline, and career progression milestones.',
  '',
  'KEY ARCHITECTURAL HIGHLIGHTS:',
  '- Mission Karmayogi FRAC: Framework of Roles, Activities, and Competencies spanning 5 proficiency tiers: L1 (Basic Awareness), L2 (Guided Application), L3 (Independent Field Application), L4 (Supervisory/Expert), L5 (Strategic Leadership).',
  '- CAPI Offline Engine: Works 100% offline in remote field areas using IndexedDB encrypted storage. Automatically queues test submissions and syncs idempotently via local_id on reconnection.',
  '- Bilingual Support: Full English and Hindi (हिन्दी) parity across all screens and messages. Seamless language switcher in Topbar.',
  '- Official Cadres: NSSO Field Operations Division (FOD), Subordinate Statistical Service (SSS), Indian Statistical Service (ISS), NSSTA Faculty.',
  '',
  'RESPONSE STYLE:',
  '- START DIRECTLY: Answer immediately with actionable guidance. Omit pleasantries, meta-commentary, and conversational filler.',
  '- CONCISE & READABLE: Keep answers compact, clean, structured, and easy to read in a small chat widget.',
  '- CLEAN TYPOGRAPHY: Never spam asterisks. Bold at most 1-2 primary phrases. Avoid wrapping every bullet title in **.',
  '- INTERACTIVE ROUTES: Always format platform routes in backticks like `/dashboard`, `/assignments`, `/skill-gap`, `/mcq-generator`, `/documents`, `/pathways`, or `/profile` so they render as interactive clickable links.',
  '- PERSONALIZATION: Use the active user context (name, role, cadre, priority gaps, readiness index) to tailor advice directly to their workflow.',
  '- BILINGUAL EXCELLENCE: If the user preferred language is Hindi, respond in fluent, professional Hindi (देवनागरी लिपि) while keeping route paths in backticks.',
  '',
  'TONE: Authoritative, rapid, direct, supportive, and grounded in MoSPI standards.',
].join('\n');


export interface CopilotUserContext {
  role?: string;
  cadre?: string;
  name?: string;
  designation?: string;
  readinessIndex?: number;
  topGaps?: Array<{ competency: string; levelDelta: number; priority: string }>;
  preferredLanguage?: 'en' | 'hi' | string;
}

export function getSystemPromptWithContext(userContext?: CopilotUserContext): string {
  if (!userContext) return STATVIDYA_MANIFESTO;

  const gapsStr = userContext.topGaps?.length
    ? userContext.topGaps
        .map((g) => g.competency + ' (-' + g.levelDelta + ', ' + g.priority + ')')
        .join(' | ')
    : 'None identified yet';

  const readiness =
    userContext.readinessIndex !== undefined
      ? userContext.readinessIndex + '%'
      : 'N/A';

  const isHindi = userContext.preferredLanguage === 'hi';

  const contextBlock = [
    '[ACTIVE USER CONTEXT]',
    'Name: ' + (userContext.name || 'User'),
    'Role: ' + (userContext.role || 'learner') + ' | Cadre: ' + (userContext.cadre || 'NSSO (FOD)'),
    'Designation: ' + (userContext.designation || 'N/A'),
    'Readiness: ' + readiness,
    'Priority Gaps: ' + gapsStr,
    'Preferred Interface Language: ' + (isHindi ? 'Hindi (हिन्दी)' : 'English'),
    isHindi
      ? 'CRITICAL DIRECTIVE: The user has selected HINDI as their platform language. Respond in fluent, professional HINDI (देवनागरी लिपि) while keeping route paths in backticks like `/dashboard` or `/skill-gap`. Address the user politely. Do not overuse asterisks (**).'
      : 'DIRECTIVE: Frame your response around resolving these specific gaps using the platform routes above. Address the user by name in English. Do not overuse asterisks (**).',
  ].join('\n');

  return STATVIDYA_MANIFESTO + '\n\n' + contextBlock;
}

/**
 * High-speed offline & direct fallback router for common questions and navigation.
 */
export function getOfflineFallbackResponse(message: string, isHindi = false): string {
  const lower = message.toLowerCase().trim();

  // 1. Exact greetings
  if (lower.length < 35 && /^(hi|hey|hello|namaste|help|what can you do|नमस्ते|सहायता|मदद|प्रणाम)[\s!?.]*$/.test(lower)) {
    if (isHindi) {
      return '🙏 नमस्ते! मैं आपका स्टैटविद्या कोपायलट हूँ।\n\nमैं आपकी निम्नलिखित में त्वरित सहायता कर सकता हूँ:\n- 📊 डैशबोर्ड (`/dashboard`) — तैयारी सूचकांक और कर्म अंक देखें\n- 🎯 कौशल अंतर (`/skill-gap`) — योग्यता अंतराल और रडार चार्ट समझें\n- 📝 मूल्यांकन (`/assignments`) — 8 आधिकारिक परीक्षण दें\n- 🧠 अभ्यास MCQ (`/mcq-generator`) — MoSPI मैनुअल से प्रश्न तैयार करें\n- 📄 दस्तावेज़ (`/documents`) — सर्वेक्षण नियमावली खोजें व पढ़ें\n- 🛤️ अध्ययन पथ (`/pathways`) — iGOT कर्मयोगी पाठ्यक्रम खोजें\n- 👤 प्रोफ़ाइल (`/profile`) — संवर्ग विवरण और सत्यापित बैज देखें\n\nआप क्या खोजना चाहते हैं?';
    }
    return '🙏 Namaste! I am your StatVidya Copilot.\n\nI can help you instantly navigate:\n- 📊 Dashboard (`/dashboard`) — View Readiness Index & Karma Points\n- 🎯 Skill Gap (`/skill-gap`) — Analyze competency gaps on the Radar Chart\n- 📝 Assessments (`/assignments`) — Take any of the 8 statutory drills\n- 🧠 Practice MCQs (`/mcq-generator`) — Grounded question practice\n- 📄 Documents (`/documents`) — Browse & search official MoSPI manuals\n- 🛤️ Pathways (`/pathways`) — Recommended iGOT Karmayogi courses\n- 👤 Profile (`/profile`) — Official cadre dossier & verified badges\n\nWhat would you like to explore?';
  }

  // 2. Dashboard Navigation
  if (/\b(dashboard|command desk|readiness index|karma|home)\b/.test(lower) || lower.includes('डैशबोर्ड') || lower.includes('होम')) {
    if (isHindi) {
      return '📊 डैशबोर्ड पर जाने के लिए साइडबार में `/dashboard` पर क्लिक करें।\n\nयहाँ आप अपना समग्र तैयारी सूचकांक %, कर्म अंक, योग्यता रडार चार्ट और दैनिक अभ्यास देख सकते हैं।';
    }
    return '📊 Navigate to `/dashboard` in the sidebar.\n\nYou will find your verified Readiness Index %, Karma points ledger, Competency Radar chart, and daily operational drills.';
  }

  // 3. Skill Gap Navigation
  if (/\b(skill.?gap|radar|competency gap|gap analysis|deficits?)\b/.test(lower) || lower.includes('कौशल') || lower.includes('अंतर')) {
    if (isHindi) {
      return '🎯 कौशल अंतर विश्लेषण देखने के लिए `/skill-gap` पर जाएं।\n\nयह आपके वर्तमान स्तर और संवर्ग लक्ष्य स्तर (L1-L5) के बीच के अंतर को प्राथमिकता भार (गंभीर=3x, महत्वपूर्ण=2x, वांछनीय=1x) के साथ प्रदर्शित करता है।';
    }
    return '🎯 Navigate to `/skill-gap` in the sidebar.\n\nThis maps your verified proficiency against cadre target levels (L1-L5) with weighted priority multipliers (Critical 3.0x, Important 2.0x, Desirable 1.0x).';
  }

  // 4. Assessments & Assignments Navigation
  if (/\b(assessment|assignment|drill|test|exam|capi test|plfs test)\b/.test(lower) || lower.includes('मूल्यांकन') || lower.includes('परीक्षा') || lower.includes('टेस्ट')) {
    if (isHindi) {
      return '📝 सभी 8 वैधानिक परीक्षण देखने के लिए `/assignments` पर जाएं।\n\n- सीधे CAPI परीक्षण शुरू करने के लिए: `/assessment/comp-capi`\n- सीमांकन व अनुसूची 0.0: `/assessment/comp-demarcation`\n- पीएलएफएस सर्वेक्षण: `/assessment/comp-survey`\n- सांख्यिकीय जांच: `/assessment/comp-scrutiny`\n\nये परीक्षण 100% ऑफ़लाइन भी कार्य करते हैं!';
    }
    return '📝 Visit `/assignments` to view all 8 statutory assessments.\n\n- Quick link for CAPI Operations: `/assessment/comp-capi`\n- Schedule 0.0 Demarcation: `/assessment/comp-demarcation`\n- PLFS Methodology: `/assessment/comp-survey`\n- Statistical Scrutiny: `/assessment/comp-scrutiny`\n\nTests work 100% offline via encrypted IndexedDB!';
  }

  // 5. MCQ Generator & Question Practice Navigation
  if (/\b(mcq|quiz|generate.*question|question.*generator|practice.*question|practice mcq)\b/.test(lower) || lower.includes('प्रश्न') || lower.includes('क्विज़')) {
    if (isHindi) {
      return '🧠 MoSPI दस्तावेज़ आधारित MCQ जनरेटर के लिए `/mcq-generator` पर जाएं।\n\nयहाँ आप आधिकारिक MoSPI मैनुअल चुन सकते हैं, लक्षित कठिनाई (सरल, मध्यम, कठिन) तय कर सकते हैं, और 1, 5, 10 या 25 प्रश्नों का तुरंत अभ्यास कर सकते हैं।';
    }
    return '🧠 Navigate to `/mcq-generator` under Content Tools.\n\nSelect an ingested MoSPI manual, set your Target Difficulty (Easy, Medium, or Hard), and generate authentic questions for self-paced calibration.';
  }

  // 6. Documents & Manuals Navigation
  if (/\b(document|manual|upload|pdf|handbook|guideline)\b/.test(lower) || lower.includes('दस्तावेज़') || lower.includes('मैनुअल')) {
    if (isHindi) {
      return '📄 आधिकारिक सर्वेक्षण नियमावली के लिए `/documents` पर जाएं।\n\nयहाँ आप PLFS, CAPI और ASSE मैनुअल खोज सकते हैं, योग्यता के अनुसार फ़िल्टर कर सकते हैं और सीधे प्रश्न अभ्यास शुरू कर सकते हैं।';
    }
    return '📄 Navigate to `/documents` in the sidebar.\n\nBrowse official MoSPI instruction manuals (PLFS, CAPI, Schedule 0.0), filter by competency, or upload new guidelines.';
  }

  // 7. Pathways & iGOT Courses Navigation
  if (/\b(pathway|igot|course|recommend|training module)\b/.test(lower) || lower.includes('कोर्स') || lower.includes('पाठ्यक्रम')) {
    if (isHindi) {
      return '🛤️ अनुशंसित अध्ययन पथ देखने के लिए `/pathways` पर जाएं।\n\niGOT कर्मयोगी और NSSTA पाठ्यक्रम सीधे आपके योग्यता अंतराल की गंभीरता के अनुसार प्राथमिकता पर दिखाए जाते हैं।';
    }
    return '🛤️ Navigate to `/pathways` in the sidebar.\n\niGOT Karmayogi & NSSTA courses are ranked directly by your gap severity to quickly close operational deficits.';
  }

  // 8. Review Queue Navigation
  if (/\b(review|review queue|triage|approve question|faculty)\b/.test(lower) || lower.includes('समीक्षा')) {
    if (isHindi) {
      return '✅ फैकल्टी समीक्षा कतार के लिए `/review-queue` पर जाएं।\n\nयहाँ संकाय AI-जनरेटेड प्रश्नों का विश्लेषण करते हैं और उन्हें आधिकारिक प्रश्न बैंक में स्वीकृत करते हैं।';
    }
    return '✅ Navigate to `/review-queue` under Content Tools.\n\nReview AI-generated questions, verify competency alignment, and approve items for national testing banks.';
  }

  // 9. Profile Navigation
  if (/\b(profile|badge|cadre|my details|account)\b/.test(lower) || lower.includes('प्रोफ़ाइल') || lower.includes('संवर्ग')) {
    if (isHindi) {
      return '👤 अपनी आधिकारिक प्रोफ़ाइल देखने के लिए `/profile` पर जाएं।\n\nयहाँ आपके संवर्ग विवरण, सत्यापित प्रवीणता बैज, और करियर समयरेखा प्रदर्शित होती है।';
    }
    return '👤 Navigate to `/profile` in the sidebar.\n\nInspect your official cadre credentials, verified FRAC competency badges, and career progression timeline.';
  }

  // 10. Admin Analytics & Correlation Navigation
  if (/\b(admin|analytics|correlation|zonal|regional office|flag.*training)\b/.test(lower) || lower.includes('प्रशासन') || lower.includes('विश्लेषण')) {
    if (isHindi) {
      return '📈 प्रशासनिक विश्लेषण के लिए `/dashboard#correlation` या `/dashboard#regional-offices` पर जाएं।\n\nयहाँ क्षेत्रीय कार्यालय स्वास्थ्य और जांच त्रुटि बनाम प्रशिक्षण सहसंबंध (r = -0.84) का अवलोकन करें।';
    }
    return '📈 Navigate to `/dashboard#correlation` or `/dashboard#regional-offices` on the Admin command desk.\n\nInspect regional health across national zones and the scrutiny error correlation (r = -0.84).';
  }

  // 11. Offline & Sync Operations
  if (/\b(offline|sync|indexeddb|internet|connectivity)\b/.test(lower) || lower.includes('ऑफ़लाइन') || lower.includes('सिंक')) {
    if (isHindi) {
      return '📡 स्टैटविद्या का CAPI इंजन 100% ऑफ़लाइन कार्य करता है। परीक्षण के उत्तर IndexedDB में सुरक्षित रहते हैं और इंटरनेट जुड़ते ही स्वतः सिंक हो जाते हैं। स्थिति देखने के लिए टॉपबार में ऑफ़लाइन सूचक देखें।';
    }
    return '📡 StatVidya works 100% offline via encrypted IndexedDB storage. Field assessments queue safely and sync automatically once internet reconnects. Check the Topbar status pill anytime.';
  }

  // 12. Language Switcher
  if (/\b(language|hindi|english|translate|switch language)\b/.test(lower) || lower.includes('भाषा') || lower.includes('हिन्दी')) {
    if (isHindi) {
      return '🌐 भाषा बदलने के लिए टॉपबार में भाषा बटन (EN / हिन्दी) पर क्लिक करें। पूरा मंच तत्काल अनुवादित हो जाता है।';
    }
    return '🌐 Click the language toggle (EN / हिन्दी) in the Topbar to switch between English and Hindi across the entire platform.';
  }

  // Default Guidance
  if (isHindi) {
    return '🙏 मैं आपकी सहायता के लिए उपस्थित हूँ! आप सीधे पूछ सकते हैं:\n- "डैशबोर्ड कैसे देखें?" (`/dashboard`)\n- "कौशल अंतर क्या है?" (`/skill-gap`)\n- "मूल्यांकन कैसे शुरू करें?" (`/assignments`)\n- "MCQ का अभ्यास कैसे करें?" (`/mcq-generator`)\n- "MoSPI मैनुअल कहां हैं?" (`/documents`)\n- "iGOT कोर्स कौन से हैं?" (`/pathways`)';
  }
  return '🤖 I am ready to guide you across StatVidya! You can ask:\n- "Where is the dashboard?" (`/dashboard`)\n- "Show my skill gaps" (`/skill-gap`)\n- "How do I take assessments?" (`/assignments`)\n- "Generate practice MCQs" (`/mcq-generator`)\n- "Browse official documents" (`/documents`)\n- "Recommend iGOT courses" (`/pathways`)';
}

