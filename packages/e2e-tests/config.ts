import { join } from "path";

export type BrowserName = "firefox" | "chromium";

export default {
  backendUrl: process.env.DISPATCH_ADDRESS || "wss://dispatch.replay.io",
  graphqlUrl: process.env.GRAPHQL_ADDRESS || "https://api.replay.io/v1/graphql",
  browserExamplesPath: join(__dirname, "../../public/test/examples"),
  browserName: (process.env.RECORD_REPLAY_TARGET === "chromium"
    ? "chromium"
    : "firefox") as BrowserName,
  browserPath: process.env.RECORD_REPLAY_PATH,
  devtoolsUrl: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:8080",
  driverPath: process.env.RECORD_REPLAY_DRIVER,
  headless: !!process.env.RECORD_REPLAY_PLAYWRIGHT_HEADLESS,
  nodeExamplesPath: join(__dirname, "../../test/examples/node"),
  nodePath: process.env.RECORD_REPLAY_NODE,
  // This API key allows access to the whole team that holds all these test recordings.
  // If someone wanted to, they could go in and delete the workspace or recordings in it or anything.
  // While thats not great, it's also not the end of the world.
  // If someone does that, we can always change this code to only run in CI in the main repo and have this as a secret.
  // It's a lot easier to hardcode it for now though.
  replayApiKey: process.env.API_KEY || "rwk_7XPbO5fhz0bkhANYXtN2dkm74wNQCchXf2OxVgAerTQ",
  shouldRecordTest: !process.env.DONT_RECORD_TEST,
  shouldSaveCoverageData: !!process.env.E2E_CODE_COVERAGE,
  updateFixtures: !!process.env.SHOULD_UPDATE_FIXTURES,
  useExampleFile: !process.env.SHOULD_RECORD_EXAMPLES,
};
