"use client";

import { useActionState } from "react";
import { Button } from "@/components/ds";
import { login, type FormState } from "../actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, null);

  return (
    <form className="bh-login__form" action={formAction}>
      <div className="sp-field">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          placeholder="jij@setpiece.nl"
          disabled={pending}
        />
      </div>

      <div className="sp-field">
        <label htmlFor="login-password">Wachtwoord</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </div>

      {state?.error && (
        <p className="sp-form-error" role="alert">
          {state.error}
        </p>
      )}

      <Button variant="primary" size="lg" type="submit" disabled={pending}>
        {pending ? "Inloggen..." : "Log in"}
      </Button>
    </form>
  );
}
