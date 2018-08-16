import { Root, Node, TextNode } from "Mdast";

export const getChangeNodes = (changelogMarkdownAst: Root) => {
  const [
    changelogHeadingNode,
    ...changelogContentNodes
  ] = changelogMarkdownAst.children;

  if (changelogHeadingNode.type !== "heading") {
    throw new Error(`changelog requires a heading of CHANGELOG at top of file`);
  }

  const changelogHeadingTextNode = changelogHeadingNode.children[0] as TextNode;

  if (changelogHeadingTextNode.value !== "CHANGELOG") {
    throw new Error(`changelog requires a heading of CHANGELOG at top of file`);
  }

  const changeNodes: Node[] = [];

  let insideVnext = false;

  for (const node of changelogContentNodes) {
    if (node.type === "heading") {
      if (insideVnext === true) {
        return changeNodes;
      }

      const headingTextNode = node.children[0] as TextNode;

      if (headingTextNode.value !== "vNext") {
        return changeNodes;
      }

      insideVnext = true;

      continue
    }

    if (node.type === "list") {
      changeNodes.push(node);
    }
  }

  return changeNodes;
};
