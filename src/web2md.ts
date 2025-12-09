import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import NodeHtmlMarkdown from "html-to-md";
import { writeFile } from "fs/promises";

export interface Web2MdOptions {
  url: string;
}

export async function web2md(options: Web2MdOptions): Promise<string> {
  const { url } = options;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Failed to parse article content");
  }

  const markdown = NodeHtmlMarkdown(article.content!);

  return markdown;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];

  if (!url) {
    console.error("Usage: tsx src/web2md.ts <URL>");
    process.exit(1);
  }

  web2md({ url })
    .then(async (markdown) => {
      await writeFile("out.md", markdown, "utf-8");
      console.log("Saved to out.md");
    })
    .catch((error) => {
      console.error("Error:", error.message);
      process.exit(1);
    });
}
