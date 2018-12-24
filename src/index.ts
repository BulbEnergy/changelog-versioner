import { parseArgs } from "./lib/parse-args";
import { searchChangelogs } from "./lib/search-changelogs";
import { getChangelogsMarkdownAst } from "./lib/get-changelogs-markdown-ast";
import { determineNextVersion } from "./lib/determine-version-increment";
import { bumpAndAggregateChangelogs } from "./lib/bump-and-aggregate-changelogs";
import { outputAggregatedChangelogs } from "./lib/output-aggregated-changelogs";
import { getCurrentVersion } from "./lib/get-current-version";

const [, , ...args] = process.argv;

const options = parseArgs(...args);

interface RunChangeLogsOptions {
  folder: string;
  outputPath: string;
  noUpdate: string | boolean;
}

const runChangelogs = async (options: RunChangeLogsOptions) => {
  const currentVersion = await getCurrentVersion(options.outputPath);
  const changelogFiles = await searchChangelogs(options.folder);

  const changelogs = await getChangelogsMarkdownAst(changelogFiles);

  const nextVersion = determineNextVersion({
    changelogs,
    versionBeforeUpdating: currentVersion
  });

  if (nextVersion === currentVersion) {
    console.log(`no changes`);

    process.exit(0);
  }

  if (options.noUpdate) {
    console.log(`${nextVersion}`);

    process.exit(0);
  }

  const aggregatedChanges = await bumpAndAggregateChangelogs({
    files: changelogFiles,
    version: nextVersion
  });

  await outputAggregatedChangelogs(
    aggregatedChanges,
    options.outputPath,
    nextVersion
  );

  console.log(`${nextVersion}`);
};

runChangelogs(options);
