"use client";
import { useFormState, useFormStatus } from "react-dom";

import { login } from "@/lib/auth/actions";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(login, undefined);

  return (
    <form action={dispatch}>
      <div>
        <h1>Please log in to continue.</h1>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <div>
              <input id="email" type="email" name="email" placeholder="Enter your email address" required />
            </div>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={3}
              />
            </div>
          </div>
        </div>
        <LoginButton />
        <div aria-live="polite" aria-atomic="true">
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return <button aria-disabled={pending}>Log in</button>;
}
