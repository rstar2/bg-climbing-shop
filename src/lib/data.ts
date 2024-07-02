import "server-only";

import { sql } from "@vercel/postgres";
import { User } from "./types";

export async function getUser(email: string) {
  try {
    console.log("now", new Date());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    console.log("user:", new Date());
    return user.rows[0] as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
           FROM invoices`;

    const data = await Promise.all([invoiceCountPromise, customerCountPromise, invoiceStatusPromise]);
    // ...
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}
