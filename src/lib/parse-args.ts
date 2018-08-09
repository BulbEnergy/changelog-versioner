export const parseArgs = (...rawArgs: string[]) => {
  const [
    locationArg,
    folder,
    outputArg,
    outputPath,
    versionArg,
    versionBeforeUpdating,
    noUpdate = false
  ] = rawArgs;

  if (locationArg !== "--find-changelogs-in") {
    console.error("Requires --find-changelogs-in argument");
    process.exit(1);
  }

  if (outputArg !== "--aggregated-output") {
    console.error("Requires --aggregated-output");
    process.exit(1);
  }

  if (versionArg !== "--version-before-updating") {
    console.error("Requires --version-before-updating");
    process.exit(1);
  }

  return {
    folder,
    outputPath,
    versionBeforeUpdating,
    noUpdate
  };
};
