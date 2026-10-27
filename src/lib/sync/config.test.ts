import test from "node:test";
import assert from "node:assert/strict";

import { isCloudSyncConfigured } from "./config.ts";

const credentials = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key",
};

test("cloud sync requires an explicit opt-in and both credentials", () => {
  assert.equal(isCloudSyncConfigured({ ...credentials }), false);
  assert.equal(isCloudSyncConfigured({ ...credentials, NEXT_PUBLIC_ENABLE_CLOUD_SYNC: "false" }), false);
  assert.equal(isCloudSyncConfigured({ ...credentials, NEXT_PUBLIC_ENABLE_CLOUD_SYNC: "true" }), true);
});

test("cloud sync stays off when either credential is missing", () => {
  assert.equal(isCloudSyncConfigured({ NEXT_PUBLIC_ENABLE_CLOUD_SYNC: "true" }), false);
  assert.equal(isCloudSyncConfigured({
    NEXT_PUBLIC_ENABLE_CLOUD_SYNC: "true",
    NEXT_PUBLIC_SUPABASE_URL: credentials.NEXT_PUBLIC_SUPABASE_URL,
  }), false);
});
