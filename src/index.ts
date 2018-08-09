import { parseArgs } from "./lib/parse-args";
import { searchChangelogs } from "./lib/search-changelogs";
import { getChangelogsMarkdownAst } from "./lib/get-changelogs-markdown-ast";
import { determineNextVersion } from "./lib/determine-version-increment";
import { bumpAndAggregateChangelogs } from "./lib/bump-and-aggregate-changelogs";
import { outputAggregatedChangelogs } from "./lib/output-aggregated-changelogs";

const [, , ...args] = process.argv;

const options = parseArgs(...args);

interface RunChangeLogsOptions {
  folder: string;
  outputPath: string;
  versionBeforeUpdating: string;
  noUpdate: string | boolean;
}

const runChangelogs = async (options: RunChangeLogsOptions) => {
  const changelogFiles = await searchChangelogs(options.folder);

  const changelogs = await getChangelogsMarkdownAst(changelogFiles);

  const nextVersion = determineNextVersion({
    changelogs,
    versionBeforeUpdating: options.versionBeforeUpdating
  });

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
};

runChangelogs(options);
