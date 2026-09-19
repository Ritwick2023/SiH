/**
 * src/data/copilotFaqCategories.ts
 *
 * Structured FAQ categories for the Copilot FAQ Knowledge Base browser.
 * Each question's `prompt` is designed to match against matchPreMadeFaq()
 * in copilotFaqResponses.ts for instant (<80ms) answers.
 */

export interface FaqQuestion {
  label: string;
  label_hi: string;
  prompt: string;
}

export interface FaqCategory {
  id: string;
  emoji: string;
  title: string;
  title_hi: string;
  questions: FaqQuestion[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  // ─── 1. Platform Overview ───
  {
    id: 'platform',
    emoji: '🧭',
    title: 'Platform Overview',
    title_hi: 'मंच का अवलोकन',
    questions: [
      { label: 'What is StatVidya?', label_hi: 'स्टैटविद्या क्या है?', prompt: 'What is StatVidya?' },
      { label: 'What is MoSPI?', label_hi: 'MoSPI क्या है?', prompt: 'What is MoSPI?' },
      { label: 'What is Mission Karmayogi?', label_hi: 'मिशन कर्मयोगी क्या है?', prompt: 'What is Mission Karmayogi?' },
      { label: 'What are the main features?', label_hi: 'मुख्य सुविधाएं क्या हैं?', prompt: 'Give me a quick overview of all platform features' },
      { label: 'How does AI help in StatVidya?', label_hi: 'AI कैसे मदद करता है?', prompt: 'How does AI help in StatVidya?' },
      { label: 'Is this platform available in Hindi?', label_hi: 'क्या यह हिन्दी में उपलब्ध है?', prompt: 'Is this platform available in Hindi?' },
    ],
  },

  // ─── 2. Dashboard & Readiness ───
  {
    id: 'dashboard',
    emoji: '📊',
    title: 'Dashboard & Readiness',
    title_hi: 'डैशबोर्ड और तैयारी',
    questions: [
      { label: 'Where is my dashboard?', label_hi: 'मेरा डैशबोर्ड कहाँ है?', prompt: 'Where is my dashboard?' },
      { label: 'What is the Readiness Index?', label_hi: 'तैयारी सूचकांक क्या है?', prompt: 'What is my readiness index and how can I improve it?' },
      { label: 'What are Karma points?', label_hi: 'कर्म अंक क्या हैं?', prompt: 'What are Karma points and how do I earn them?' },
      { label: 'How does the Competency Radar Chart work?', label_hi: 'योग्यता रडार चार्ट कैसे काम करता है?', prompt: 'How does the Competency Radar Chart work?' },
      { label: 'What does my dashboard show for my role?', label_hi: 'मेरी भूमिका के लिए डैशबोर्ड क्या दिखाता है?', prompt: 'What does my dashboard show based on my role?' },
    ],
  },

  // ─── 3. Competency & Skill Gaps ───
  {
    id: 'competency',
    emoji: '🎯',
    title: 'Competency & Skill Gaps',
    title_hi: 'योग्यता और कौशल अंतर',
    questions: [
      { label: 'What is FRAC? (L1 to L5 levels)', label_hi: 'FRAC क्या है? (L1 से L5 स्तर)', prompt: 'Explain the FRAC competency levels L1 to L5' },
      { label: 'How does skill gap analysis work?', label_hi: 'कौशल अंतर विश्लेषण कैसे काम करता है?', prompt: 'Show me my top competency gaps and what to do about them' },
      { label: 'What do the gap severity levels mean?', label_hi: 'गंभीरता स्तर का क्या अर्थ है?', prompt: 'What do the gap severity levels mean?' },
      { label: 'How are priority weights calculated?', label_hi: 'प्राथमिकता भार कैसे गणना होती है?', prompt: 'How are priority weights calculated for competencies?' },
      { label: 'How do I close my competency gaps?', label_hi: 'मैं अपनी कमियाँ कैसे दूर करूँ?', prompt: 'How do I close my competency gaps?' },
    ],
  },

  // ─── 4. Assessments & Tests ───
  {
    id: 'assessments',
    emoji: '📝',
    title: 'Assessments & Tests',
    title_hi: 'मूल्यांकन और परीक्षण',
    questions: [
      { label: 'What tests are available?', label_hi: 'कौन से टेस्ट उपलब्ध हैं?', prompt: 'What tests and assignments are available?' },
      { label: 'How do I start an assessment?', label_hi: 'मूल्यांकन कैसे शुरू करें?', prompt: 'How do I start an assessment?' },
      { label: 'How does adaptive difficulty work?', label_hi: 'अनुकूली कठिनाई कैसे काम करती है?', prompt: 'How does adaptive difficulty work in assessments?' },
      { label: 'What happens when I score 70%+?', label_hi: '70% या अधिक स्कोर पर क्या होता है?', prompt: 'What happens when I score 70% or above on an assessment?' },
      { label: 'Can I take tests offline?', label_hi: 'क्या ऑफ़लाइन टेस्ट दे सकता हूँ?', prompt: 'Can I take tests offline without internet?' },
      { label: 'Can I retake assessments?', label_hi: 'क्या दोबारा टेस्ट दे सकता हूँ?', prompt: 'Can I retake assessments to improve my level?' },
    ],
  },

  // ─── 5. Practice MCQs ───
  {
    id: 'mcq',
    emoji: '🧠',
    title: 'Practice MCQs',
    title_hi: 'अभ्यास MCQ',
    questions: [
      { label: 'How does the MCQ Generator work?', label_hi: 'MCQ जनरेटर कैसे काम करता है?', prompt: 'How does the MCQ Generator work?' },
      { label: 'What difficulty levels are available?', label_hi: 'कौन से कठिनाई स्तर उपलब्ध हैं?', prompt: 'What difficulty levels are available for MCQs?' },
      { label: 'How many questions can I generate?', label_hi: 'कितने प्रश्न बना सकता हूँ?', prompt: 'How many questions can I generate at once?' },
      { label: 'What documents can I use for MCQs?', label_hi: 'किन दस्तावेज़ों से MCQ बना सकता हूँ?', prompt: 'What documents can I generate MCQs from?' },
    ],
  },

  // ─── 6. Documents & Manuals ───
  {
    id: 'documents',
    emoji: '📄',
    title: 'Documents & Manuals',
    title_hi: 'दस्तावेज़ और नियमावली',
    questions: [
      { label: 'Where can I find MoSPI manuals?', label_hi: 'MoSPI मैनुअल कहाँ मिलेंगे?', prompt: 'Where can I find MoSPI manuals and documents?' },
      { label: 'How do I upload a new document?', label_hi: 'नया दस्तावेज़ कैसे अपलोड करें?', prompt: 'How do I upload a new document?' },
      { label: 'Can I filter documents by competency?', label_hi: 'क्या योग्यता से छान सकता हूँ?', prompt: 'Can I filter documents by competency?' },
      { label: 'How do I practice from a manual?', label_hi: 'मैनुअल से अभ्यास कैसे करें?', prompt: 'How do I practice questions from a manual?' },
    ],
  },

  // ─── 7. Learning Pathways ───
  {
    id: 'pathways',
    emoji: '🛤️',
    title: 'Learning Pathways',
    title_hi: 'अध्ययन पथ',
    questions: [
      { label: 'Where are the recommended courses?', label_hi: 'अनुशंसित कोर्स कहाँ हैं?', prompt: 'Where are the learning pathways?' },
      { label: 'How are courses matched to my gaps?', label_hi: 'कोर्स मेरी कमियों से कैसे जुड़ते हैं?', prompt: 'How are courses matched to my skill gaps?' },
      { label: 'What is iGOT Karmayogi?', label_hi: 'iGOT कर्मयोगी क्या है?', prompt: 'What is iGOT Karmayogi?' },
      { label: 'What providers offer courses?', label_hi: 'कौन से संस्थान कोर्स देते हैं?', prompt: 'What providers offer training courses?' },
    ],
  },

  // ─── 8. Profile & Badges ───
  {
    id: 'profile',
    emoji: '👤',
    title: 'Profile & Badges',
    title_hi: 'प्रोफ़ाइल और बैज',
    questions: [
      { label: 'Where is my profile?', label_hi: 'मेरी प्रोफ़ाइल कहाँ है?', prompt: 'Where is my profile?' },
      { label: 'What are verified FRAC badges?', label_hi: 'सत्यापित FRAC बैज क्या हैं?', prompt: 'What are verified FRAC badges?' },
      { label: 'Verified vs Self-Assessed badges?', label_hi: 'सत्यापित बनाम स्व-मूल्यांकित?', prompt: 'How is Assessment-Verified different from Self-Assessed?' },
      { label: 'Can I see my career timeline?', label_hi: 'करियर समयरेखा देख सकता हूँ?', prompt: 'Can I see my career growth timeline?' },
    ],
  },

  // ─── 9. Offline & CAPI ───
  {
    id: 'offline',
    emoji: '📡',
    title: 'Offline & CAPI',
    title_hi: 'ऑफ़लाइन और CAPI',
    questions: [
      { label: 'What is CAPI?', label_hi: 'CAPI क्या है?', prompt: 'What is CAPI?' },
      { label: 'How does offline mode work?', label_hi: 'ऑफ़लाइन मोड कैसे काम करता है?', prompt: 'How does offline mode work?' },
      { label: 'What happens to data when offline?', label_hi: 'ऑफ़लाइन होने पर डेटा का क्या होता है?', prompt: 'What happens to my data when I am offline?' },
      { label: 'How does sync work on reconnect?', label_hi: 'इंटरनेट आने पर सिंक कैसे होता है?', prompt: 'How does data sync when internet returns?' },
      { label: 'What is the PLFS survey?', label_hi: 'PLFS सर्वेक्षण क्या है?', prompt: 'What is PLFS?' },
    ],
  },

  // ─── 10. Admin & Governance ───
  {
    id: 'admin',
    emoji: '🏛️',
    title: 'Admin & Governance',
    title_hi: 'प्रशासन और शासन',
    questions: [
      { label: 'What does the Admin dashboard show?', label_hi: 'Admin डैशबोर्ड क्या दिखाता है?', prompt: 'What does the Admin dashboard show?' },
      { label: 'What is scrutiny error correlation?', label_hi: 'जांच त्रुटि सहसंबंध क्या है?', prompt: 'What is the scrutiny error correlation?' },
      { label: 'How to flag regions for training?', label_hi: 'प्रशिक्षण के लिए क्षेत्र कैसे चिह्नित करें?', prompt: 'How do I flag regions for priority training?' },
      { label: 'What are regional office health zones?', label_hi: 'क्षेत्रीय कार्यालय ज़ोन क्या हैं?', prompt: 'What are the regional office health zones?' },
    ],
  },

  // ─── 11. Language & Settings ───
  {
    id: 'language',
    emoji: '🌐',
    title: 'Language & Settings',
    title_hi: 'भाषा और सेटिंग',
    questions: [
      { label: 'How to switch language?', label_hi: 'भाषा कैसे बदलें?', prompt: 'How do I switch between English and Hindi?' },
      { label: 'Is the entire platform in Hindi?', label_hi: 'क्या पूरा मंच हिन्दी में है?', prompt: 'Is the entire platform available in Hindi?' },
      { label: 'Does the chatbot respond in Hindi?', label_hi: 'क्या चैटबॉट हिन्दी में जवाब देता है?', prompt: 'Does the chatbot respond in Hindi?' },
    ],
  },

  // ─── 12. Roles & Cadres ───
  {
    id: 'roles',
    emoji: '🔧',
    title: 'Roles & Cadres',
    title_hi: 'भूमिकाएं और संवर्ग',
    questions: [
      { label: 'What cadres does StatVidya support?', label_hi: 'कौन से संवर्ग समर्थित हैं?', prompt: 'What cadres does StatVidya support?' },
      { label: 'What are the 4 demo personas?', label_hi: '4 डेमो व्यक्तित्व क्या हैं?', prompt: 'What are the 4 demo personas in the system?' },
      { label: 'How does role switching work?', label_hi: 'भूमिका स्विच कैसे करें?', prompt: 'How does role switching work?' },
      { label: 'Where is the Review Queue?', label_hi: 'समीक्षा कतार कहाँ है?', prompt: 'Where is the Review Queue and what is it for?' },
    ],
  },
];
