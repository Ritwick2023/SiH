/**
 * src/data/copilotFaqResponses.ts
 *
 * Curated, high-fidelity pre-made responses for frequently asked questions and
 * quick-action prompts in StatVidya Copilot.
 *
 * When a user selects a suggestion or asks a standard FAQ, the Copilot can
 * respond immediately after a brief simulated AI thinking delay (~500ms),
 * saving API quota while providing a lightning-fast, delightful experience.
 */

import type { CopilotUserContext } from '@/lib/copilotPrompt';

export interface PreMadeFaq {
  id: string;
  matchPatterns: (string | RegExp)[];
  getResponse: (userContext?: CopilotUserContext) => string;
}

export const COPILOT_PREMADE_FAQS: PreMadeFaq[] = [
  {
    id: 'greeting',
    matchPatterns: [
      /^(hi|hey|hello|namaste|yo|sup|hii+|heyy+|hola|good\s*(morning|afternoon|evening)|नमस्ते|हेलो|प्रणाम|सहायता|मदद|help)[!?\s.]*$/i,
      /^what\s*(can\s*you|do\s*you)\s*(do|help)/i,
      /^who\s*are\s*you/i,
      /^tell\s*me\s*about\s*(yourself|this\s*(app|platform|bot))/i,
      /^आप\s*कौन\s*हैं/i,
      /^क्या\s*कर\s*सकत/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      const name = ctx?.name;
      if (isHi) {
        return `🙏 ${name ? `नमस्ते, ${name}!` : 'नमस्ते!'} मैं आपका स्टैटविद्या कोपायलट हूँ।

मैं आपकी निम्नलिखित में त्वरित सहायता कर सकता हूँ:
- 📊 डैशबोर्ड (\`/dashboard\`) — तैयारी सूचकांक और कर्म अंक
- 🎯 कौशल अंतर (\`/skill-gap\`) — योग्यता अंतराल विश्लेषण
- 📝 मूल्यांकन (\`/assignments\`) — 8 आधिकारिक परीक्षण
- 🧠 MCQ अभ्यास (\`/mcq-generator\`) — MoSPI मैनुअल से प्रश्न
- 📄 दस्तावेज़ (\`/documents\`) — सर्वेक्षण नियमावली
- 🛤️ अध्ययन पथ (\`/pathways\`) — iGOT पाठ्यक्रम
- 👤 प्रोफ़ाइल (\`/profile\`) — संवर्ग विवरण

आप क्या खोजना चाहते हैं?`;
      }
      return `🙏 ${name ? `Namaste, ${name}!` : 'Namaste!'} I'm your StatVidya Copilot.

I can help you instantly with:
- 📊 Dashboard (\`/dashboard\`) — Readiness Index & Karma Points
- 🎯 Skill Gap (\`/skill-gap\`) — Competency gap analysis
- 📝 Assessments (\`/assignments\`) — 8 statutory drills
- 🧠 Practice MCQs (\`/mcq-generator\`) — MoSPI manual practice
- 📄 Documents (\`/documents\`) — Official MoSPI manuals
- 🛤️ Pathways (\`/pathways\`) — iGOT Karmayogi courses
- 👤 Profile (\`/profile\`) — Cadre dossier & badges

What would you like to explore?`;
    },
  },
  {
    id: 'thanks',
    matchPatterns: [
      /^(thanks?|thank\s*you|thx|ty|appreciated?|great|awesome|perfect|got\s*it|ok\s*thanks?|धन्यवाद|शुक्रिया|बहुत\s*अच्छा)[!?\s.]*$/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🙏 आपका स्वागत है! कोई और प्रश्न हो तो बेझिझक पूछें।`;
      }
      return `🙏 You're welcome! Feel free to ask anything else about the platform.`;
    },
  },
  {
    id: 'readiness-index',
    matchPatterns: [
      'What is my readiness index and how can I improve it?',
      /readiness\s*index/i,
      /how\s*can\s*i\s*improve\s*(my\s*)?readiness/i,
      /what\s*is\s*my\s*readiness/i,
      /my\s*readiness/i,
      /improve\s*readiness/i,
      /readiness\s*score/i,
      /तैयारी\s*सूचकांक/i,
      /मेरी\s*तैयारी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      const name = ctx?.name ? `**${ctx.name}**` : isHi ? 'अधिकारी' : 'Officer';
      const designation = ctx?.designation || (isHi ? 'सांख्यिकी अधिकारी' : 'Statistical Official');

      if (isHi) {
        return `### 📊 आपका तैयारी सूचकांक (Readiness Index)

नमस्ते ${name}! एक **${designation}** के रूप में, आपका **तैयारी सूचकांक** यह दर्शाता है कि आपकी भूमिका के लिए आवश्यक कुल FRAC योग्यताओं में से कितने प्रतिशत में आपकी सत्यापित प्रवीणता लक्ष्य स्तर के बराबर या उससे अधिक है।

#### यह कैसे काम करता है:
- **गणितीय सूत्र**: तैयारी सूचकांक की गणना आपके संवर्ग के लिए आवश्यक भारित सत्यापित योग्यताओं के योग को कुल आवश्यक लक्ष्य भार से विभाजित करके की जाती है।
- **प्राथमिकता गुणक**: **गंभीर (Critical)** योग्यताओं का भार 3.0×, **महत्वपूर्ण (Important)** का 2.0×, और **वांछनीय (Desirable)** का 1.0× होता है।

#### 🚀 अपनी तैयारी बढ़ाने के 3 त्वरित उपाय:
1. **गंभीर कमियों को लक्षित करें**: \`/skill-gap\` पर जाएं और देखें कि किन उच्च-प्रभाव योग्यताओं में सबसे अधिक अंतर है।
2. **अनुकूली मूल्यांकन पूर्ण करें**: \`/assessment/comp-capi\` पर सत्यापित टेस्ट दें और अपनी प्रवीणता स्तर को L1/L2 से आगे बढ़ाएं।
3. **सिफारिश किए गए पाठ्यक्रमों में नामांकन करें**: कमियों को दूर करने के लिए \`/pathways\` पर MoSPI/iGOT शिक्षण मॉड्यूल देखें।`;
      }

      return `### 📊 Understanding Your Readiness Index

Hello ${name}! As a **${designation}**, your **Readiness Index** represents the percentage of your role's required FRAC competencies where your verified proficiency level meets or exceeds the target level.

#### How It Works:
- **Mathematical Formula**: Readiness is calculated as the sum of weighted verified competencies divided by total required target weights for your cadre.
- **Priority Multipliers**: **Critical** competencies carry a 3.0× weight, **Important** carry 2.0×, and **Desirable** carry 1.0×.

#### 🚀 3 Ways to Quickly Boost Your Readiness:
1. **Target Critical Gaps**: Head to \`/skill-gap\` to see which high-impact competencies have the largest deficit.
2. **Complete Adaptive Assessments**: Take verified assessments on \`/assessment/comp-capi\` to promote your competency level from L1/L2 to higher proficiency.
3. **Enroll in Recommended Courses**: Explore tailored MoSPI/iGOT learning modules on \`/pathways\` to close practical gaps.`;
    },
  },
  {
    id: 'skill-gaps',
    matchPatterns: [
      'Show me my top competency gaps and what to do about them',
      /top\s*(competency\s*|skill\s*)?gaps/i,
      /what\s*are\s*my\s*gaps/i,
      /skill\s*gaps?/i,
      /competency\s*gaps?/i,
      /gap\s*analysis/i,
      /show\s*(me\s*)?(my\s*)?gaps/i,
      /कौशल\s*अंतर/i,
      /योग्यता\s*कमी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🎯 आपका योग्यता अंतराल विश्लेषण (Competency Gap Analysis)

स्टैटविद्या आपके वर्तमान सत्यापित स्तर और संवर्ग के लक्ष्य स्तर के बीच के अंतर के आधार पर कमियों को 3 गंभीरता स्तरों में वर्गीकृत करता है:

#### गंभीरता वर्गीकरण:
- **उच्च गंभीरता (गंभीर अंतर)**: किसी गंभीर योग्यता (जैसे CAPI टैबलेट संचालन या सर्वेक्षण नमूनाकरण) पर 2+ स्तरों का अंतर। इसके लिए तत्काल प्रशिक्षण हस्तक्षेप की आवश्यकता है।
- **मध्यम गंभीरता**: महत्वपूर्ण योग्यताओं पर 1 स्तर का अंतर, या वांछनीय योग्यताओं पर 2 स्तरों का अंतर।
- **दक्ष (Proficient)**: आप अपनी भूमिका के लक्ष्य मानदंड को पूरा करते हैं या उससे आगे हैं!

#### अगले कदम:
- \`/dashboard\` पर अपना इंटरैक्टिव **योग्यता रडार चार्ट** देखें।
- \`/skill-gap\` पर मूल कारणों की विस्तृत जानकारी देखें।
- \`/pathways\` पर अनुशंसित प्रशिक्षण पाठ्यक्रमों में सीधे प्रवेश लें।`;
      }

      return `### 🎯 Your Competency Gap Analysis

StatVidya classifies your competency gaps into 3 severity levels based on the deficit between your **current verified level** and your **cadre target level**:

#### Gap Severity Classifications:
- **High Severity (Critical Deficit)**: Deficit of 2+ levels on a Critical priority competency (e.g., CAPI Tablet Operations or Survey Sampling). Requires immediate training intervention.
- **Moderate Severity**: Deficit of 1 level on Critical/Important competencies, or 2 levels on Desirable competencies.
- **Proficient**: You meet or exceed your role's target benchmark!

#### Next Steps:
- Review your interactive **Competency Radar Chart** on \`/dashboard\`.
- Check detailed root-cause insights and operational impact on \`/skill-gap\`.
- Jump straight to targeted training pathways on \`/pathways\`.`;
    },
  },
  {
    id: 'take-assessment',
    matchPatterns: [
      'How do I start an assessment?',
      /start\s*(an\s*)?assessment/i,
      /take\s*(an?\s*)?assessment/i,
      /take\s*(an?\s*)?test/i,
      /how\s*to\s*test/i,
      /begin\s*(a\s*)?test/i,
      /give\s*(a\s*)?test/i,
      /attempt\s*(a\s*)?test/i,
      /मूल्यांकन\s*कैसे/i,
      /परीक्षा\s*शुरू/i,
      /टेस्ट\s*दें/i,
      /टेस्ट\s*कैसे/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 📝 अनुकूली मूल्यांकन शुरू करना (Starting an Adaptive Assessment)

स्टैटविद्या पर मूल्यांकन MoSPI / NSSO प्रोटोकॉल के तहत आपके व्यावहारिक परिचालन कौशल को सत्यापित करने के लिए बनाए गए हैं।

#### मूल्यांकन इंजन कैसे काम करता है:
- **अनुकूली प्रश्न**: आपके वास्तविक समय के उत्तरों के आधार पर प्रश्न सरल, मध्यम और कठिन के बीच स्वचालित रूप से समायोजित होते हैं।
- **समयबद्ध सिमुलेशन**: मानक आकलनों में उलटी गिनती टाइमर और अंतिम सबमिशन से पहले समीक्षा पैलेट शामिल होता है।
- **स्वचालित पदोन्नति**: **70% या अधिक** अंक प्राप्त करने पर आपकी प्रोफ़ाइल में सत्यापित FRAC प्रवीणता स्तर स्वतः अपग्रेड हो जाता है।
- **ऑफ़लाइन सक्षम**: आप रुक-रुक कर आने वाले इंटरनेट के साथ भी परीक्षा पूरी कर सकते हैं — उत्तर आपके ब्राउज़र कैश में सुरक्षित रहते हैं।

👉 **शुरू करने के लिए तैयार हैं?** अपना मूल्यांकन शुरू करने के लिए \`/assessment/comp-capi\` पर जाएं!`;
      }

      return `### 📝 Starting an Adaptive Assessment

Assessments on StatVidya are designed to verify your practical operational skills under MoSPI / NSSO protocols.

#### How the Assessment Engine Works:
- **Adaptive Questions**: Questions dynamically calibrate between Easy, Medium, and Hard based on your real-time responses.
- **Timed Simulation**: Standard assessments feature a countdown timer and a review palette before final submission.
- **Automatic Promotion**: Scoring **70% or above** automatically upgrades your verified FRAC competency level in your official profile.
- **Offline Capable**: You can complete tests even with intermittent field internet — submissions queue safely in your browser cache.

👉 **Ready to test?** Visit \`/assessment/comp-capi\` to begin your CAPI Tablet Operations assessment!`;
    },
  },
  {
    id: 'recommend-courses',
    matchPatterns: [
      'Recommend iGOT courses for my skill gaps',
      /recommend\s*(igot\s*)?courses/i,
      /recommended?\s*courses/i,
      /what\s*courses?\s*should\s*i\s*take/i,
      /suggest\s*(some\s*)?courses/i,
      /igot\s*courses/i,
      /learning\s*pathway/i,
      /पाठ्यक्रम\s*सिफारिश/i,
      /कोर्स\s*सुझाव/i,
      /कोर्स\s*बताएं/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      const cadre = ctx?.cadre || (isHi ? 'आधिकारिक सांख्यिकी प्रणाली' : 'Official Statistical System');

      if (isHi) {
        return `### 🛤️ अनुशंसित iGOT कर्मयोगी पाठ्यक्रम

यहाँ **${cadre}** के लिए सर्वोच्च प्राथमिकता वाले पाठ्यक्रम दिए गए हैं:

#### 1. 📱 उन्नत CAPI टैबलेट संचालन और तुल्यकालन
- **योग्यता**: CAPI टैबलेट संचालन (L3 लक्ष्य)
- **अवधि**: 4.5 घंटे | **प्रदाता**: NSSTA / MoSPI
- **फोकस**: घरेलू सूचीकरण, त्रुटि सुलह, ऑफ़लाइन डेटा कैशिंग।

#### 2. 📊 बड़े पैमाने के सर्वेक्षणों में बहु-चरणीय स्तरीकृत नमूनाकरण
- **योग्यता**: सर्वेक्षण नमूनाकरण और डिज़ाइन (L3 लक्ष्य)
- **अवधि**: 6.0 घंटे | **प्रदाता**: NSSTA
- **फोकस**: द्वितीय-चरण चयन, गुणक गणना, नमूनाकरण भिन्नता।

#### 3. 🔍 सांख्यिकीय डेटा जांच और सत्यापन नियम
- **योग्यता**: डेटा प्रविष्टि और जांच (L3 लक्ष्य)
- **अवधि**: 3.5 घंटे | **प्रदाता**: MoSPI प्रशिक्षण प्रभाग
- **फोकस**: अनुसूची 0.0 जांच नियम, स्थिरता परीक्षण।

पूर्ण कैटलॉग देखने के लिए \`/pathways\` पर जाएं!`;
      }

      return `### 🛤️ Recommended iGOT Karmayogi Courses

Here are the highest-priority courses curated for the **${cadre}**:

#### 1. 📱 Advanced CAPI Tablet Operations & Synchronization
- **Competency**: CAPI Tablet Operation (L3 Target)
- **Duration**: 4.5 Hours | **Provider**: NSSTA / MoSPI
- **Focus**: Household listing, error flag reconciliation, offline CAPI data caching.

#### 2. 📊 Multistage Stratified Sampling in Large-Scale Surveys
- **Competency**: Survey Sampling & Design (L3 Target)
- **Duration**: 6.0 Hours | **Provider**: NSSTA
- **Focus**: Second-stage stratum selection, multiplier calculation, sampling variance.

#### 3. 🔍 Statistical Data Scrutiny, Validation Rules & Outlier Detection
- **Competency**: Data Entry & Scrutiny (L3 Target)
- **Duration**: 3.5 Hours | **Provider**: MoSPI Training Division
- **Focus**: Schedule 0.0 scrutiny rules, cross-table ratio consistency.

Visit \`/pathways\` to browse the full catalog with direct enrolment links!`;
    },
  },
  {
    id: 'frac-levels',
    matchPatterns: [
      'Explain the FRAC competency levels L1 to L5',
      /explain\s*(the\s*)?frac/i,
      /frac\s*(competency\s*)?levels/i,
      /l1\s*to\s*l5/i,
      /what\s*is\s*frac/i,
      /what\s*does\s*frac\s*mean/i,
      /frac\s*framework/i,
      /frac\s*kya\s*hai/i,
      /स्तर\s*l1/i,
      /फ्रैक\s*स्तर/i,
      /फ्रैक\s*क्या/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🏛️ मिशन कर्मयोगी FRAC स्तर (L1 – L5)

**भूमिकाओं, गतिविधियों और योग्यताओं के ढांचे (FRAC)** के तहत, सांख्यिकीय प्रवीणता को पाँच प्रगतिशील स्तरों में मानकीकृत किया गया है:

- **L1 (बुनियादी जागरूकता)**: मुख्य शब्दावली, परिभाषाओं और बुनियादी मानकों को समझता है। प्रत्यक्ष पर्यवेक्षण की आवश्यकता होती है।
- **L2 (मार्गदर्शित समझ)**: न्यूनतम सहायता के साथ नियमित डेटा प्रविष्टि, CAPI प्रविष्टि और मानक अनुसूचियां भरने में सक्षम।
- **L3 (स्वतंत्र अनुप्रयोग)**: क्षेत्र में स्वतंत्र रूप से कार्य करता है। गैर-मानक स्थितियों और जांच परीक्षणों को संभालने में सक्षम।
- **L4 (विशेषज्ञ / पर्यवेक्षी)**: फील्ड टीमों का पर्यवेक्षण करता है, गुणवत्ता ऑडिट करता है और कनिष्ठ कर्मचारियों का मार्गदर्शन करता है।
- **L5 (रणनीतिक नेतृत्व)**: सर्वेक्षण पद्धति तैयार करता है, राष्ट्रीय नमूना डिजाइन परिभाषित करता है और सांख्यिकीय नीति का नेतृत्व करता है।

जैसे-जैसे आप अधिकृत शिक्षण पथ और अनुकूली आकलन पूरा करते हैं, आपका सत्यापित स्तर बढ़ता जाता है!`;
      }

      return `### 🏛️ Mission Karmayogi FRAC Levels (L1 – L5)

Under the **Framework for Roles, Activities, and Competencies (FRAC)**, statistical proficiency is standardized across five progressive tiers:

- **L1 (Basic Awareness)**: Understands core terminology, definitions, and standard acronyms. Requires direct supervision.
- **L2 (Intermediate / Guided)**: Able to carry out routine data canvassing, CAPI entry, and standard schedule filling with minimal assistance.
- **L3 (Advanced / Independent)**: Operates autonomously in the field. Capable of handling non-standard field situations and scrutiny checks.
- **L4 (Expert / Supervisory)**: Supervises field teams, conducts quality audits, scrutinizes primary schedules, and mentors junior staff.
- **L5 (Master / Strategic)**: Designs survey methodology, defines national sampling designs, and leads statistical policy formulation.

Your verified level increases as you complete authorized learning pathways and adaptive assessments!`;
    },
  },
  {
    id: 'platform-guide',
    matchPatterns: [
      'Give me a quick overview of all platform features',
      /overview\s*of\s*(all\s*)?platform/i,
      /platform\s*(guide|tour|overview)/i,
      /features?\s*overview/i,
      /what\s*can\s*(this|statvidya)\s*do/i,
      /what\s*(is|are)\s*(all\s*)?(the\s*)?features/i,
      /show\s*me\s*(all\s*)?(the\s*)?features/i,
      /platform\s*features/i,
      /मंच\s*का\s*परिचय/i,
      /सुविधाएं/i,
      /सब\s*कुछ\s*बताओ/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🧭 स्टैटविद्या मंच का त्वरित अवलोकन

स्टैटविद्या **सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)** के लिए भारत का समर्पित AI-संचालित क्षमता प्रबंधन मंच है।

#### मुख्य मॉड्यूल:
- 📊 **डैशबोर्ड (\`/dashboard\`)**: अपना रीयल-टाइम तैयारी सूचकांक, व्यक्तिगत प्रगति और योग्यता रडार देखें।
- 🎯 **कौशल अंतर मैट्रिक्स (\`/skill-gap\`)**: प्राथमिकता भार और उपचारात्मक सुझावों के साथ परिचालन कमियों का विश्लेषण करें।
- 📝 **अनुकूली मूल्यांकन (\`/assessment/comp-capi\`)**: तत्काल स्कोरिंग और स्तर उन्नयन के साथ लाइव परीक्षा इंजन।
- 🛤️ **अध्ययन पथ (\`/pathways\`)**: आपकी कमियों से सीधे जुड़े MoSPI और iGOT पाठ्यक्रम।
- 📑 **सर्वेक्षण दस्तावेज़ पार्सर (\`/documents\`)**: NSSO/NSSTA मैनुअल अपलोड करें और तुरंत योग्यता संरचना बनाएं।
- 🤖 **AI MCQ जनरेटर (\`/mcq-generator\`)**: आधिकारिक सांख्यिकीय हैंडबुक से प्रश्न बैंक तैयार करें।
- 🏛️ **कार्यबल शासन (\`/admin/analytics\`)**: विभागीय जांच ऑडिट, तैयारी सहसंबंध और प्राथमिकता प्रशिक्षण ध्वजारोहण।`;
      }

      return `### 🧭 StatVidya Platform Tour

StatVidya is India's dedicated AI-powered competency management system for the **Ministry of Statistics and Programme Implementation (MoSPI)**.

#### Core Platform Modules:
- 📊 **Dashboard (\`/dashboard\`)**: Track your real-time Readiness Index, personalized greeting, and competency radar overview.
- 🎯 **Skill Gap Matrix (\`/skill-gap\`)**: Drill down into operational skill gaps with priority weights and remedial suggestions.
- 📝 **Assessments & Statutory Drills (\`/assignments\`)**: 8 timed verified tests (including CAPI, Demarcation, PLFS, and Scrutiny).
- 🧠 **Practice MCQs (\`/mcq-generator\`)**: Generate self-paced questions grounded directly in uploaded MoSPI manuals.
- 📄 **MoSPI Documents Library (\`/documents\`)**: Ingest, search, and practice questions from official MoSPI survey manuals.
- 🛤️ **Learning Pathways (\`/pathways\`)**: Curated MoSPI & iGOT courses matched directly to your deficits.
- 👤 **Profile & Cadre Dossier (\`/profile\`)**: Official cadre credentials, verified FRAC badges, and career timeline.
- 🏛️ **Admin Workforce Governance (\`/dashboard#regional-offices\`)**: Regional health, scrutiny error correlations, and priority flagging.`;
    },
  },
  {
    id: 'nav-documents',
    matchPatterns: [
      'Where can I find MoSPI manuals and documents?',
      /where\s*(are|can\s*i\s*find)\s*(the\s*)?(manuals?|documents?|pdfs?)/i,
      /how\s*to\s*upload\s*manual/i,
      /open\s*documents?/i,
      /go\s*to\s*documents?/i,
      /mospi\s*manuals?/i,
      /survey\s*manuals?/i,
      /upload\s*(a\s*)?document/i,
      /दस्तावेज़\s*कहाँ/i,
      /मैनुअल\s*कहाँ/i,
      /दस्तावेज़\s*कैसे/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 📄 MoSPI दस्तावेज़ और सर्वेक्षण नियमावली
        
आधिकारिक सर्वेक्षण मैनुअल और दिशानिर्देश देखने के लिए \`/documents\` पर जाएं।

#### मुख्य सुविधाएं:
- **लाइव खोज व फ़िल्टर**: PLFS, CAPI और Schedule 0.0 मैनुअल को तुरंत खोजें।
- **योग्यता फ़िल्टर**: CAPI ऑपरेशंस, सीमांकन, डेटा जांच, या नमूनाकरण के अनुसार छांटें।
- **प्रश्न अभ्यास**: किसी भी मैनुअल से सीधे प्रश्न हल करने के लिए "अभ्यास" बटन पर क्लिक करें।
- **दस्तावेज़ अपलोड**: MoSPI प्रशिक्षण सामग्री को सुरक्षित रूप से अपलोड करें।`;
      }
      return `### 📄 MoSPI Documents & Manuals Library

Head to \`/documents\` in the sidebar to access official MoSPI survey manuals and guidelines.

#### Key Features:
- **Live Search & Filters**: Search across PLFS, CAPI, Schedule 0.0, and ASSE manuals.
- **Competency Pills**: Filter by CAPI Operations, Demarcation, Data Scrutiny, Sampling & Design, or Field Validation.
- **Direct Question Practice**: Click "Practice Questions from Manuals" to jump straight into \`/mcq-generator\` with grounded context.
- **Document Ingestion**: Upload official PDF and TXT guidelines safely with automatic chunk indexing.`;
    },
  },
  {
    id: 'nav-mcq-generator',
    matchPatterns: [
      'How does the MCQ Generator work?',
      /how\s*(does\s*)?(the\s*)?mcq\s*generator\s*work/i,
      /how\s*to\s*generate\s*(mcqs?|questions?|quiz)/i,
      /open\s*(mcq|quiz)/i,
      /go\s*to\s*(mcq|quiz)/i,
      /practice\s*(mcq|question)/i,
      /generate\s*(mcq|question)/i,
      /mcq\s*station/i,
      /mcq\s*kaise/i,
      /एमसीक्यू\s*जनरेटर/i,
      /प्रश्न\s*कैसे\s*बनाएं/i,
      /अभ्यास\s*प्रश्न/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🧠 MoSPI दस्तावेज़ अभ्यास एवं MCQ स्टेशन
        
स्व-गति से प्रश्न अभ्यास करने के लिए \`/mcq-generator\` पर जाएं।

#### यह कैसे काम करता है:
1. **दस्तावेज़ चुनें**: अपने अपलोड किए गए MoSPI मैनुअल में से किसी एक को चुनें (जैसे PLFS Field Instruction Manual 2024-25)।
2. **लक्षित कठिनाई तय करें**: अपनी तैयारी के अनुसार **सरल**, **मध्यम**, या **कठिन** चुनें।
3. **प्रश्नों की संख्या**: 1, 5, 10, या 25 प्रश्नों का चयन करें और तुरंत प्रामाणिक प्रश्नों का अभ्यास करें!`;
      }
      return `### 🧠 MoSPI Document Practice & MCQ Station

Head to \`/mcq-generator\` under Content Tools for self-paced, authenticated question generation.

#### How It Works:
1. **Select Grounding Manual**: Choose from ingested MoSPI manuals (e.g. PLFS Field Instruction Manual 2024-25 or CAPI Operations Manual).
2. **Target Difficulty**: Clean 3-tier calibration — **Easy**, **Medium**, or **Hard**.
3. **Question Volume**: Generate 1, 5, 10, or 25 questions grounded strictly in official MoSPI methodology!`;
    },
  },
  {
    id: 'nav-assignments',
    matchPatterns: [
      'What tests and assignments are available?',
      /what\s*(tests?|assignments?|drills?)\s*(are\s*)?available/i,
      /list\s*(all\s*)?tests/i,
      /show\s*(all\s*)?(the\s*)?assessments/i,
      /all\s*tests/i,
      /all\s*assessments/i,
      /how\s*many\s*tests/i,
      /which\s*tests/i,
      /परीक्षण\s*सूची/i,
      /कौन\s*से\s*टेस्ट\s*हैं/i,
      /सभी\s*टेस्ट/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 📝 वैधानिक मूल्यांकन एवं टेस्ट सूची

सभी 8 आधिकारिक परीक्षण देने के लिए \`/assignments\` पर जाएं:

1. 📱 **CAPI टैबलेट संचालन**: \`/assessment/comp-capi\`
2. 🗺️ **अनुसूची 0.0 एवं UFS सीमांकन**: \`/assessment/comp-demarcation\`
3. 📊 **PLFS सर्वेक्षण कार्यप्रणाली**: \`/assessment/comp-survey\`
4. 📋 **सांख्यिकीय डेटा जांच और सत्यापन**: \`/assessment/comp-scrutiny\`
5. 🧩 **समस्या समाधान**: \`/assessment/problem-solving\`
6. 🔍 **समीक्षात्मक सोच**: \`/assessment/critical-thinking\`
7. 💬 **संचार दक्षता**: \`/assessment/communication\`
8. ⚖️ **निर्णय क्षमता**: \`/assessment/decision-making\`

सभी टेस्ट में टाइमर और समीक्षा पैलेट शामिल हैं, तथा ये ऑफ़लाइन भी कार्य करते हैं!`;
      }
      return `### 📝 Statutory Assessments & Drills Catalog

Visit \`/assignments\` to take any of the 8 verified statutory drills:

1. 📱 **CAPI Tablet Operations**: \`/assessment/comp-capi\`
2. 🗺️ **Schedule 0.0 & UFS Demarcation**: \`/assessment/comp-demarcation\`
3. 📊 **PLFS Survey Methodology**: \`/assessment/comp-survey\`
4. 📋 **Statistical Scrutiny & Validation Rules**: \`/assessment/comp-scrutiny\`
5. 🧩 **Problem Solving**: \`/assessment/problem-solving\`
6. 🔍 **Critical Thinking**: \`/assessment/critical-thinking\`
7. 💬 **Field Communication**: \`/assessment/communication\`
8. ⚖️ **Decision Making**: \`/assessment/decision-making\`

Each test features timed simulations, progress palettes, and automatic FRAC competency level verification upon scoring 70%+!`;
    },
  },
  {
    id: 'nav-offline-capi',
    matchPatterns: [
      'How does offline mode work?',
      /how\s*(does\s*)?offline\s*(mode\s*)?work/i,
      /can\s*i\s*work\s*without\s*internet/i,
      /offline\s*(mode|support|work)/i,
      /indexeddb/i,
      /no\s*internet/i,
      /without\s*internet/i,
      /ऑफ़लाइन\s*काम/i,
      /बिना\s*इंटरनेट/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 📡 CAPI ऑफ़लाइन इंजन और सिंक प्रणाली

स्टैटविद्या दूरस्थ ग्रामीण और जनजातीय क्षेत्रों में बिना इंटरनेट के कार्य करने के लिए पूरी तरह सुसज्जित है:

- **IndexedDB एन्क्रिप्टेड स्टोरेज**: आपके सभी परीक्षण उत्तर और प्रगति ब्राउज़र के स्थानीय सुरक्षित कैश में सहेजे जाते हैं।
- **स्वतः तुल्यकालन**: जैसे ही डिवाइस इंटरनेट से जुड़ता है, सभी कतारबद्ध उत्तर क्लाउड से सुरक्षित रूप से सिंक हो जाते हैं।
- **टॉपबार स्थिति सूचक**: शीर्ष बार में वास्तविक समय सिंक स्थिति (ऑफ़लाइन, सिंक हो रहा है, पूर्ण) देखें।`;
      }
      return `### 📡 CAPI Offline Engine & Synchronization

StatVidya is engineered for seamless operation in remote field environments without active internet connectivity:

- **IndexedDB Encrypted Cache**: All your active test attempts, draft responses, and session tokens are cached locally and securely.
- **Idempotent Background Sync**: Submissions automatically queue and reconcile idempotently using unique local IDs upon network restoration.
- **Real-Time Status Indicator**: Monitor your CAPI offline status anytime via the connectivity pill in the top navigation bar.`;
    },
  },
  {
    id: 'nav-profile',
    matchPatterns: [
      'Where is my profile and badges?',
      /where\s*(is|are)\s*my\s*profile/i,
      /how\s*to\s*see\s*my\s*badges/i,
      /view\s*(my\s*)?(cadre|profile)\s*details/i,
      /open\s*(my\s*)?profile/i,
      /go\s*to\s*(my\s*)?profile/i,
      /my\s*profile/i,
      /my\s*badges/i,
      /मेरी\s*प्रोफ़ाइल/i,
      /बैज\s*कहाँ/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 👤 संवर्ग प्रोफ़ाइल एवं सत्यापित बैज

अपनी आधिकारिक क्रेडेंशियल देखने के लिए \`/profile\` पर जाएं:

- **आधिकारिक संवर्ग विवरण**: संवर्ग, कर्मचारी आईडी, पदनाम और तैनाती क्षेत्र।
- **FRAC प्रवीणता बैज**: मूल्यांकन-सत्यापित बनाम स्व-मूल्यांकित बैज।
- **विकास समयरेखा**: पूर्ण किए गए परीक्षणों और शिक्षण मील के पत्थरों का आधिकारिक रिकॉर्ड।`;
      }
      return `### 👤 Official Cadre Profile & Badges

Navigate to \`/profile\` in the sidebar (or click your user avatar in the Topbar):

- **Cadre Dossier**: View official cadre, designation, employee ID, and department deployment.
- **Verified FRAC Badges**: Inspect Assessment-Verified vs Self-Assessed competency credentials.
- **Career Growth Timeline**: Track milestones from completed statutory drills and verified pathway courses.`;
    },
  },
  {
    id: 'nav-dashboard',
    matchPatterns: [
      /where\s*(is\s*)?(the\s*|my\s*)?dashboard/i,
      /go\s*to\s*(the\s*|my\s*)?dashboard/i,
      /open\s*(the\s*|my\s*)?dashboard/i,
      /show\s*(me\s*)?(the\s*|my\s*)?dashboard/i,
      /dashboard\s*kahan/i,
      /डैशबोर्ड\s*कहाँ/i,
      /डैशबोर्ड\s*दिखाओ/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📊 डैशबोर्ड पर जाने के लिए साइडबार में \`/dashboard\` पर क्लिक करें।

यहाँ आप अपना समग्र तैयारी सूचकांक %, कर्म अंक, योग्यता रडार चार्ट और दैनिक अभ्यास देख सकते हैं।`;
      }
      return `📊 Navigate to \`/dashboard\` in the sidebar.

You will find your verified Readiness Index %, Karma points ledger, Competency Radar chart, and daily operational drills.`;
    },
  },
  {
    id: 'nav-pathways',
    matchPatterns: [
      /where\s*(are\s*)?(the\s*)?(learning\s*)?pathways?/i,
      /go\s*to\s*(the\s*)?pathways?/i,
      /open\s*(the\s*)?pathways?/i,
      /igot\s*karmayogi/i,
      /अध्ययन\s*पथ/i,
      /पाठ्यक्रम\s*कहाँ/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🛤️ अनुशंसित अध्ययन पथ देखने के लिए \`/pathways\` पर जाएं।

iGOT कर्मयोगी और NSSTA पाठ्यक्रम सीधे आपके योग्यता अंतराल की गंभीरता के अनुसार प्राथमिकता पर दिखाए जाते हैं।`;
      }
      return `🛤️ Navigate to \`/pathways\` in the sidebar.

iGOT Karmayogi & NSSTA courses are ranked directly by your gap severity to quickly close operational deficits.`;
    },
  },
  {
    id: 'nav-review-queue',
    matchPatterns: [
      /where\s*(is\s*)?(the\s*)?review\s*queue/i,
      /go\s*to\s*(the\s*)?review/i,
      /open\s*review/i,
      /faculty\s*review/i,
      /question\s*review/i,
      /approve\s*questions?/i,
      /समीक्षा\s*कतार/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `✅ फैकल्टी समीक्षा कतार के लिए \`/review-queue\` पर जाएं।

यहाँ संकाय AI-जनरेटेड प्रश्नों का विश्लेषण करते हैं और उन्हें आधिकारिक प्रश्न बैंक में स्वीकृत करते हैं।`;
      }
      return `✅ Navigate to \`/review-queue\` under Content Tools.

Review AI-generated questions, verify competency alignment, and approve items for national testing banks.`;
    },
  },
  {
    id: 'nav-language',
    matchPatterns: [
      /how\s*(do\s*i|to)\s*(change|switch)\s*(the\s*)?language/i,
      /how\s*do\s*i\s*switch\s*between\s*english\s*and\s*hindi/i,
      /switch\s*(between\s*)?(english\s*and\s*hindi|hindi\s*and\s*english)/i,
      /switch\s*(to\s*)?(hindi|english)/i,
      /change\s*language/i,
      /language\s*(switch|change|toggle)/i,
      /भाषा\s*बदल/i,
      /हिन्दी\s*में\s*बदल/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🌐 भाषा बदलने के लिए टॉपबार में भाषा बटन (EN / हिन्दी) पर क्लिक करें। पूरा मंच तत्काल अनुवादित हो जाता है।`;
      }
      return `🌐 Click the language toggle (EN / हिन्दी) in the Topbar to switch between English and Hindi across the entire platform.`;
    },
  },
  {
    id: 'karma-points',
    matchPatterns: [
      /karma\s*points?/i,
      /what\s*are\s*karma/i,
      /how\s*do\s*i\s*(earn|get)\s*karma/i,
      /कर्म\s*अंक/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `⭐ कर्म अंक आपकी प्लेटफ़ॉर्म गतिविधि और सीखने की प्रगति का माप है।

आप कर्म अंक कैसे अर्जित करते हैं:
- मूल्यांकन पूर्ण करने पर
- MCQ अभ्यास पूर्ण करने पर
- iGOT पाठ्यक्रम पूरा करने पर
- दैनिक अभ्यास पूर्ण करने पर

अपने कर्म अंक \`/dashboard\` पर देखें।`;
      }
      return `⭐ Karma points measure your platform activity and learning progress.

You earn Karma by:
- Completing assessments
- Practicing MCQs from MoSPI manuals
- Finishing iGOT pathway courses
- Completing daily operational drills

View your Karma ledger on \`/dashboard\`.`;
    },
  },
  {
    id: 'capi-operations',
    matchPatterns: [
      /what\s*is\s*capi/i,
      /capi\s*(tablet\s*)?operations?/i,
      /capi\s*kya\s*hai/i,
      /capi\s*क्या/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📱 CAPI (कंप्यूटर सहायित व्यक्तिगत साक्षात्कार) MoSPI के क्षेत्रीय सर्वेक्षणों के लिए टैबलेट-आधारित डेटा संग्रह प्रणाली है।

- \`/assessment/comp-capi\` पर CAPI कौशल परीक्षण दें।
- स्टैटविद्या का CAPI इंजन IndexedDB के साथ 100% ऑफ़लाइन कार्य करता है।
- घरेलू सूचीकरण, डेटा प्रविष्टि और त्रुटि सुलह सहित सभी फील्ड संचालन शामिल हैं।`;
      }
      return `📱 CAPI (Computer Assisted Personal Interviewing) is MoSPI's tablet-based data collection system for field surveys.

- Take the CAPI skills assessment at \`/assessment/comp-capi\`.
- StatVidya's CAPI engine works 100% offline with encrypted IndexedDB storage.
- Covers household listing, data canvassing, error reconciliation, and field sync protocols.`;
    },
  },
  {
    id: 'plfs-survey',
    matchPatterns: [
      /what\s*is\s*plfs/i,
      /plfs\s*(survey|methodology)/i,
      /periodic\s*labour\s*force/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📊 PLFS (आवधिक श्रम बल सर्वेक्षण) MoSPI/NSSO द्वारा संचालित भारत का प्रमुख रोज़गार सर्वेक्षण है।

- PLFS सर्वेक्षण कार्यप्रणाली का आकलन: \`/assessment/comp-survey\`
- PLFS फ़ील्ड इंस्ट्रक्शन मैनुअल: \`/documents\` पर खोजें
- अभ्यास प्रश्न: \`/mcq-generator\` पर PLFS मैनुअल चुनकर MCQ बनाएं`;
      }
      return `📊 PLFS (Periodic Labour Force Survey) is India's premier employment survey conducted by MoSPI/NSSO.

- Assessment on PLFS methodology: \`/assessment/comp-survey\`
- PLFS Field Instruction Manual: Search on \`/documents\`
- Practice questions: Generate MCQs from the PLFS manual on \`/mcq-generator\``;
    },
  },
  {
    id: 'admin-analytics',
    matchPatterns: [
      /admin\s*(dashboard|analytics|panel)/i,
      /regional\s*offices?/i,
      /zonal\s*health/i,
      /scrutiny\s*error/i,
      /correlation\s*chart/i,
      /flag\s*for\s*training/i,
      /workforce\s*governance/i,
      /प्रशासन/i,
      /क्षेत्रीय\s*कार्यालय/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📈 प्रशासनिक विश्लेषण के लिए \`/dashboard\` पर Admin व्यू देखें।

- **क्षेत्रीय कार्यालय स्वास्थ्य**: उत्तर, दक्षिण, पूर्व, पश्चिम, मध्य ज़ोन का प्रदर्शन।
- **जांच त्रुटि बनाम प्रशिक्षण सहसंबंध**: r = -0.84 (अधिक प्रशिक्षण = कम त्रुटियाँ)।
- **प्राथमिकता प्रशिक्षण ध्वजारोहण**: कमज़ोर क्षेत्रों को तत्काल प्रशिक्षण के लिए चिह्नित करें।`;
      }
      return `📈 Access Admin analytics on \`/dashboard\` with the Admin view.

- **Regional Office Zonal Health**: Performance across North, South, East, West, and Central zones.
- **Scrutiny Error vs Training Correlation**: r = -0.84 (more training = fewer errors).
- **Priority Training Flags**: Flag underperforming regions for immediate training intervention.`;
    },
  },
  {
    id: 'mospi-info',
    matchPatterns: [
      /what\s*is\s*mospi/i,
      /mospi\s*(kya|meaning)/i,
      /ministry\s*of\s*statistics/i,
      /mospi\s*क्या/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🏛️ MoSPI — सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय, भारत सरकार।

MoSPI राष्ट्रीय सांख्यिकीय संगठन (NSO), NSSO और NSSTA का संचालन करता है। स्टैटविद्या MoSPI के कार्यबल के लिए AI-संचालित क्षमता प्रबंधन प्रदान करता है।`;
      }
      return `🏛️ MoSPI — Ministry of Statistics and Programme Implementation, Government of India.

MoSPI oversees the National Statistical Office (NSO), NSSO, and NSSTA. StatVidya provides AI-powered competency management for MoSPI's workforce across all cadres.`;
    },
  },
  {
    id: 'statvidya-info',
    matchPatterns: [
      /what\s*is\s*statvidya/i,
      /about\s*statvidya/i,
      /statvidya\s*(kya|meaning)/i,
      /tell\s*me\s*about\s*statvidya/i,
      /स्टैटविद्या\s*क्या/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📚 स्टैटविद्या भारत का AI-संचालित क्षमता प्रबंधन मंच है, जो MoSPI के कार्यबल (NSSO, SSS, ISS, NSSTA) के लिए बनाया गया है।

मुख्य विशेषताएं:
- मिशन कर्मयोगी FRAC (L1-L5) योग्यता ट्रैकिंग
- अनुकूली मूल्यांकन और तैयारी सूचकांक
- iGOT कर्मयोगी अध्ययन पथ
- MoSPI मैनुअल से AI MCQ जनरेशन
- 100% ऑफ़लाइन फील्ड ऑपरेशन

अधिक जानने के लिए \`/dashboard\` पर जाएं।`;
      }
      return `📚 StatVidya is India's AI-powered competency management platform built for MoSPI's workforce (NSSO, SSS, ISS, NSSTA).

Key Features:
- Mission Karmayogi FRAC (L1-L5) competency tracking
- Adaptive assessments and Readiness Index
- iGOT Karmayogi learning pathways
- AI MCQ generation from official MoSPI manuals
- 100% offline field operations via encrypted IndexedDB

Visit \`/dashboard\` to get started.`;
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW FAQ entries for Knowledge Base (covering all 54 categories questions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mission-karmayogi',
    matchPatterns: [
      /what\s*is\s*mission\s*karmayogi/i,
      /mission\s*karmayogi\s*(kya|meaning)/i,
      /कर्मयोगी\s*क्या/i,
      /मिशन\s*कर्मयोगी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🏛️ मिशन कर्मयोगी भारत सरकार की राष्ट्रीय सिविल सेवा क्षमता निर्माण पहल है।

इसके 6 स्तंभ हैं, जिनमें FRAC (भूमिकाओं, गतिविधियों और योग्यताओं का ढाँचा) सबसे महत्वपूर्ण है। स्टैटविद्या इसी FRAC ढाँचे को MoSPI कार्यबल के लिए लागू करता है।

- iGOT कर्मयोगी पोर्टल अधिकारियों को प्रशिक्षण प्रदान करता है
- FRAC L1-L5 स्तरों में योग्यता को मानकीकृत करता है
- स्टैटविद्या \`/pathways\` पर iGOT पाठ्यक्रम सीधे उपलब्ध कराता है`;
      }
      return `🏛️ Mission Karmayogi is the Government of India's National Programme for Civil Services Capacity Building (NPCSCB).

It has 6 pillars, with FRAC (Framework for Roles, Activities, and Competencies) being the most critical. StatVidya implements this FRAC framework specifically for MoSPI's workforce.

- iGOT Karmayogi portal provides official training courses
- FRAC standardizes competency at L1-L5 proficiency levels
- StatVidya integrates iGOT courses directly on \`/pathways\``;
    },
  },
  {
    id: 'ai-features',
    matchPatterns: [
      /how\s*does\s*ai\s*help/i,
      /ai\s*(features?|capabilities)/i,
      /what\s*ai\s*(does|do)/i,
      /artificial\s*intelligence/i,
      /ai\s*कैसे\s*मदद/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🤖 स्टैटविद्या में AI कई तरह से मदद करता है:

- **अनुकूली मूल्यांकन**: AI आपके उत्तरों के आधार पर प्रश्नों की कठिनाई स्वचालित रूप से समायोजित करता है
- **MCQ जनरेशन**: Gemini AI MoSPI मैनुअल से प्रामाणिक प्रश्न तैयार करता है (\`/mcq-generator\`)
- **कोपायलट चैटबॉट**: यह AI सहायक आपको प्लेटफ़ॉर्म नेविगेट करने और FRAC को समझने में मदद करता है
- **स्मार्ट अनुशंसा**: आपकी कमियों के आधार पर पाठ्यक्रमों की स्वचालित सिफारिश
- **दस्तावेज़ पार्सिंग**: PDF मैनुअल को स्वचालित रूप से चंक और इंडेक्स करता है`;
      }
      return `🤖 AI powers several key features in StatVidya:

- **Adaptive Assessments**: AI dynamically adjusts question difficulty based on your responses
- **MCQ Generation**: Gemini AI generates authenticated questions from MoSPI manuals (\`/mcq-generator\`)
- **Copilot Chatbot**: This AI assistant helps you navigate the platform and understand FRAC
- **Smart Recommendations**: Auto-recommends courses based on your competency gaps
- **Document Parsing**: Automatically chunks and indexes uploaded PDF manuals for search`;
    },
  },
  {
    id: 'hindi-availability',
    matchPatterns: [
      /is\s*(this\s*)?(platform|app|website)\s*available\s*in\s*hindi/i,
      /hindi\s*(support|available|version)/i,
      /does\s*(this|the)\s*(platform|app)\s*support\s*hindi/i,
      /हिन्दी\s*में\s*उपलब्ध/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🌐 हाँ! स्टैटविद्या पूरी तरह से द्विभाषी (अंग्रेज़ी और हिन्दी) है।

- **पूरा इंटरफ़ेस**: डैशबोर्ड, मूल्यांकन, प्रोफ़ाइल — सब कुछ हिन्दी में
- **मूल्यांकन प्रश्न**: सभी 8 परीक्षणों में हिन्दी अनुवाद उपलब्ध
- **कोपायलट**: यह चैटबॉट भी हिन्दी में उत्तर देता है
- **भाषा बदलें**: टॉपबार में EN / हिन्दी टॉगल पर क्लिक करें`;
      }
      return `🌐 Yes! StatVidya is fully bilingual — English and Hindi throughout.

- **Complete Interface**: Dashboard, assessments, profile — everything in Hindi
- **Assessment Questions**: All 8 statutory drills include Hindi translations
- **Copilot**: This chatbot responds in Hindi too
- **Switch Language**: Click the EN / हिन्दी toggle in the Topbar`;
    },
  },
  {
    id: 'radar-chart',
    matchPatterns: [
      /competency\s*radar\s*chart/i,
      /radar\s*chart/i,
      /रडार\s*चार्ट/i,
      /योग्यता\s*रडार/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📊 योग्यता रडार चार्ट \`/dashboard\` पर आपकी FRAC प्रोफ़ाइल का विज़ुअल मानचित्र है।

- **कैसे काम करता है**: प्रत्येक अक्ष आपकी एक योग्यता दर्शाता है (जैसे CAPI, सीमांकन, डेटा जांच)
- **दो परतें**: बाहरी वलय = लक्ष्य स्तर, भीतरी क्षेत्र = आपका वर्तमान सत्यापित स्तर
- **अंतराल दृश्य**: बाहरी और भीतरी के बीच का अंतर आपकी कमी दर्शाता है
- **रंग कोड**: हरा = दक्ष, पीला = मध्यम अंतर, लाल = गंभीर कमी`;
      }
      return `📊 The Competency Radar Chart on \`/dashboard\` visually maps your FRAC profile.

- **How it works**: Each axis represents one competency (e.g., CAPI, Demarcation, Data Scrutiny)
- **Two layers**: Outer ring = target level, inner shaded area = your current verified level
- **Gap visibility**: The gap between outer and inner shows your deficit at a glance
- **Color coded**: Green = proficient, Yellow = moderate gap, Red = critical deficit`;
    },
  },
  {
    id: 'role-dashboard',
    matchPatterns: [
      /what\s*does\s*my\s*dashboard\s*show\s*(based\s*on|for)\s*my\s*role/i,
      /role\s*based\s*dashboard/i,
      /dashboard\s*for\s*(learner|trainer|admin)/i,
      /भूमिका\s*के\s*लिए\s*डैशबोर्ड/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📊 डैशबोर्ड आपकी भूमिका के अनुसार बदलता है:

**शिक्षार्थी (Learner)**: तैयारी सूचकांक, कर्म अंक, योग्यता रडार, दैनिक अभ्यास, CAPI स्टेशन, अनुशंसित पाठ्यक्रम

**प्रशिक्षक (Trainer)**: संकाय कमान डेस्क, प्रश्न समीक्षा कतार, प्रशिक्षु त्रुटि विश्लेषण, MCQ स्टूडियो

**प्रशासक (Admin)**: कार्यबल कमान डेस्क, क्षेत्रीय कार्यालय स्वास्थ्य, जांच-प्रशिक्षण सहसंबंध, प्राथमिकता ध्वजारोहण

टॉपबार में भूमिका बदलकर अलग-अलग व्यू देखें।`;
      }
      return `📊 The dashboard adapts to your role:

**Learner**: Readiness Index, Karma points, Competency Radar, daily drills, CAPI station, recommended courses

**Trainer**: Faculty Command Desk, question review queue, trainee error analytics, MCQ Item Studio

**Admin**: Workforce Command Desk, Regional Office health, scrutiny-training correlation, priority flagging

Switch roles via the Topbar role switcher to see different views.`;
    },
  },
  {
    id: 'gap-severity',
    matchPatterns: [
      /what\s*do\s*the\s*gap\s*severity/i,
      /gap\s*severity\s*levels?/i,
      /severity\s*(levels?|classification)/i,
      /गंभीरता\s*स्तर/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🎯 योग्यता अंतराल गंभीरता के 3 स्तर:

- **उच्च गंभीरता**: गंभीर (Critical) योग्यता पर 2+ स्तरों का अंतर। तत्काल प्रशिक्षण आवश्यक।
- **मध्यम गंभीरता**: गंभीर/महत्वपूर्ण योग्यता पर 1 स्तर का अंतर, या वांछनीय पर 2 स्तर।
- **दक्ष (Proficient)**: आप लक्ष्य मानदंड को पूरा करते हैं या उससे आगे हैं!

विस्तृत विश्लेषण के लिए \`/skill-gap\` पर जाएं।`;
      }
      return `🎯 Gap severity has 3 levels:

- **High Severity**: Deficit of 2+ levels on a Critical priority competency. Requires immediate intervention.
- **Moderate Severity**: Deficit of 1 level on Critical/Important, or 2 levels on Desirable competencies.
- **Proficient**: You meet or exceed the target benchmark!

Visit \`/skill-gap\` for detailed root-cause analysis.`;
    },
  },
  {
    id: 'priority-weights',
    matchPatterns: [
      /priority\s*weights?\s*(calculated|formula|work)/i,
      /how\s*are\s*priority\s*weights/i,
      /weight\s*calculation/i,
      /प्राथमिकता\s*भार/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `⚖️ प्राथमिकता भार गणना:

- **गंभीर (Critical)** योग्यताएं: 3.0× भार (जैसे CAPI संचालन)
- **महत्वपूर्ण (Important)** योग्यताएं: 2.0× भार (जैसे डेटा जांच)
- **वांछनीय (Desirable)** योग्यताएं: 1.0× भार (जैसे संचार)

तैयारी सूचकांक = (भारित सत्यापित योग्यता का योग) ÷ (कुल लक्ष्य भार)

गंभीर कमियों को पहले दूर करने से आपका तैयारी सूचकांक तेज़ी से बढ़ता है।`;
      }
      return `⚖️ Priority weight calculation:

- **Critical** competencies: 3.0× weight (e.g., CAPI Operations)
- **Important** competencies: 2.0× weight (e.g., Data Scrutiny)
- **Desirable** competencies: 1.0× weight (e.g., Communication)

Readiness Index = (Sum of weighted verified competencies) ÷ (Total target weights)

Closing Critical gaps first gives you the fastest boost to your Readiness Index.`;
    },
  },
  {
    id: 'close-gaps',
    matchPatterns: [
      /how\s*do\s*i\s*close\s*(my\s*)?(competency\s*)?gaps/i,
      /close\s*(my\s*)?gaps/i,
      /कमियाँ\s*कैसे\s*दूर/i,
      /अंतर\s*कैसे\s*भर/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🚀 अपनी योग्यता कमियाँ दूर करने के 3 तरीके:

1. **अनुकूली मूल्यांकन दें**: \`/assignments\` पर जाकर सत्यापित टेस्ट दें। 70%+ स्कोर पर स्तर स्वतः बढ़ता है।
2. **iGOT पाठ्यक्रम पूरे करें**: \`/pathways\` पर अनुशंसित पाठ्यक्रमों में नामांकन करें।
3. **MCQ अभ्यास करें**: \`/mcq-generator\` पर MoSPI मैनुअल से प्रश्न अभ्यास करें।

सबसे पहले गंभीर (Critical) कमियों पर ध्यान दें — ये 3× भार रखती हैं!`;
      }
      return `🚀 3 ways to close your competency gaps:

1. **Take Adaptive Assessments**: Visit \`/assignments\` for verified tests. Scoring 70%+ auto-promotes your level.
2. **Complete iGOT Courses**: Enroll in recommended courses on \`/pathways\`.
3. **Practice MCQs**: Generate practice questions from MoSPI manuals on \`/mcq-generator\`.

Focus on Critical gaps first — they carry 3× weight in your Readiness Index!`;
    },
  },
  {
    id: 'adaptive-difficulty',
    matchPatterns: [
      /adaptive\s*difficulty/i,
      /how\s*does\s*adaptive\s*(difficulty|testing|question)/i,
      /difficulty\s*adjust/i,
      /अनुकूली\s*कठिनाई/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📝 अनुकूली कठिनाई कैसे काम करती है:

मूल्यांकन इंजन आपके वास्तविक समय के उत्तरों के आधार पर प्रश्नों की कठिनाई समायोजित करता है:

- **सरल (Easy)**: बुनियादी अवधारणाएं और परिभाषाएं
- **मध्यम (Medium)**: अनुप्रयोग और विश्लेषण प्रश्न
- **कठिन (Hard)**: जटिल क्षेत्रीय परिदृश्य और समस्या समाधान

अगर आप लगातार सही जवाब देते हैं तो कठिनाई बढ़ती है, गलत होने पर कम होती है। यह आपके सटीक FRAC स्तर का आकलन करता है।`;
      }
      return `📝 How adaptive difficulty works:

The assessment engine dynamically calibrates question difficulty based on your real-time responses:

- **Easy**: Basic concepts, definitions, and terminology
- **Medium**: Application and analysis questions
- **Hard**: Complex field scenarios and problem-solving

If you answer correctly consistently, difficulty increases. If you struggle, it decreases. This precisely calibrates your FRAC proficiency level.`;
    },
  },
  {
    id: 'scoring-promotion',
    matchPatterns: [
      /what\s*happens\s*when\s*i\s*score\s*70/i,
      /score\s*70\s*percent/i,
      /auto\s*promot/i,
      /automatic\s*promotion/i,
      /70%\s*(or\s*above|plus)/i,
      /70\s*प्रतिशत/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🏆 70% या अधिक स्कोर पर:

- आपका FRAC प्रवीणता स्तर स्वचालित रूप से अपग्रेड होता है (जैसे L1 → L2)
- आपकी प्रोफ़ाइल पर "मूल्यांकन-सत्यापित" बैज लगता है
- तैयारी सूचकांक तुरंत अपडेट होता है
- कर्म अंक अर्जित होते हैं

70% से कम? चिंता न करें — आप दोबारा टेस्ट दे सकते हैं!`;
      }
      return `🏆 When you score 70% or above:

- Your FRAC proficiency level is automatically promoted (e.g., L1 → L2)
- An "Assessment-Verified" badge appears on your profile
- Your Readiness Index updates immediately
- Karma points are awarded

Below 70%? Don't worry — you can retake the assessment!`;
    },
  },
  {
    id: 'retake-assessment',
    matchPatterns: [
      /can\s*i\s*retake/i,
      /retake\s*(an?\s*)?assessment/i,
      /take\s*(the\s*)?(test|assessment)\s*again/i,
      /दोबारा\s*टेस्ट/i,
      /फिर\s*से\s*परीक्षा/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🔄 हाँ! आप किसी भी मूल्यांकन को दोबारा दे सकते हैं।

- प्रत्येक प्रयास का सर्वोच्च स्कोर संरक्षित रहता है
- प्रत्येक प्रयास में नए प्रश्न मिल सकते हैं (अनुकूली इंजन)
- 70%+ स्कोर आने तक बार-बार प्रयास कर सकते हैं
- \`/assignments\` पर जाकर अपनी अगली परीक्षा शुरू करें`;
      }
      return `🔄 Yes! You can retake any assessment multiple times.

- Your highest score across all attempts is preserved
- Each attempt may present different questions (adaptive engine)
- Keep trying until you score 70%+ for automatic level promotion
- Head to \`/assignments\` to start your next attempt`;
    },
  },
  {
    id: 'mcq-difficulty',
    matchPatterns: [
      /what\s*difficulty\s*levels?\s*(are\s*)?(available\s*)?(for\s*)?mcq/i,
      /mcq\s*difficulty/i,
      /एमसीक्यू\s*कठिनाई/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🧠 MCQ जनरेटर में 3 कठिनाई स्तर:

- **सरल (Easy)**: बुनियादी शब्दावली, परिभाषाएं, सीधे तथ्यात्मक प्रश्न
- **मध्यम (Medium)**: अनुप्रयोग-आधारित प्रश्न, प्रक्रिया अनुक्रम, तुलनात्मक विश्लेषण
- **कठिन (Hard)**: जटिल क्षेत्रीय परिदृश्य, बहु-चरणीय समस्या समाधान, अपवाद केस

\`/mcq-generator\` पर जाकर अपना स्तर चुनें!`;
      }
      return `🧠 MCQ Generator offers 3 difficulty levels:

- **Easy**: Basic terminology, definitions, straightforward factual recall
- **Medium**: Application-based questions, process sequences, comparative analysis
- **Hard**: Complex field scenarios, multi-step problem solving, exception cases

Head to \`/mcq-generator\` and pick your level!`;
    },
  },
  {
    id: 'mcq-question-count',
    matchPatterns: [
      /how\s*many\s*questions?\s*can\s*i\s*generate/i,
      /question\s*count/i,
      /generate\s*at\s*once/i,
      /कितने\s*प्रश्न\s*बना/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🧠 MCQ जनरेटर में प्रश्न संख्या विकल्प:

- **1 प्रश्न**: त्वरित एकल अभ्यास
- **5 प्रश्न**: छोटा अभ्यास सत्र
- **10 प्रश्न**: मानक अभ्यास सत्र
- **25 प्रश्न**: गहन तैयारी सत्र

\`/mcq-generator\` पर जाकर मैनुअल और संख्या चुनें!`;
      }
      return `🧠 MCQ Generator question volume options:

- **1 question**: Quick single practice
- **5 questions**: Short practice session
- **10 questions**: Standard practice session
- **25 questions**: Deep preparation session

Visit \`/mcq-generator\`, select your manual, and pick the count!`;
    },
  },
  {
    id: 'mcq-source-docs',
    matchPatterns: [
      /what\s*documents?\s*can\s*i\s*generate\s*mcq/i,
      /mcq\s*(from|source)\s*documents?/i,
      /which\s*manuals?\s*(for\s*)?mcq/i,
      /किन\s*दस्तावेज़ों\s*से\s*mcq/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📄 MCQ जनरेटर आपके अपलोड किए गए MoSPI मैनुअल से प्रश्न बनाता है:

- PLFS फ़ील्ड इंस्ट्रक्शन मैनुअल 2024-25
- CAPI ऑपरेशंस मैनुअल
- अनुसूची 0.0 सीमांकन गाइड
- ASSE सर्वेक्षण मैनुअल
- और आपके द्वारा अपलोड किया गया कोई भी मैनुअल

\`/documents\` पर नए मैनुअल अपलोड करें, फिर \`/mcq-generator\` पर उनसे प्रश्न बनाएं!`;
      }
      return `📄 The MCQ Generator creates questions from your uploaded MoSPI manuals:

- PLFS Field Instruction Manual 2024-25
- CAPI Operations Manual
- Schedule 0.0 Demarcation Guide
- ASSE Survey Manual
- Plus any manual you upload yourself

Upload new manuals on \`/documents\`, then generate MCQs from them on \`/mcq-generator\`!`;
    },
  },
  {
    id: 'doc-upload',
    matchPatterns: [
      /how\s*do\s*i\s*upload\s*(a\s*)?new\s*document/i,
      /upload\s*(a\s*)?(new\s*)?document/i,
      /upload\s*(a\s*)?(new\s*)?manual/i,
      /नया\s*दस्तावेज़\s*(कैसे\s*)?अपलोड/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📤 नया दस्तावेज़ अपलोड करने के लिए:

1. \`/documents\` पर जाएं
2. "दस्तावेज़ अपलोड करें" बटन पर क्लिक करें
3. PDF या TXT फ़ाइल चुनें
4. सिस्टम स्वचालित रूप से दस्तावेज़ को चंक करेगा और इंडेक्स करेगा
5. अपलोड होने के बाद आप इससे MCQ अभ्यास कर सकते हैं

समर्थित प्रारूप: PDF, TXT`;
      }
      return `📤 To upload a new document:

1. Navigate to \`/documents\`
2. Click the "Upload Document" button
3. Select a PDF or TXT file
4. The system will automatically chunk and index the document
5. Once uploaded, you can generate MCQs and practice from it

Supported formats: PDF, TXT`;
    },
  },
  {
    id: 'doc-competency-filter',
    matchPatterns: [
      /can\s*i\s*filter\s*documents?\s*by\s*competency/i,
      /filter\s*(by\s*)?competency/i,
      /competency\s*filter/i,
      /योग्यता\s*(से\s*)?छान/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📄 हाँ! \`/documents\` पर आप योग्यता पिल फ़िल्टर का उपयोग कर सकते हैं:

- **CAPI ऑपरेशंस**: CAPI टैबलेट से संबंधित मैनुअल
- **सीमांकन**: अनुसूची 0.0 और UFS गाइड
- **डेटा जांच**: सत्यापन और जांच नियम
- **नमूनाकरण और डिज़ाइन**: सर्वेक्षण नमूनाकरण
- **क्षेत्रीय सत्यापन**: फील्ड कार्य गाइड

एक या अधिक फ़िल्टर चुनकर प्रासंगिक मैनुअल खोजें।`;
      }
      return `📄 Yes! On \`/documents\` you can use competency pill filters:

- **CAPI Operations**: Tablet-related manuals
- **Demarcation**: Schedule 0.0 and UFS guides
- **Data Scrutiny**: Validation and scrutiny rules
- **Sampling & Design**: Survey sampling methodology
- **Field Validation**: Field work guides

Select one or more filters to find the most relevant manuals.`;
    },
  },
  {
    id: 'doc-practice',
    matchPatterns: [
      /how\s*do\s*i\s*practice\s*(questions?\s*)?(from\s*)?(a\s*)?manual/i,
      /practice\s*from\s*(a\s*)?manual/i,
      /मैनुअल\s*से\s*अभ्यास/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📖 मैनुअल से अभ्यास करने के लिए:

1. \`/documents\` पर जाएं
2. अपना मनचाहा मैनुअल ढूंढें
3. "अभ्यास" बटन पर क्लिक करें — यह आपको \`/mcq-generator\` पर ले जाएगा
4. कठिनाई और प्रश्नों की संख्या चुनें
5. तुरंत अभ्यास शुरू करें!

या सीधे \`/mcq-generator\` पर जाकर ड्रॉपडाउन से मैनुअल चुनें।`;
      }
      return `📖 To practice questions from a manual:

1. Go to \`/documents\`
2. Find your desired manual
3. Click "Practice" — this takes you to \`/mcq-generator\` with that manual pre-selected
4. Choose difficulty and question count
5. Start practicing immediately!

Or go directly to \`/mcq-generator\` and select the manual from the dropdown.`;
    },
  },
  {
    id: 'course-matching',
    matchPatterns: [
      /how\s*are\s*courses?\s*matched\s*to\s*my\s*(skill\s*)?gaps/i,
      /course\s*matching/i,
      /courses?\s*matched/i,
      /कोर्स\s*(मेरी\s*)?कमियों\s*से/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🛤️ पाठ्यक्रम-कमी मिलान प्रणाली:

- प्रत्येक iGOT/NSSTA पाठ्यक्रम एक या अधिक FRAC योग्यताओं से जुड़ा है
- सिस्टम आपकी कमियों की गंभीरता के अनुसार पाठ्यक्रमों को प्राथमिकता देता है
- गंभीर (Critical) कमियों के लिए पाठ्यक्रम सबसे ऊपर दिखते हैं
- \`/pathways\` पर देखें — पाठ्यक्रम पहले से ही सबसे अधिक प्रभावशाली कमी के अनुसार क्रमबद्ध हैं`;
      }
      return `🛤️ Course-gap matching system:

- Each iGOT/NSSTA course is tagged to one or more FRAC competencies
- The system ranks courses by your gap severity — most critical first
- Critical-priority gaps surface courses at the top of the list
- Visit \`/pathways\` — courses are already sorted by highest-impact deficit`;
    },
  },
  {
    id: 'igot-karmayogi',
    matchPatterns: [
      /what\s*is\s*igot\s*karmayogi/i,
      /igot\s*(kya|meaning)/i,
      /igot\s*कर्मयोगी\s*क्या/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🎓 iGOT कर्मयोगी भारत सरकार का ऑनलाइन प्रशिक्षण प्लेटफ़ॉर्म है।

- "Integrated Government Online Training" का संक्षिप्त रूप
- मिशन कर्मयोगी के तहत सभी सिविल सेवकों के लिए
- MoSPI, NSSTA, NSSO आदि विभागों के विशिष्ट पाठ्यक्रम उपलब्ध
- स्टैटविद्या \`/pathways\` पर iGOT पाठ्यक्रमों को सीधे एकीकृत करता है`;
      }
      return `🎓 iGOT Karmayogi is the Government of India's official online training platform.

- Stands for "Integrated Government Online Training"
- Part of Mission Karmayogi for all civil servants
- Offers department-specific courses for MoSPI, NSSTA, NSSO, etc.
- StatVidya integrates iGOT courses directly on \`/pathways\``;
    },
  },
  {
    id: 'training-providers',
    matchPatterns: [
      /what\s*providers?\s*offer\s*(training\s*)?courses/i,
      /training\s*providers?/i,
      /course\s*providers?/i,
      /कौन\s*से\s*संस्थान\s*कोर्स/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🏫 प्रशिक्षण पाठ्यक्रम प्रदाता:

- **NSSTA**: राष्ट्रीय सांख्यिकीय प्रणाली प्रशिक्षण अकादमी — MoSPI का प्रमुख प्रशिक्षण संस्थान
- **MoSPI प्रशिक्षण प्रभाग**: मंत्रालय का आंतरिक प्रशिक्षण
- **iGOT कर्मयोगी**: भारत सरकार का केंद्रीय ऑनलाइन प्रशिक्षण पोर्टल
- **NSSO FOD**: क्षेत्रीय कार्यालय-स्तरीय व्यावहारिक प्रशिक्षण

\`/pathways\` पर सभी प्रदाताओं के पाठ्यक्रम देखें।`;
      }
      return `🏫 Training course providers:

- **NSSTA**: National Statistical Systems Training Academy — MoSPI's premier training institute
- **MoSPI Training Division**: Ministry's internal training programs
- **iGOT Karmayogi**: Government of India's central online training portal
- **NSSO FOD**: Field Operations Division practical training

Browse courses from all providers on \`/pathways\`.`;
    },
  },
  {
    id: 'frac-badges',
    matchPatterns: [
      /what\s*are\s*verified\s*frac\s*badges/i,
      /frac\s*badges?/i,
      /verified\s*badges?/i,
      /सत्यापित\s*frac\s*बैज/i,
      /सत्यापित\s*बैज/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🏅 FRAC बैज आपकी योग्यता प्रवीणता का आधिकारिक प्रमाण हैं:

- **मूल्यांकन-सत्यापित (Assessment-Verified)**: मूल्यांकन में 70%+ स्कोर करके अर्जित — सबसे विश्वसनीय
- **स्व-मूल्यांकित (Self-Assessed)**: प्रोफ़ाइल सेटअप के दौरान स्वयं घोषित

सत्यापित बैज को प्राथमिकता दी जाती है और ये आपकी \`/profile\` पर प्रदर्शित होते हैं।`;
      }
      return `🏅 FRAC Badges are official proof of your competency proficiency:

- **Assessment-Verified**: Earned by scoring 70%+ on a statutory assessment — most trusted
- **Self-Assessed**: Self-declared during profile setup

Verified badges take precedence and are prominently displayed on your \`/profile\`.`;
    },
  },
  {
    id: 'verified-vs-self',
    matchPatterns: [
      /assessment.verified\s*(vs|different|compared)/i,
      /verified\s*(vs|different|compared)\s*(to\s*)?self/i,
      /self.assessed\s*(vs|different|compared)/i,
      /सत्यापित\s*बनाम\s*स्व/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🔍 मूल्यांकन-सत्यापित बनाम स्व-मूल्यांकित:

**मूल्यांकन-सत्यापित**:
- समयबद्ध परीक्षा में 70%+ स्कोर से अर्जित
- आधिकारिक और विश्वसनीय
- तैयारी सूचकांक में पूरा भार

**स्व-मूल्यांकित**:
- ऑनबोर्डिंग के दौरान स्वयं घोषित
- अंतरिम / अनंतिम मूल्य
- मूल्यांकन द्वारा सत्यापन की आवश्यकता

\`/assignments\` पर जाकर अपनी स्व-मूल्यांकित योग्यताओं को सत्यापित करें!`;
      }
      return `🔍 Assessment-Verified vs Self-Assessed:

**Assessment-Verified**:
- Earned by scoring 70%+ on a timed assessment
- Official and trusted
- Full weight in Readiness Index

**Self-Assessed**:
- Self-declared during onboarding
- Provisional / interim value
- Needs verification through assessment

Visit \`/assignments\` to verify your self-assessed competencies!`;
    },
  },
  {
    id: 'career-timeline',
    matchPatterns: [
      /career\s*(growth\s*)?timeline/i,
      /can\s*i\s*see\s*my\s*career/i,
      /growth\s*timeline/i,
      /करियर\s*समयरेखा/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📈 हाँ! \`/profile\` पर आपकी करियर विकास समयरेखा उपलब्ध है:

- पूर्ण किए गए मूल्यांकन और तारीखें
- अर्जित FRAC बैज और स्तर उन्नयन
- पूर्ण किए गए iGOT पाठ्यक्रम
- कर्म अंक इतिहास
- तैयारी सूचकांक की प्रगति`;
      }
      return `📈 Yes! Your career growth timeline is available on \`/profile\`:

- Completed assessments with dates
- Earned FRAC badges and level promotions
- Finished iGOT pathway courses
- Karma points history
- Readiness Index progress over time`;
    },
  },
  {
    id: 'data-offline',
    matchPatterns: [
      /what\s*happens\s*to\s*(my\s*)?data\s*when\s*(i\s*am\s*|i'm\s*)?offline/i,
      /data\s*when\s*offline/i,
      /ऑफ़लाइन\s*होने\s*पर\s*डेटा/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `💾 ऑफ़लाइन होने पर आपका डेटा सुरक्षित रहता है:

- सभी उत्तर ब्राउज़र के IndexedDB में एन्क्रिप्टेड रूप से संग्रहित होते हैं
- परीक्षा प्रगति, ड्राफ्ट और सत्र टोकन स्थानीय रूप से कैश होते हैं
- डेटा ब्राउज़र बंद करने पर भी संरक्षित रहता है
- इंटरनेट आने पर सब कुछ स्वचालित रूप से क्लाउड से सिंक होता है`;
      }
      return `💾 Your data stays safe when offline:

- All responses are stored encrypted in browser IndexedDB
- Test progress, drafts, and session tokens are cached locally
- Data persists even if you close the browser
- Everything syncs automatically to the cloud when internet returns`;
    },
  },
  {
    id: 'data-sync',
    matchPatterns: [
      /how\s*does\s*(data\s*)?sync\s*(work\s*)?(when\s*)?internet\s*returns/i,
      /sync\s*on\s*reconnect/i,
      /data\s*sync/i,
      /इंटरनेट\s*आने\s*पर\s*सिंक/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🔄 इंटरनेट वापस आने पर सिंक प्रक्रिया:

1. **स्वचालित पहचान**: डिवाइस कनेक्टिविटी की जांच करता है
2. **कतार प्रसंस्करण**: सभी कतारबद्ध उत्तर क्रम में भेजे जाते हैं
3. **इडेम्पोटेंट सिंक**: अद्वितीय स्थानीय ID से डुप्लिकेट सबमिशन रोके जाते हैं
4. **स्थिति सूचक**: टॉपबार में सिंक स्थिति (ऑफ़लाइन → सिंक हो रहा है → पूर्ण) दिखती है

कोई डेटा कभी नहीं खोता!`;
      }
      return `🔄 Sync process when internet returns:

1. **Auto-detection**: Device checks connectivity
2. **Queue processing**: All queued submissions are sent in order
3. **Idempotent sync**: Unique local IDs prevent duplicate submissions
4. **Status indicator**: Topbar shows sync status (Offline → Syncing → Complete)

No data is ever lost!`;
    },
  },
  {
    id: 'scrutiny-correlation',
    matchPatterns: [
      /what\s*is\s*(the\s*)?scrutiny\s*error\s*correlation/i,
      /scrutiny\s*(error\s*)?correlation/i,
      /error\s*vs\s*training/i,
      /जांच\s*त्रुटि\s*सहसंबंध/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📉 जांच त्रुटि-प्रशिक्षण सहसंबंध (r = -0.84):

यह Admin डैशबोर्ड पर एक महत्वपूर्ण विश्लेषण है जो दर्शाता है:

- **ऋणात्मक सहसंबंध**: अधिक प्रशिक्षण = कम जांच त्रुटियाँ
- **r = -0.84**: बहुत मजबूत उलटा संबंध
- **निष्कर्ष**: प्रशिक्षण में निवेश सीधे डेटा गुणवत्ता सुधारता है
- \`/dashboard\` पर Admin व्यू में चार्ट देखें`;
      }
      return `📉 Scrutiny Error-Training Correlation (r = -0.84):

This is a key analytic on the Admin dashboard showing:

- **Negative correlation**: More training = fewer scrutiny errors
- **r = -0.84**: Very strong inverse relationship
- **Implication**: Investment in training directly improves data quality
- View the chart on \`/dashboard\` in the Admin view`;
    },
  },
  {
    id: 'flag-regions',
    matchPatterns: [
      /how\s*do\s*i\s*flag\s*regions?\s*for\s*priority\s*training/i,
      /flag\s*(regions?|areas?)\s*for\s*training/i,
      /priority\s*training\s*flag/i,
      /प्रशिक्षण\s*के\s*लिए\s*क्षेत्र\s*(कैसे\s*)?चिह्नित/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🚩 क्षेत्रों को प्राथमिकता प्रशिक्षण के लिए चिह्नित करना:

1. \`/dashboard\` पर Admin व्यू खोलें
2. "क्षेत्रीय कार्यालय स्वास्थ्य" अनुभाग पर जाएं
3. कमज़ोर प्रदर्शन वाले ज़ोन की पहचान करें (लाल/नारंगी)
4. "प्राथमिकता प्रशिक्षण के लिए ध्वजांकित करें" बटन पर क्लिक करें

यह सुविधा केवल Admin भूमिका वाले उपयोगकर्ताओं के लिए उपलब्ध है।`;
      }
      return `🚩 Flagging regions for priority training:

1. Open the Admin view on \`/dashboard\`
2. Navigate to the "Regional Office Health" section
3. Identify underperforming zones (marked red/orange)
4. Click "Flag for Priority Training" on underperforming regions

This feature is available only for Admin role users.`;
    },
  },
  {
    id: 'regional-zones',
    matchPatterns: [
      /what\s*are\s*(the\s*)?regional\s*office\s*(health\s*)?zones/i,
      /regional\s*health\s*zones?/i,
      /zonal\s*breakdown/i,
      /क्षेत्रीय\s*कार्यालय\s*ज़ोन/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🗺️ क्षेत्रीय कार्यालय स्वास्थ्य ज़ोन:

Admin डैशबोर्ड भारत को 5 ज़ोनों में विभाजित करता है:

- **उत्तर ज़ोन**: दिल्ली, UP, हरियाणा, पंजाब, HP, J&K, उत्तराखंड
- **दक्षिण ज़ोन**: तमिलनाडु, कर्नाटक, केरल, AP, तेलंगाना
- **पूर्व ज़ोन**: पश्चिम बंगाल, ओडिशा, बिहार, झारखंड, NE राज्य
- **पश्चिम ज़ोन**: महाराष्ट्र, गुजरात, राजस्थान, गोवा
- **मध्य ज़ोन**: MP, छत्तीसगढ़

\`/dashboard\` पर प्रत्येक ज़ोन का प्रदर्शन स्कोर देखें।`;
      }
      return `🗺️ Regional Office Health Zones:

The Admin dashboard divides India into 5 zones:

- **North Zone**: Delhi, UP, Haryana, Punjab, HP, J&K, Uttarakhand
- **South Zone**: Tamil Nadu, Karnataka, Kerala, AP, Telangana
- **East Zone**: West Bengal, Odisha, Bihar, Jharkhand, NE states
- **West Zone**: Maharashtra, Gujarat, Rajasthan, Goa
- **Central Zone**: MP, Chhattisgarh

View performance scores for each zone on \`/dashboard\`.`;
    },
  },
  {
    id: 'platform-hindi',
    matchPatterns: [
      /is\s*the\s*entire\s*platform\s*(available\s*)?in\s*hindi/i,
      /entire\s*platform\s*hindi/i,
      /full\s*hindi\s*support/i,
      /पूरा\s*मंच\s*हिन्दी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🌐 हाँ! पूरा स्टैटविद्या मंच हिन्दी में उपलब्ध है:

- ✅ सभी UI तत्व (साइडबार, टॉपबार, बटन, लेबल)
- ✅ डैशबोर्ड विजेट और चार्ट
- ✅ सभी 8 मूल्यांकन (प्रश्न और विकल्प)
- ✅ कौशल अंतर विश्लेषण
- ✅ MCQ जनरेटर
- ✅ कोपायलट चैटबॉट

टॉपबार में EN / हिन्दी टॉगल से भाषा बदलें।`;
      }
      return `🌐 Yes! The entire StatVidya platform is available in Hindi:

- ✅ All UI elements (sidebar, topbar, buttons, labels)
- ✅ Dashboard widgets and charts
- ✅ All 8 assessments (questions and options)
- ✅ Skill gap analysis
- ✅ MCQ Generator
- ✅ Copilot Chatbot

Toggle via EN / हिन्दी in the Topbar.`;
    },
  },
  {
    id: 'chatbot-hindi',
    matchPatterns: [
      /does\s*(the\s*)?chatbot\s*respond\s*in\s*hindi/i,
      /chatbot\s*hindi/i,
      /copilot\s*hindi/i,
      /चैटबॉट\s*हिन्दी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🤖 हाँ! यह कोपायलट चैटबॉट पूरी तरह से हिन्दी में जवाब देता है।

- प्लेटफ़ॉर्म की भाषा सेटिंग के अनुसार स्वचालित भाषा चयन
- सभी FAQ और त्वरित उत्तर हिन्दी में उपलब्ध
- AI उत्तर भी हिन्दी प्रॉम्प्ट पर हिन्दी में आते हैं
- आप हिन्दी या अंग्रेज़ी में कोई भी प्रश्न पूछ सकते हैं`;
      }
      return `🤖 Yes! This Copilot chatbot fully responds in Hindi.

- Auto-detects language based on platform language setting
- All FAQ and instant answers available in Hindi
- AI responses come in Hindi when you ask in Hindi
- You can ask questions in either Hindi or English`;
    },
  },
  {
    id: 'cadres-support',
    matchPatterns: [
      /what\s*cadres?\s*(does\s*)?statvidya\s*support/i,
      /supported\s*cadres?/i,
      /which\s*cadres?/i,
      /कौन\s*से\s*संवर्ग\s*समर्थित/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `👥 स्टैटविद्या निम्नलिखित MoSPI संवर्गों को समर्थन करता है:

- **NSSO FOD**: राष्ट्रीय नमूना सर्वेक्षण कार्यालय — क्षेत्रीय संचालन प्रभाग (फील्ड अन्वेषक, सहायक अधिकारी)
- **SSS**: अधीनस्थ सांख्यिकी सेवा (कनिष्ठ सांख्यिकी अधिकारी)
- **ISS**: भारतीय सांख्यिकी सेवा (उप-महानिदेशक, निदेशक)
- **NSSTA**: राष्ट्रीय सांख्यिकीय प्रणाली प्रशिक्षण अकादमी (संकाय प्रशिक्षक)

प्रत्येक संवर्ग की अलग FRAC योग्यता प्रोफ़ाइल और लक्ष्य स्तर होते हैं।`;
      }
      return `👥 StatVidya supports the following MoSPI cadres:

- **NSSO FOD**: National Sample Survey Office — Field Operations Division (Field Investigators, Asst. Officers)
- **SSS**: Subordinate Statistical Service (Junior Statistical Officers)
- **ISS**: Indian Statistical Service (Deputy Directors General, Directors)
- **NSSTA**: National Statistical Systems Training Academy (Faculty Trainers)

Each cadre has distinct FRAC competency profiles and target levels.`;
    },
  },
  {
    id: 'demo-personas',
    matchPatterns: [
      /what\s*are\s*(the\s*)?(4|four)\s*demo\s*personas/i,
      /demo\s*personas?/i,
      /sample\s*personas?/i,
      /demo\s*users?/i,
      /डेमो\s*व्यक्तित्व/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `👤 स्टैटविद्या के 4 डेमो व्यक्तित्व:

1. **सुनीता देवी** — फील्ड अन्वेषक, NSSO FOD (ग्रामीण CAPI, सूचीकरण)
2. **अमित शर्मा** — कनिष्ठ सांख्यिकी अधिकारी, SSS (जांच, PLFS)
3. **डॉ. प्रिया वर्मा** — NSSTA संकाय (प्रशिक्षक और प्रश्न अंशांकन)
4. **राजेश कुमार** — ADG, MoSPI मुख्यालय (प्रशासक और परिणाम सहसंबंध)

प्रत्येक व्यक्तित्व अलग भूमिका, संवर्ग और FRAC प्रोफ़ाइल दर्शाता है।`;
      }
      return `👤 StatVidya's 4 demo personas:

1. **Sunita Devi** — Field Investigator, NSSO FOD (Rural CAPI, Listing)
2. **Amit Sharma** — Junior Statistical Officer, SSS (Scrutiny, PLFS)
3. **Dr. Priya Verma** — NSSTA Faculty (Trainer & Question Calibration)
4. **Rajesh Kumar** — ADG, MoSPI HQ (Administrator & Outcome Correlation)

Each persona demonstrates a different role, cadre, and FRAC competency profile.`;
    },
  },
  {
    id: 'role-switching',
    matchPatterns: [
      /how\s*does\s*role\s*switching\s*work/i,
      /switch\s*(my\s*)?role/i,
      /change\s*(my\s*)?role/i,
      /role\s*switch/i,
      /भूमिका\s*(कैसे\s*)?स्विच/i,
      /भूमिका\s*बदल/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `🔄 भूमिका स्विच करना:

1. टॉपबार में अपने प्रोफ़ाइल अवतार के पास देखें
2. भूमिका ड्रॉपडाउन पर क्लिक करें
3. शिक्षार्थी (Learner), प्रशिक्षक (Trainer), या प्रशासक (Admin) चुनें
4. पूरा डैशबोर्ड और साइडबार तुरंत बदल जाता है

प्रत्येक भूमिका का अपना अलग नेविगेशन, डैशबोर्ड और सुविधा सेट होता है।`;
      }
      return `🔄 How role switching works:

1. Look near your profile avatar in the Topbar
2. Click the role dropdown
3. Select Learner, Trainer, or Admin
4. The entire dashboard and sidebar instantly adapt

Each role has its own distinct navigation, dashboard layout, and feature set.`;
    },
  },
  {
    id: 'offline-test',
    matchPatterns: [
      /can\s*i\s*take\s*tests?\s*offline/i,
      /offline\s*(test|assessment|exam)/i,
      /test\s*without\s*internet/i,
      /ऑफ़लाइन\s*(टेस्ट|परीक्षा)/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `📡 हाँ! आप ऑफ़लाइन टेस्ट दे सकते हैं:

- मूल्यांकन प्रश्न ब्राउज़र में कैश होते हैं
- उत्तर IndexedDB में सुरक्षित रूप से संग्रहित होते हैं
- टाइमर स्थानीय रूप से चलता है
- इंटरनेट आने पर उत्तर स्वचालित रूप से सबमिट होते हैं
- कोई डेटा नहीं खोता

दूरदराज के क्षेत्रों में फील्ड कार्य के लिए विशेष रूप से उपयोगी!`;
      }
      return `📡 Yes! You can take tests offline:

- Assessment questions are cached in the browser
- Answers are stored securely in IndexedDB
- Timer runs locally
- Submissions auto-sync when internet returns
- No data is ever lost

Especially useful for field work in remote areas!`;
    },
  },
];



/**
 * Checks if a user prompt matches any pre-made FAQ.
 * Returns the matching response string or null.
 */
export function matchPreMadeFaq(
  prompt: string,
  userContext?: CopilotUserContext
): string | null {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) return null;

  for (const faq of COPILOT_PREMADE_FAQS) {
    for (const pattern of faq.matchPatterns) {
      if (typeof pattern === 'string') {
        if (normalized === pattern.toLowerCase()) {
          return faq.getResponse(userContext);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(normalized)) {
          return faq.getResponse(userContext);
        }
      }
    }
  }

  return null;
}

