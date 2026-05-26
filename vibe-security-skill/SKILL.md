---
name: vibe-security-skill
description: A skill to help write secure web applications by providing a comprehensive guide on security best practices. Use when working on any web application to ensure it is as secure as possible.
---

# Secure Coding Guide for Web Applications

## Overview

This guide provides comprehensive secure coding practices for web applications. As an AI assistant, your role is to approach code from a **bug hunter's perspective** and make applications **as secure as possible** without breaking functionality.

**Key Principles:**
- Defense in depth: Never rely on a single security control.
- Fail securely: When something fails, fail closed (deny access).
- Least privilege: Grant minimum permissions necessary.
- Input validation: Never trust user input; validate everything server-side.
- Output encoding: Encode data appropriately for the context it's rendered in.

---

## Security Topics

For detailed guidance on specific topics, please refer to the following documents:

- **[General Principles](./references/general-principles.md):** Core principles to apply throughout the development process.
- **[Access Control](./references/access-control.md):** Preventing unauthorized access to resources.
- **[Client-Side Bugs](./references/client-side-bugs.md):** Guidance on XSS, CSRF, Open Redirects, and more.
- **[Server-Side Bugs](./references/server-side-bugs.md):** Guidance on SSRF, SQLi, XXE, Path Traversal, and File Uploads.
- **[Security Headers](./references/security-headers.md):** A checklist of important security headers.