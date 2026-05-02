import { createContext, useContext } from 'react';
import type {
  FathiyaBridgePayload, BridgeActionType, BridgeRiskLevel,
  QualityResult, MarketIntelOutput, BugBountyOutput,
} from '../types';

// Forbidden action types — never generated
const FORBIDDEN_ACTION_TYPES: string[] = [
  'execute_trade', 'exploit_target', 'scan_target', 'send_email_now',
  'modify_github_now', 'trigger_webhook_now', 'delete_anything', 'archive_anything',
];

export function isForbiddenAction(type: string): boolean {
  return FORBIDDEN_ACTION_TYPES.includes(type);
}

export function buildMarketIntelPayload(
  output: MarketIntelOutput,
  quality: QualityResult,
  draftMarkdown: string,
  riskLevel: BridgeRiskLevel,
): FathiyaBridgePayload {
  const action: BridgeActionType = 'market_watch_record';
  if (isForbiddenAction(action)) throw new Error(`Forbidden action: ${action}`);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source_module: 'market_intel',
    action_type: action,
    title: `Market Watch — ${output.asset} · ${output.timeframe}`,
    draft_markdown: draftMarkdown,
    draft_json: output as unknown as Record<string, unknown>,
    risk_level: riskLevel,
    quality_gate: quality,
    requires_human_confirmation: true,
    execution_status: 'pending_approval',
    target_system: 'local',
    payload_preview: output.coreThesis.slice(0, 120) + '…',
  };
}

export function buildBugBountyPayload(
  output: BugBountyOutput,
  quality: QualityResult,
  draftMarkdown: string,
): FathiyaBridgePayload {
  const action: BridgeActionType = 'bug_bounty_report_draft';
  if (isForbiddenAction(action)) throw new Error(`Forbidden action: ${action}`);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source_module: 'bug_bounty',
    action_type: action,
    title: `Bug Bounty Draft — ${output.programName}`,
    draft_markdown: draftMarkdown,
    draft_json: output as unknown as Record<string, unknown>,
    risk_level: 'medium',
    quality_gate: quality,
    requires_human_confirmation: true,
    execution_status: 'pending_approval',
    target_system: 'local',
    payload_preview: `Scope: ${output.scopeMap.in.slice(0, 2).join(', ')} · Hypotheses: ${output.vulnHypotheses.length}`,
  };
}

// ── Context ──────────────────────────────────────────────────────────────────

export type BridgeContextType = {
  payloads: FathiyaBridgePayload[];
  addPayload: (p: FathiyaBridgePayload) => void;
  clearPayloads: () => void;
};

export const BridgeContext = createContext<BridgeContextType>({
  payloads: [],
  addPayload: () => {},
  clearPayloads: () => {},
});

export const useBridge = () => useContext(BridgeContext);

// ── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'fathiya.bridgePayloads.v1';

export function loadPayloads(): FathiyaBridgePayload[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as FathiyaBridgePayload[]) : [];
  } catch { return []; }
}

export function savePayloads(payloads: FathiyaBridgePayload[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(payloads)); } catch { /* ignore */ }
}
