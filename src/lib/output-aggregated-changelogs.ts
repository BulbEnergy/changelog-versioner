import { promisify } from "util";
import { readFile, writeFile } from "fs";

import { Node, Root } from "Mdast";

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkStringify = require("remark-stringify");

const asyncReadFile = promisify(readFile);
const asyncWriteFile = promisify(writeFile);

const parser = unified().use(remarkParse);
const writer = unified().use(remarkStringify);

const headingChangeNode = (heading: string, level: number) =>
  (({
    type: "heading",
    depth: level,
    children: [
      {
        type: "text",
        value: heading,
        position: {
          start: {
            line: 3,
            column: 4,
            offset: 16
          },
          end: {
            line: 3,
            column: 9,
            offset: 21
          },
          indent: []
        }
      }
    ]
  } as any) as Node);

const createListItem = (children: Node) => ({
  type: "listItem",
  loose: false,
  checked: null,
  children: [children]
});

export const outputAggregatedChangelogs = async (
  changes: Array<{ filename: string; changeNodes: Node[] }>,
  outputPath: string,
  version: string
) => {
  const outputChangelogRaw = await asyncReadFile(outputPath);
  const outputChangelogMarkdownAst: Root = parser.parse(outputChangelogRaw);

  for (const change of changes) {
    outputChangelogMarkdownAst.children.splice(
      1,
      0,
      headingChangeNode(change.filename, 3),
      {
        type: "list",
        ordered: false,
        start: null,
        loose: false,
        children: change.changeNodes.map(createListItem)
      } as any
    );
  }

  outputChangelogMarkdownAst.children.splice(
    1,
    0,
    headingChangeNode(version, 2)
  );

  const file = writer.stringify(outputChangelogMarkdownAst);

  asyncWriteFile(outputPath, file);
};
