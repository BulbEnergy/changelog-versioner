import { Root, Node } from "Mdast";
import { getChangeNodes } from "./get-change-nodes";

const semverStringToLevel = (semverString: string): SemverLevel => {
  switch (semverString) {
    case "patch":
      return 0;
    case "minor":
      return 1;
    case "major":
      return 2;
    default:
      return 0;
  }
};

type SemverLevel = /** Bug */ 0 | /** Minor */ 1 | /** Major */ 2;

/* expected changeNode structure
[
  {
    type: 'paragraph',
    children: [ { type: 'linkReference', identifier: 'major', ...otherNodes  }, ...otherNodes ]
  },
  {
    type: 'paragraph',
    children: [ { type: 'linkReference', identifier: 'minor', ...otherNodes  }, ...otherNodes ]
  }
]
*/

const determineVersionFromChanges = (
  ...listChangeNodes: Node[]
): SemverLevel => {
  const changeNodes = listChangeNodes.map(
    listChangeNode => (listChangeNode as any).children[0].children
  );
  const paragraphChangeNodes = changeNodes.map(changeNode => changeNode[0]);

  let semverLevel: SemverLevel = 0;

  for (const changeNode of paragraphChangeNodes) {
    if (changeNode.type !== "paragraph") {
      continue;
    }

    const linkReference = changeNode.children[0];
    if (linkReference.type !== "linkReference") {
      continue;
    }

    const changeLevel = semverStringToLevel(linkReference.identifier);

    semverLevel = changeLevel > semverLevel ? changeLevel : semverLevel;
  }

  return semverLevel;
};

export const determineNextVersion = (options: {
  changelogs: { filename: string; markdownAst: Root }[];
  versionBeforeUpdating: string;
}) => {
  let semverLevel: SemverLevel | -1 = -1;

  for (const changelog of options.changelogs) {
    const fileChangeNodes = getChangeNodes(changelog.markdownAst);

    const largestChange = determineVersionFromChanges(...fileChangeNodes);

    semverLevel = largestChange > semverLevel ? largestChange : semverLevel;
  }

  const [major, minor, patch] = options.versionBeforeUpdating
    .split(".")
    .map(Number);

  if (semverLevel === 2) {
    return `${major + 1}.0.0`;
  }

  if (semverLevel === 1) {
    return `${major}.${minor + 1}.0`;
  }

  if (semverLevel === 0) {
    return `${major}.${minor}.${patch + 1}`;
  }

  // no change indicator detected
  // we make a best guess and assume it's a non breaking feature change
  // TODO document this behaviour
  return `${major}.${minor + 1}.0`;
};
