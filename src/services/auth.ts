import type { User, LoginPayload } from "../utils/types";
import { client } from "./client";

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await client.post<User>("/login.php", payload);

  return data;
}
