import { promisify } from "util";
import { readFile, writeFile } from "fs";

import { Node, Root, TextNode } from "Mdast";
import { getChangeNodes } from "./get-change-nodes";

const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkStringify = require("remark-stringify");

const asyncReadFile = promisify(readFile);
const asyncWriteFile = promisify(writeFile);

const parser = unified().use(remarkParse);
const writer = unified().use(remarkStringify, {
  listItemIndent: "1"
});

const vNextNode = ({
  type: "heading",
  depth: 2,
  children: [
    {
      type: "text",
      value: "vNext",
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
} as any) as Node;

// while this works, it could possibly break on updates to the markdown libraries
// as markdown ast manipulation does not follow the official apis
const bumpVnextInAst = (root: Root, version: string) => {
  const nodes = root.children;

  /* the first node is the `# CHANGELOG` heading which should have already been validated */
  for (let index = 1; index <= nodes.length; index += 1) {
    const node = nodes[index];

    if (node.type !== "heading") {
      continue;
    }

    const headingTextNode = node.children[0] as TextNode;

    if (headingTextNode.value !== "vNext") {
      break;
    }

    headingTextNode.value = version;

    root.children.splice(index, 0, vNextNode);

    break;
  }

  return root;
};

export const bumpAndAggregateChangelogs = async (options: {
  files: string[];
  version: string;
}): Promise<{ filename: string; changeNodes: Node[] }[]> => {
  const changes = [];

  for (const filename of options.files) {
    const changelogRaw = await asyncReadFile(filename);

    const changelogMarkdownAst: Root = parser.parse(changelogRaw);

    const changeNodes = getChangeNodes(changelogMarkdownAst);

    if (changeNodes.length === 0) {
      continue;
    }

    const newAst = bumpVnextInAst(changelogMarkdownAst, options.version);

    const file = writer.stringify(newAst);

    asyncWriteFile(filename, file);

    changes.push({ filename, changeNodes });
  }

  return changes;
};
