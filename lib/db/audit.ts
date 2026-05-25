import "server-only";
import { createServiceClient } from "@/lib/supabase";

export async function recordAudit({
  userId,
  entityType,
  entityId,
  action,
  changes,
}: {
  userId: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete";
  changes: Record<string, unknown>;
}): Promise<void> {
  const client = createServiceClient();
  const { error } = await client.from("audit_logs").insert([
    {
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      action,
      changes,
    },
  ]);

  if (error) console.error(`Failed to record audit log: ${error.message}`);
}
