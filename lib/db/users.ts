import "server-only";
import { hash, compare } from "bcryptjs";
import type { User } from "@/lib/types";
import { createServiceClient } from "@/lib/supabase";

export async function getAllUsers(): Promise<User[]> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapDbUserToUser);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return mapDbUserToUser(data);
}

export async function createUser({
  email,
  name,
  password,
  role,
}: {
  email: string;
  name: string;
  password: string;
  role: "admin" | "superadmin";
}): Promise<User> {
  const passwordHash = await hash(password, 10);
  const client = createServiceClient();

  const { data, error } = await client
    .from("users")
    .insert([
      {
        email,
        name,
        password_hash: passwordHash,
        role,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error || !data) throw new Error("Failed to create user");
  return mapDbUserToUser(data);
}

export async function setUserActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const client = createServiceClient();
  const { error } = await client
    .from("users")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(`Failed to update user status: ${error.message}`);
}

export async function updateUserPassword(
  id: string,
  passwordHash: string
): Promise<void> {
  const client = createServiceClient();
  const { error } = await client
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", id);

  if (error) throw new Error(`Failed to update password: ${error.message}`);
}

export async function verifyPassword(
  passwordInput: string,
  passwordHash: string
): Promise<boolean> {
  return compare(passwordInput, passwordHash);
}

export async function getUserCredentialsByEmail(
  email: string
): Promise<{ id: string; passwordHash: string } | null> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("users")
    .select("id, password_hash")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return { id: data.id, passwordHash: data.password_hash };
}

function mapDbUserToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    isActive: dbUser.is_active,
    createdAt: dbUser.created_at,
  };
}
