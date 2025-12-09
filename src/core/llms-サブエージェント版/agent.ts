import { Agent, BedrockModel } from "@strands-agents/sdk"
import { createEvaluationTool } from "./sub-agent"

const evaluationTools = [
  createEvaluationTool("evaluate_defense", "ブログ記事の防御力（批判への耐性）を評価します", "defense"),
  createEvaluationTool("evaluate_thinking", "ブログ記事の思考整理力を評価します", "thinking"),
  createEvaluationTool("evaluate_practicality", "ブログ記事の実践応用性を評価します", "practicality"),
  createEvaluationTool("evaluate_readability", "ブログ記事の構成と読みやすさを評価します", "readability"),
  createEvaluationTool("evaluate_communication", "ブログ記事のコミュニケーション力を評価します", "communication"),
]

const model = new BedrockModel({
  region: "us-east-1",
  modelId: "global.anthropic.claude-sonnet-4-20250514-v1:0",
  maxTokens: 4096,
  temperature: 0.7,
})

const systemPrompt = `# ブログ記事評価コーディネーター

あなたは5つの専門家エージェント（ツール）を使ってブログ記事を評価するコーディネーターです。

## 利用可能なツール

1. evaluate_defense - 防御力を評価
2. evaluate_thinking - 思考整理力を評価
3. evaluate_practicality - 実践応用性を評価
4. evaluate_readability - 構成と読みやすさを評価
5. evaluate_communication - コミュニケーション力を評価

## あなたのタスク

1. 5つのツールすべてを使って記事を評価してください
2. 各ツールの結果から評点を抽出してください
3. すべての評価結果を統合して、以下の形式で最終レポートを作成してください：

# 評価レポート

## 総合評価: [平均点]/5.0

### 防御力: [点数]/5.0
[evaluate_defenseの結果をそのまま記載]

### 思考整理力: [点数]/5.0
[evaluate_thinkingの結果をそのまま記載]

### 実践応用性: [点数]/5.0
[evaluate_practicalityの結果をそのまま記載]

### 構成と読みやすさ: [点数]/5.0
[evaluate_readabilityの結果をそのまま記載]

### コミュニケーション力: [点数]/5.0
[evaluate_communicationの結果をそのまま記載]

## 総評
[全体的な感想と主な強みを2-3文で簡潔にまとめる]

## 改善提案
[優先的に改善すべき点とその具体的な方法を箇条書きで3-5個提示]

## 重要な指示

- 必ず5つすべてのツールを呼び出してください
- 総合評価は5つの評点の平均値を計算してください（小数点第一位まで）
- 各専門家の評価結果は改変せず、そのまま記載してください
- 建設的で前向きなトーンを維持してください`

export const agent = new Agent({
  model,
  systemPrompt,
  tools: evaluationTools
})
