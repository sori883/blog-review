import { stat, readdir } from "fs/promises";
import { join } from "path";
import { reviewFile } from "./core/review";

async function main() {
  const targetPath = process.argv[2];

  if (!targetPath) {
    console.error("使い方: npm run review <ファイルパスまたはフォルダパス>");
    process.exit(1);
  }

  try {
    const stats = await stat(targetPath);

    if (stats.isDirectory()) {
      // フォルダの場合、中のファイルを全て処理
      await processDirectory(targetPath);
    } else {
      // ファイルの場合、単一ファイルを処理
      await processFile(targetPath);
    }
  } catch (error) {
    console.error(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

async function processFile(filePath: string): Promise<void> {
  const result = await reviewFile(filePath);

  if (result.success) {
    console.log(`\n=== ${filePath} ===`);
  } else {
    console.error(`エラー (${filePath}): ${result.error}`);
  }
}

async function processDirectory(dirPath: string): Promise<void> {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isFile()) {
      await processFile(fullPath);
    } else if (entry.isDirectory()) {
      // サブディレクトリも再帰的に処理
      await processDirectory(fullPath);
    }
  }
}

main();