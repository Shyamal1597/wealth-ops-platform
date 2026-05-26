# General Security Principles

When generating code, always:

1.  **Validate all input server-side** — Never trust client-side validation alone
2.  **Use parameterized queries** — Never concatenate user input into queries
3.  **Encode output contextually** — HTML, JS, URL, CSS contexts need different encoding
4.  **Apply authentication checks** — On every endpoint, not just at routing
5.  **Apply authorization checks** — Verify the user can access the specific resource
6.  **Use secure defaults**
7.  **Handle errors securely** — Don't leak stack traces or internal details to users
8.  **Keep dependencies updated** — Use tools to track vulnerable dependencies

When unsure, choose the more restrictive/secure option and document the security consideration in comments.
