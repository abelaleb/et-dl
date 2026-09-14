export type Locale = "am" | "en";

export interface Translations {
  appName: string;
  appTagline: string;
  navChat: string;
  navExam: string;
  navSigns: string;
  languageSelect: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  startChatting: string;
  takeExam: string;
  exploreSigns: string;
  featuresTitle: string;
  featuresSubtitle: string;
  
  // Feature cards
  featureBilingualTitle: string;
  featureBilingualDesc: string;
  featureRagTitle: string;
  featureRagDesc: string;
  featureSignsTitle: string;
  featureSignsDesc: string;
  featureExamTitle: string;
  featureExamDesc: string;

  // Chat translations
  chatPlaceholder: string;
  chatSend: string;
  chatSuggestedTitle: string;
  chatSourcesTitle: string;
  chatClearHistory: string;
  chatTutorWelcome: string;
  chatTutorDescription: string;
  thinkingText: string;
  suggestions: string[];

  // Exam translations
  examTitle: string;
  examSubtitle: string;
  examStartButton: string;
  examNextButton: string;
  examPrevButton: string;
  examSubmitButton: string;
  examRestartButton: string;
  examQuestionCount: string;
  examTimeRemaining: string;
  examScoreTitle: string;
  examPassed: string;
  examFailed: string;
  examPassRate: string;
  examExplanation: string;
  examAskTutor: string;
  examFilterAll: string;
  examFilterSigns: string;
  examFilterPriority: string;
  examFilterSpeed: string;
  examFilterSafety: string;

  // Traffic Signs translations
  signsTitle: string;
  signsSubtitle: string;
  signsSearchPlaceholder: string;
  signsFilterAll: string;
  signsFilterWarning: string;
  signsFilterRegulatory: string;
  signsFilterMandatory: string;
  signsFilterInformational: string;
  signsCategoryWarning: string;
  signsCategoryRegulatory: string;
  signsCategoryMandatory: string;
  signsCategoryInformational: string;
  signsMeaningLabel: string;
  signsActionRequired: string;
  signsAskTutorAboutSign: string;

  // Footer
  footerDisclaimer: string;
  footerRights: string;
}

export const translations: Record<Locale, Translations> = {
  am: {
    appName: "መንጃ ፈቃድ ረዳት",
    appTagline: "የኢትዮጵያ መንጃ ፈቃድ የንድፈ-ሃሳብ ፈተና AI አጋዥ",
    navChat: "አስተማሪ (Chat)",
    navExam: "የሙከራ ፈተና",
    navSigns: "የትራፊክ ምልክቶች",
    languageSelect: "ቋንቋ ምረጥ",
    heroBadge: "በኢትዮጵያ ትራንስፖርት ሕግና ማኑዋል ላይ የተመሰረተ RAG AI",
    heroTitle: "የኢትዮጵያ መንጃ ፈቃድ ፈተናን",
    heroTitleHighlight: "በቀላሉ ይለፉ!",
    heroDescription: "በአማርኛና በእንግሊዝኛ የተዘጋጀ ዘመናዊ የ AI አስተማሪ፤ የትራፊክ ደንቦችን፣ የቀዳሚነት መብቶችንና የመንገድ ምልክቶችን በማጥናት ለፈተናው ሙሉ በሙሉ ዝግጁ ይሁኑ።",
    startChatting: "ከአስተማሪው ጋር ይወያዩ",
    takeExam: "የሙከራ ፈተና ይጀምሩ",
    exploreSigns: "ምልክቶችን ያስሱ",
    featuresTitle: "ዋና ዋና ባህሪያት",
    featuresSubtitle: "በኢትዮጵያ የመንጃ ፈቃድ ስርአተ-ትምህርት መሰረት የተገነባ",

    featureBilingualTitle: "ሙሉ የሁለት ቋንቋ ድጋፍ",
    featureBilingualDesc: "በአማርኛ እና በእንግሊዝኛ ቋንቋ ያለ ምንም መቆራረጥ በጥያቄዎ መሰረት ምላሽ ያገኛሉ።",
    featureRagTitle: "የተረጋገጠ መረጃ (RAG)",
    featureRagDesc: "ምላሾቹ በኢትዮጵያ የትራንስፖርትና ሎጂስቲክስ ሚኒስቴር ህግና መመሪያዎች ላይ የተመሰረቱ ናቸው።",
    featureSignsTitle: "የምስል ምልክቶች ዳታቤዝ",
    featureSignsDesc: "የማስጠንቀቂያ፣ የመከልከያ፣ የመመሪያ እና የመረጃ ምልክቶች በከፍተኛ ጥራት ከሙሉ ማብራሪያ ጋር።",
    featureExamTitle: "ተጨባጭ የፈተና ሲሙሌተር",
    featureExamDesc: "በጊዜ የተገደቡ የፈተና ጥያቄዎች ከቅጽበታዊ ውጤት እና ግልጽ ማብራሪያዎች ጋር።",

    chatPlaceholder: "ስለ መንጃ ፈቃድ ደንቦች ወይም ምልክቶች ማንኛውንም ጥያቄ ይጠይቁ...",
    chatSend: "ላክ",
    chatSuggestedTitle: "ተዘውታሪ ጥያቄዎች",
    chatSourcesTitle: "የተጠቀሱ ህጎችና ማጣቀሻዎች",
    chatClearHistory: "ውይይት አጽዳ",
    chatTutorWelcome: "እንኳን ደህና መጡ! እኔ የኢትዮጵያ መንጃ ፈቃድ ፈተና ረዳትዎ ነኝ።",
    chatTutorDescription: "ስለ ቀዳሚነት መብት፣ የትራፊክ ምልክቶች፣ የፍጥነት ገደብ፣ የተሽከርካሪ ፍተሻ ወይም ቅጣቶች ማንኛውንም ጥያቄ በአማርኛ ወይም በእንግሊዝኛ መጠየቅ ይችላሉ።",
    thinkingText: "ማጣቀሻዎችን በመመርመር ላይ...",
    suggestions: [
      "በአደባባይ ላይ የቀዳሚነት መብት ያለው ማን ነው?",
      "ቀይ ክብ ቅርጽ ያለው የትራፊክ ምልክት ምን ያመለክታል?",
      "በከተማ ውስጥ ከፍተኛው የፍጥነት ገደብ ስንት ነው?",
      "የ 2 ሰከንድ የርቀት ህግ ምንድን ነው?",
      "የቀኝ እጅ ቀዳሚነት መብት መቼ ተግባራዊ ይሆናል?",
    ],

    examTitle: "የመንጃ ፈቃድ የሙከራ ፈተና",
    examSubtitle: "በእውነተኛው የፈተና ጥያቄዎች እውቀትዎን ይፈትሹ",
    examStartButton: "ፈተና ጀምር",
    examNextButton: "ቀጣይ ጥያቄ",
    examPrevButton: "ያለፈው ጥያቄ",
    examSubmitButton: "ፈተናውን ጨርስ",
    examRestartButton: "እንደገና ፈትን",
    examQuestionCount: "ጥያቄ",
    examTimeRemaining: "የቀረው ጊዜ",
    examScoreTitle: "የፈተና ውጤትዎ",
    examPassed: "እንኳን ደስ አለዎት! አልፈዋል!",
    examFailed: "አላለፉም! እንደገና ይሞክሩ።",
    examPassRate: "የማለፊያ ነጥብ 75% ነው",
    examExplanation: "የመልሱ ማብራሪያ",
    examAskTutor: "ስለዚህ ጥያቄ አስተማሪውን ጠይቅ",
    examFilterAll: "ሁሉም ጥያቄዎች",
    examFilterSigns: "ምልክቶች",
    examFilterPriority: "የቀዳሚነት መብት",
    examFilterSpeed: "ፍጥነትና ርቀት",
    examFilterSafety: "ደህንነትና ፍተሻ",

    signsTitle: "የኢትዮጵያ የትራፊክ ምልክቶች ካታሎግ",
    signsSubtitle: "በአማርኛና በእንግሊዝኛ የተሟላ የትራፊክ ምልክቶች ማብራሪያ",
    signsSearchPlaceholder: "ምልክቶችን በስም ወይም በትርጉም ይፈልጉ...",
    signsFilterAll: "ሁሉም",
    signsFilterWarning: "ማስጠንቀቂያ",
    signsFilterRegulatory: "መከልከያ",
    signsFilterMandatory: "መመሪያ / ግዴታ",
    signsFilterInformational: "መረጃ ሰጪ",
    signsCategoryWarning: "የማስጠንቀቂያ ምልክት (ትሪያንግል)",
    signsCategoryRegulatory: "የመከልከያ ምልክት (ቀይ ክብ)",
    signsCategoryMandatory: "የመመሪያ ምልክት (ሰማያዊ ክብ)",
    signsCategoryInformational: "የመረጃ ሰጪ ምልክት (አራት ማዕዘን)",
    signsMeaningLabel: "ትርጉምና ህግ:",
    signsActionRequired: "ሹፌሩ ሊወስደው የሚገባ ጥንቃቄ:",
    signsAskTutorAboutSign: "ስለዚህ ምልክት AI አስተማሪውን ጠይቅ",

    footerDisclaimer: "ይህ ድረ-ገጽ ለትምህርታዊ ዝግጅት ብቻ የተዘጋጀ ሲሆን ይፋዊ ፈተና የሚሰጠው በሚመለከተው የመንግስት አካል ብቻ ነው።",
    footerRights: "የመንጃ ፈቃድ ረዳት RAG ቦይለርፕሌት። መብቱ በህግ የተጠበቀ ነው።",
  },
  en: {
    appName: "EthioDrive AI",
    appTagline: "Ethiopian Driver's License Theory Examination RAG Assistant",
    navChat: "AI Tutor",
    navExam: "Mock Exam",
    navSigns: "Traffic Signs",
    languageSelect: "Language",
    heroBadge: "Grounded on Ethiopian Transport & Logistics Regulations",
    heroTitle: "Master the Ethiopian Driver's License Test",
    heroTitleHighlight: "with AI Guidance",
    heroDescription: "A bilingual RAG-powered tutor and exam simulator in Amharic and English. Study official road codes, right-of-way rules, and traffic signs with verified source citations.",
    startChatting: "Start Learning with AI",
    takeExam: "Take Practice Exam",
    exploreSigns: "Browse Traffic Signs",
    featuresTitle: "Engineered for Success",
    featuresSubtitle: "Everything you need to pass the official theory test on your first try",

    featureBilingualTitle: "Native Bilingual Support",
    featureBilingualDesc: "Seamless real-time switching between English and Amharic with proper Fidel typography.",
    featureRagTitle: "Grounded Citations (RAG)",
    featureRagDesc: "All answers are retrieved directly from official Ethiopian driving curriculum manuals and decrees.",
    featureSignsTitle: "Interactive Sign Catalog",
    featureSignsDesc: "Warning, prohibitory, mandatory, and informational signs in crisp SVG format with complete explanations.",
    featureExamTitle: "Realistic Exam Simulator",
    featureExamDesc: "Timed practice tests with instant feedback, scoring breakdowns, and question-by-question explanations.",

    chatPlaceholder: "Ask anything about Ethiopian driving rules, signs, or penalties...",
    chatSend: "Send",
    chatSuggestedTitle: "Suggested Inquiries",
    chatSourcesTitle: "Grounded Legal Citations",
    chatClearHistory: "Clear History",
    chatTutorWelcome: "Hello! I am your Ethiopian Driver's License AI Tutor.",
    chatTutorDescription: "Ask me questions regarding right of way, traffic signs, speed limits, vehicle inspection, or demerit points in either English or Amharic.",
    thinkingText: "Retrieving official manuals...",
    suggestions: [
      "Who has the right-of-way at a roundabout?",
      "What does a circular sign with a red border mean?",
      "What is the maximum speed limit in urban areas?",
      "Explain the 2-second safe following distance rule.",
      "When does the right-hand priority rule apply in Ethiopia?",
    ],

    examTitle: "Driver's License Mock Exam",
    examSubtitle: "Test your theoretical road knowledge under realistic exam conditions",
    examStartButton: "Start Exam",
    examNextButton: "Next Question",
    examPrevButton: "Previous",
    examSubmitButton: "Submit Exam",
    examRestartButton: "Retake Exam",
    examQuestionCount: "Question",
    examTimeRemaining: "Time Remaining",
    examScoreTitle: "Your Examination Result",
    examPassed: "Congratulations! You Passed!",
    examFailed: "You Did Not Pass. Please Review & Retry.",
    examPassRate: "Passing score is 75%",
    examExplanation: "Official Explanation",
    examAskTutor: "Ask AI Tutor about this question",
    examFilterAll: "All Categories",
    examFilterSigns: "Traffic Signs",
    examFilterPriority: "Right-of-Way",
    examFilterSpeed: "Speed & Distance",
    examFilterSafety: "Vehicle Safety",

    signsTitle: "Ethiopian Traffic Signs Directory",
    signsSubtitle: "Comprehensive database of warning, regulatory, mandatory, and informative road signs",
    signsSearchPlaceholder: "Search signs by name, code, or meaning...",
    signsFilterAll: "All Signs",
    signsFilterWarning: "Warning",
    signsFilterRegulatory: "Prohibitory",
    signsFilterMandatory: "Mandatory",
    signsFilterInformational: "Informational",
    signsCategoryWarning: "Warning Sign (Triangular, Red Border)",
    signsCategoryRegulatory: "Prohibitory Sign (Circular, Red Border)",
    signsCategoryMandatory: "Mandatory Sign (Circular, Blue)",
    signsCategoryInformational: "Informational Sign (Rectangular)",
    signsMeaningLabel: "Meaning & Rule:",
    signsActionRequired: "Driver Action:",
    signsAskTutorAboutSign: "Ask AI Tutor About This Sign",

    footerDisclaimer: "This application is designed for educational preparation only. Official certification is issued solely by the authorized government licensing authority.",
    footerRights: "EthioDrive RAG Boilerplate. All rights reserved.",
  },
};
