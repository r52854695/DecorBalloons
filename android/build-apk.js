/*
 * Non-interactive TWA build.
 *
 * The bubblewrap CLI prompts for everything and cannot run without a TTY, so
 * this drives @bubblewrap/core directly instead. Every answer the CLI would
 * have asked for is already in twa-manifest.json.
 */
const path = require("path");
const fs = require("fs");
const os = require("os");

const CORE =
  "C:/Users/rohit/AppData/Local/nvm/v24.19.0/node_modules/@bubblewrap/cli/node_modules/@bubblewrap/core";
const {
  Config,
  JdkHelper,
  AndroidSdkTools,
  GradleWrapper,
  TwaManifest,
  TwaGenerator,
  ConsoleLog,
} = require(CORE);

const HOME = os.homedir();
const JDK = path.join(HOME, ".bubblewrap", "jdk", "jdk-17.0.11+9");
const SDK = path.join(HOME, ".bubblewrap", "android_sdk");
const PROJECT = __dirname;

async function main() {
  const log = new ConsoleLog("apk");
  const password = fs.readFileSync(path.join(PROJECT, "keystore-password.txt"), "utf8").trim();

  const config = new Config(JDK, SDK);
  const jdkHelper = new JdkHelper(process, config);
  const androidSdkTools = await AndroidSdkTools.create(process, config, jdkHelper, log);

  log.info("checking build tools…");
  if (!(await androidSdkTools.checkBuildTools())) {
    log.info("installing build tools (this downloads a few hundred MB)…");
    await androidSdkTools.installBuildTools();
  }

  log.info("reading twa-manifest.json…");
  const twaManifest = await TwaManifest.fromFile(path.join(PROJECT, "twa-manifest.json"));

  log.info("generating android project…");
  const generator = new TwaGenerator();
  await generator.createTwaProject(PROJECT, twaManifest, log);

  log.info("gradle assembleRelease (first run downloads gradle)…");
  const gradle = new GradleWrapper(process, androidSdkTools, PROJECT);
  await gradle.assembleRelease();

  const unsigned = path.join(
    PROJECT,
    "app",
    "build",
    "outputs",
    "apk",
    "release",
    "app-release-unsigned.apk",
  );
  const aligned = path.join(PROJECT, "app-release-aligned.apk");
  const signed = path.join(PROJECT, "decorballoons.apk");

  log.info("zipalign…");
  await androidSdkTools.zipalign(unsigned, aligned);

  log.info("signing…");
  await androidSdkTools.apksigner(
    path.join(PROJECT, "android.keystore"),
    password,
    "decorballoon",
    password,
    aligned,
    signed,
  );

  fs.rmSync(aligned, { force: true });
  const size = (fs.statSync(signed).size / 1024 / 1024).toFixed(2);
  log.info(`DONE → ${signed} (${size} MB)`);
}

main().catch((e) => {
  console.error("BUILD FAILED:", e && e.message ? e.message : e);
  if (e && e.stack) console.error(e.stack.split("\n").slice(0, 6).join("\n"));
  process.exit(1);
});
