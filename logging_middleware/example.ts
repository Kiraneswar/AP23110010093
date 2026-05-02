import { Log, configureLogger } from './index';

async function runExamples() {
  console.log("=== Testing Reusable Logging Middleware ===\n");

  configureLogger({
    authCredentials: {
      client_id: "test_runner"
    }
  });

  try {
    console.log("Sending valid backend error log...");
    await Log("backend", "error", "handler", "received string, expected bool");

    console.log("Sending valid frontend info log...");
    await Log("frontend", "info", "component", "User navigated to dashboard");

    console.log("Sending fatal log...");
    await Log("backend", "fatal", "db", "Connection to database permanently lost");

    console.log("\nTesting strict validation (Expected to throw)...");
    try {
      // @ts-ignore
      await Log("backend", "info", "component", "This should fail because 'component' is a frontend package");
      console.error("FAIL: Validation did not trigger!");
    } catch (error: any) {
      console.log(`Validation correctly caught error: ${error.message}`);
    }

  } catch (err: any) {
    console.error("Unexpected error in tests:", err.message);
  }
}

runExamples();
