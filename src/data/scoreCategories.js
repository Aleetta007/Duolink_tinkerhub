// Kozhitharam score classification tiers

export const scoreCategories = [
  {
    id: 'kunjikkozhi',
    min: 0,
    max: 20,
    emoji: '🐣',
    title: 'KUNJIKKOZHI',
    malayalamTitle: 'കുഞ്ഞിക്കോഴി',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
    description:
      'Congratulations! Your Kozhitharam levels are remarkably low. You are merely a humble baby chick in the grand ecosystem of Kozhis. The National Kozhitharam Authority is relieved.',
    audioKey: 'low-score',
    gradient: 'linear-gradient(135deg, #14532d, #166534)',
  },
  {
    id: 'normalKozhi',
    min: 21,
    max: 40,
    emoji: '🐔',
    title: 'NORMAL KOZHI',
    malayalamTitle: 'നോർമൽ കോഴി',
    color: '#84cc16',
    glowColor: 'rgba(132,204,22,0.4)',
    description:
      'Standard-issue Kozhitharam detected. Nothing alarming — yet. You exhibit baseline Kozhi characteristics. Monitor regularly for escalation.',
    audioKey: 'low-score',
    gradient: 'linear-gradient(135deg, #365314, #3f6212)',
  },
  {
    id: 'suspectedKozhi',
    min: 41,
    max: 60,
    emoji: '🐓',
    title: 'SUSPECTED KOZHI',
    malayalamTitle: 'സംശയിക്കപ്പെടുന്ന കോഴി',
    color: '#eab308',
    glowColor: 'rgba(234,179,8,0.4)',
    description:
      'Elevated Kozhitharam signatures detected. Suspiciousness algorithms flagged multiple facial indicators. Further investigation recommended. Do not let this person near any chickens.',
    audioKey: 'medium-score',
    gradient: 'linear-gradient(135deg, #713f12, #854d0e)',
  },
  {
    id: 'advancedKozhi',
    min: 61,
    max: 80,
    emoji: '🔥',
    title: 'ADVANCED KOZHI',
    malayalamTitle: 'അഡ്വാൻസ്ഡ് കോഴി',
    color: '#f97316',
    glowColor: 'rgba(249,115,22,0.4)',
    description:
      'High-grade Kozhitharam confirmed. Your face radiates Kozhi energy at a frequency that disturbs nearby poultry. This is a serious finding. The local chicken population has been alerted.',
    audioKey: 'high-score',
    gradient: 'linear-gradient(135deg, #7c2d12, #9a3412)',
  },
  {
    id: 'professionalKozhi',
    min: 81,
    max: 95,
    emoji: '🚨',
    title: 'PROFESSIONAL KOZHI',
    malayalamTitle: 'പ്രൊഫഷണൽ കോഴി',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.5)',
    description:
      'CRITICAL Kozhitharam levels detected. You have achieved professional-grade Kozhi status. The National Kozhitharam Authority has issued an orange alert. Neighboring villages have been notified. A documentary is being planned.',
    audioKey: 'high-score',
    gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
  },
  {
    id: 'kozhitharamOverload',
    min: 96,
    max: 100,
    emoji: '💀',
    title: 'KOZHITHARAM OVERLOAD',
    malayalamTitle: 'കോഴിത്തരം ഓവർലോഡ്',
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.6)',
    description:
      'SYSTEM OVERLOAD. Unprecedented Kozhitharam levels have shattered all known records. The detection system was not designed for a specimen of this magnitude. Science has failed us. Our servers are filing for emotional support.',
    audioKey: 'extreme-score',
    gradient: 'linear-gradient(135deg, #3b0764, #4a044e)',
  },
];

export function getCategoryForScore(score) {
  return (
    scoreCategories.find((c) => score >= c.min && score <= c.max) ||
    scoreCategories[1]
  );
}
