/*
  # Fathiya Ops Console - Draft Reports Schema

  1. New Tables
    - `market_intel_reports`
      - `id` (uuid, primary key)
      - `asset` (text) - asset or currency pair analyzed
      - `timeframe` (text) - chosen timeframe (1h, 4h, 1D, etc)
      - `data_source` (text) - data source label
      - `risk_level` (text) - low/medium/high
      - `notes` (text) - analyst notes
      - `output` (jsonb) - generated mock analysis output
      - `created_at` (timestamptz)
    - `bug_bounty_reports`
      - `id` (uuid, primary key)
      - `program_name` (text)
      - `policy_url` (text)
      - `allowed_scope` (text)
      - `forbidden_scope` (text)
      - `assets` (text)
      - `notes` (text)
      - `output` (jsonb) - generated mock report draft
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public anonymous read + insert allowed for this draft-only console
      (no authentication layer requested; outputs are mock/draft-only).
      Policies are scoped to the `anon` and `authenticated` roles.
*/

CREATE TABLE IF NOT EXISTS market_intel_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset text NOT NULL DEFAULT '',
  timeframe text NOT NULL DEFAULT '',
  data_source text NOT NULL DEFAULT '',
  risk_level text NOT NULL DEFAULT 'medium',
  notes text NOT NULL DEFAULT '',
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE market_intel_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read market intel drafts"
  ON market_intel_reports FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert market intel drafts"
  ON market_intel_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS bug_bounty_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL DEFAULT '',
  policy_url text NOT NULL DEFAULT '',
  allowed_scope text NOT NULL DEFAULT '',
  forbidden_scope text NOT NULL DEFAULT '',
  assets text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bug_bounty_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bug bounty drafts"
  ON bug_bounty_reports FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert bug bounty drafts"
  ON bug_bounty_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
