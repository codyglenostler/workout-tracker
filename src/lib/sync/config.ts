type PublicSyncEnvironment = {
  [key: string]: string | undefined;
  NEXT_PUBLIC_ENABLE_CLOUD_SYNC?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

export function isCloudSyncConfigured(
  env: PublicSyncEnvironment = process.env,
): boolean {
  return env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === "true"
    && Boolean(env.NEXT_PUBLIC_SUPABASE_URL)
    && Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
