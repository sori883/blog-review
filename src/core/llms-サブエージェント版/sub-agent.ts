import { Agent, BedrockModel, FunctionTool } from "@strands-agents/sdk"

const evaluationPrompts = {
  defense: `# 防御力評価専門家
記事が批判や反論に対してどれだけ耐性を持っているかを0.0～5.0で評価してください。
主観的表現、コンテキスト明示、根拠と出典、批判への対応、異なる視点への配慮を重視します。

**評点**: [0.0-5.0]
**所見**:
- 良い点: [具体例を挙げて]
- 改善点: [具体例を挙げて]`,

  thinking: `# 思考整理力評価専門家
記事が思考プロセスを整理し、知識を構造化して伝えているかを0.0～5.0で評価してください。
論理的な流れ、思考の変遷の記述、問題から解決策までの道筋の明確さを重視します。

**評点**: [0.0-5.0]
**所見**:
- 良い点: [具体例を挙げて]
- 改善点: [具体例を挙げて]`,

  practicality: `# 実践応用性評価専門家
記事の情報が読者の実際の行動や実践にどれだけ役立つかを0.0～5.0で評価してください。
具体的な手順、失敗例と解決策、実践的なアドバイス、行動可能な情報を重視します。

**評点**: [0.0-5.0]
**所見**:
- 良い点: [具体例を挙げて]
- 改善点: [具体例を挙げて]`,

  readability: `# 構成と読みやすさ評価専門家
記事の構造、文体、視覚的要素が読者の理解を促進するかを0.0～5.0で評価してください。
見出し階層、段落の長さ、箇条書き、視覚的要素の活用を重視します。

**評点**: [0.0-5.0]
**所見**:
- 良い点: [具体例を挙げて]
- 改善点: [具体例を挙げて]`,

  communication: `# コミュニケーション力評価専門家
記事が読者と共感的につながり、技術情報を人間味を持って伝えているかを0.0～5.0で評価してください。
読者への配慮、個人的経験の共有、親しみやすい表現、対話を意識した書き方を重視します。

**評点**: [0.0-5.0]
**所見**:
- 良い点: [具体例を挙げて]
- 改善点: [具体例を挙げて]`,
}


const createSubAgentModel = () => new BedrockModel({
  region: "us-east-1",
  modelId: "global.anthropic.claude-sonnet-4-20250514-v1:0",
  maxTokens: 2048,
  temperature: 0.7,
})

export const createEvaluationTool = (name: string, description: string, promptKey: keyof typeof evaluationPrompts) => {
  return new FunctionTool({
    name,
    description,
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "評価対象のブログ記事の内容"
        }
      },
      required: ["content"]
    },
    callback: async (input: any) => {
      const model = createSubAgentModel()
      const prompt = evaluationPrompts[promptKey]
      const content = input.content as string

      // サブエージェントを作成して評価を実行
      const subAgent = new Agent({
        model,
        systemPrompt: prompt
      })

      const result = await subAgent.invoke(`以下のブログ記事を評価してください：\n\n${content}`)

      return result.lastMessage.content.toString()
    }
  })
}