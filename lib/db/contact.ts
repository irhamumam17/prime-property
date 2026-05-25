import "server-only";
import { createServiceClient } from "@/lib/supabase";

export async function checkRateLimit(ip: string): Promise<boolean> {
  const client = createServiceClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from("contact_submissions")
    .select("id")
    .eq("ip_address", ip)
    .gt("submitted_at", oneHourAgo);

  if (error) {
    console.error("Failed to check rate limit:", error);
    return false;
  }

  // Allow if less than 3 submissions in the last hour
  return (data?.length || 0) < 3;
}

export async function recordSubmission(ip: string): Promise<void> {
  const client = createServiceClient();

  const { error } = await client.from("contact_submissions").insert([
    {
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Failed to record submission:", error);
  }
}

export async function getSubmissionCount(ip: string): Promise<number> {
  const client = createServiceClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from("contact_submissions")
    .select("id")
    .eq("ip_address", ip)
    .gt("submitted_at", oneHourAgo);

  if (error) {
    console.error("Failed to get submission count:", error);
    return 0;
  }

  return data?.length || 0;
}
