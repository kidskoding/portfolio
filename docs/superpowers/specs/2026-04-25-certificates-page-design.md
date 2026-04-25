# Certificates Page Design

**Date:** 2026-04-25
**Status:** Approved

## Overview

Add a `/certificates` page to the portfolio displaying 10 professional certifications with optional PDF viewing. Follows existing Neovim-themed design patterns.

## Data Layer

**File:** `src/data/certificates.ts`

```ts
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuerLogo: ImageMetadata;
  issuedDate: string;       // e.g. "Apr 2026"
  credentialId?: string;
  pdfPath?: string;         // e.g. "/certificates/claude-code.pdf"
  skills: string[];
}
```

**Certificates (10 total):**
| Name | Issuer | Date |
|---|---|---|
| Automate development tasks by using GitHub Actions | GitHub | Apr 2026 |
| Microsoft Applied Skills: Create an AI agent | Microsoft | Apr 2026 |
| ServiceNow Administration Fundamentals | ServiceNow | Apr 2026 |
| Claude Code in Action | Anthropic | Mar 2026 |
| AI Agent Fundamentals | Databricks | Jan 2026 |
| Meta Front End Development Capstone | Meta | Aug 2024 |
| Meta Backend Development Capstone | Meta | Aug 2024 |
| Oracle Certified Associate, Java SE 8 Programmer | Oracle | Jul 2024 |
| Java IT Specialist | Certiport | May 2022 |

## PDF Storage

PDFs placed in `/public/certificates/`. Referenced as `/certificates/<id>.pdf`. `pdfPath` is optional — "View" button hidden if not set.

## Components

**`src/components/CertCard.astro`**
- Issuer logo (32px, object-contain)
- Cert name (bold, text-text-primary)
- Issuer name (text-text-secondary, small)
- Issue date (monospace, dim)
- Skill chips (same style as rest of site)
- "View" button → opens `pdfPath` in new tab, only rendered if `pdfPath` set

## Page

**`src/pages/certificates.astro`**
- Same layout shell as other pages (`max-w-3xl`, `px-6 py-8`)
- Page header: label + h1 "Certifications" + subtitle
- 2-col card grid on desktop, 1-col on mobile (`grid-cols-1 sm:grid-cols-2`)
- Cards sorted newest → oldest (already ordered in data file)
- All `[data-animate]` for GSAP entry animation

## Chrome Updates

**`src/components/NvimChrome.astro`**
- Add `{ path: '/certificates', file: 'certificates.astro', icon: 'astro' }` to `buffers` array (after `skills`, before `blog`)
- Appears in bufferline and NvimTree file list automatically

## Issuer Logos

Import as Astro image assets from `src/assets/`. Need logos for: GitHub, Microsoft, ServiceNow, Anthropic, Databricks, Meta, Oracle, Certiport. Several already exist (microsoft-logo.jpg). New ones added to `src/assets/`.
