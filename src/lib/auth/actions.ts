"use server";
// this is a ServerActions file

//import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth/auth";

export async function login(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData);

    // Note: this will not work here as the signIn() is already returning a redirect, so
    // this will actually not be called at all,
    // but if implementing auth/signin without NextAuth then it would be ok
    // redirect("/dashboard");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
