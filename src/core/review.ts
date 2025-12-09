import { readFile } from "fs/promises";

import { agent } from "./llms/agent";

export interface ReviewResult {
  filePath: string;
  review: string;
  success: boolean;
  error?: string;
}

/**
 * コアロジック
 * @param filePath
 * @returns
 */
export async function reviewFile(
  filePath: string,
): Promise<ReviewResult> {
  try {
    const content = await readFile(filePath, "utf-8");
    const result = await agent.invoke(content);
    const review = result.lastMessage.content.toString();
    return {
      filePath,
      review,
      success: true
    };
  } catch (error) {
    return {
      filePath,
      review: "",
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
