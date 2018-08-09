import { promisify } from "util";
import { readFile } from "fs";

import { Root } from "Mdast";

const unified = require("unified");
const remarkParse = require("remark-parse");

const asyncReadFile = promisify(readFile);

const parser = unified().use(remarkParse);

export const getChangelogsMarkdownAst = async (filenames: string[]) => {
  const changelogsMarkdownAst: { filename: string; markdownAst: Root }[] = [];

  for (const filename of filenames) {
    const changelog = await asyncReadFile(filename);

    const markdownAst: Root = parser.parse(changelog);

    changelogsMarkdownAst.push({ filename, markdownAst });
  }

  return changelogsMarkdownAst;
};
