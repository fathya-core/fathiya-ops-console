export type MarketIntelOutput = {
  coreThesis: string;
  bullishScenario: string;
  bearishScenario: string;
  invalidation: string[];
  earlyWarnings: string[];
  confidenceScore: number;
  hiddenRisk: string;
  nextDataNeeded: string[];
};

export type BugBountyOutput = {
  scopeMap: { in: string[]; out: string[] };
  assetInventory: { name: string; type: string; priority: string }[];
  vulnHypotheses: { title: string; rationale: string; severity: string }[];
  safeChecklist: string[];
  evidenceTemplate: string;
  reportDraft: string;
};

export type View = 'home' | 'market' | 'bounty';
