import { promisify } from "util";
import { readFile } from "fs";

import { Root } from "Mdast";

const unified = require("unified");
const remarkParse = require("remark-parse");

const asyncReadFile = promisify(readFile);

const parser = unified().use(remarkParse);

export const getCurrentVersion = async (
  outputPath: string
): Promise<string> => {
  const outputChangelogRaw = await asyncReadFile(outputPath);
  const outputChangelogMarkdownAst: Root = parser.parse(outputChangelogRaw);

  const currentVersionHeadingNode = outputChangelogMarkdownAst.children[1];

  if (currentVersionHeadingNode.type !== "heading") {
    throw new Error(
      `Failed to read current version, check ${outputPath} is setup correctly.`
    );
  }

  const currentVersionHeadingTextNode = currentVersionHeadingNode.children[0];

  if (currentVersionHeadingTextNode.type !== "text") {
    throw new Error(
      `Failed to read current version, check ${outputPath} is setup correctly.`
    );
  }

  return currentVersionHeadingTextNode.value;
};
