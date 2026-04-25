# Certificates Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/certificates` page displaying 10 professional certifications with optional PDF viewing via new-tab links.

**Architecture:** Add a `certificates.ts` data file, a `CertCard.astro` component, and a `certificates.astro` page. PDFs live in `/public/certificates/`. Register the new page in `NvimChrome.astro` buffers.

**Tech Stack:** Astro, Tailwind CSS v4, TypeScript

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/data/certificates.ts` | Certificate interface + data array |
| Create | `src/components/CertCard.astro` | Single cert card UI |
| Create | `src/pages/certificates.astro` | Certificates page |
| Modify | `src/components/NvimChrome.astro` | Register page in bufferline + NvimTree |
| Create | `public/certificates/` | PDF storage (user drops files here) |

---

### Task 1: Create the data file

**Files:**
- Create: `src/data/certificates.ts`

- [ ] **Step 1: Create `src/data/certificates.ts`**

```ts
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuerLogo?: string;
  issuedDate: string;
  credentialId?: string;
  pdfPath?: string;
  skills: string[];
}

import microsoftLogo from '../assets/microsoft-logo.jpg';
import servicenowLogo from '../assets/servicenow.png';

export const certificates: Certificate[] = [
  {
    id: 'github-actions',
    name: 'Automate development tasks by using GitHub Actions',
    issuer: 'GitHub',
    issuedDate: 'Apr 2026',
    skills: ['GitHub', 'GitHub Actions'],
  },
  {
    id: 'microsoft-ai-agent',
    name: 'Microsoft Applied Skills: Create an AI agent',
    issuer: 'Microsoft',
    issuerLogo: microsoftLogo.src,
    issuedDate: 'Apr 2026',
    credentialId: '41E1C44D073E5E98',
    skills: ['Microsoft Azure'],
  },
  {
    id: 'servicenow-admin',
    name: 'ServiceNow Administration Fundamentals',
    issuer: 'ServiceNow',
    issuerLogo: servicenowLogo.src,
    issuedDate: 'Apr 2026',
    skills: ['ServiceNow'],
  },
  {
    id: 'claude-code',
    name: 'Claude Code in Action',
    issuer: 'Anthropic',
    issuedDate: 'Mar 2026',
    credentialId: 'd32kcb65hmgw',
    skills: ['Claude Code'],
  },
  {
    id: 'databricks-ai-agents',
    name: 'AI Agent Fundamentals',
    issuer: 'Databricks',
    issuedDate: 'Jan 2026',
    credentialId: '171448385',
    skills: ['Databricks'],
  },
  {
    id: 'meta-frontend',
    name: 'Meta Front End Development Capstone',
    issuer: 'Meta',
    issuedDate: 'Aug 2024',
    skills: ['React', 'HTML/CSS', 'JavaScript', 'Version Control', 'Front-End Development'],
  },
  {
    id: 'meta-backend',
    name: 'Meta Backend Development Capstone',
    issuer: 'Meta',
    issuedDate: 'Aug 2024',
    skills: ['Python', 'Back-End Web Development'],
  },
  {
    id: 'oracle-java',
    name: 'Oracle Certified Associate, Java SE 8 Programmer',
    issuer: 'Oracle',
    issuedDate: 'Jul 2024',
    skills: ['Java', 'Computer Science'],
  },
  {
    id: 'certiport-java',
    name: 'Java IT Specialist',
    issuer: 'Certiport',
    issuedDate: 'May 2022',
    skills: ['Java', 'Computer Science'],
  },
];
```

- [ ] **Step 2: Verify no type errors**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors related to `certificates.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/data/certificates.ts
git commit -m "feat(certificates): add certificate data and interface"
```

---

### Task 2: Create the CertCard component

**Files:**
- Create: `src/components/CertCard.astro`

- [ ] **Step 1: Create `src/components/CertCard.astro`**

```astro
---
import type { Certificate } from '../data/certificates';

interface Props {
  cert: Certificate;
}

const { cert } = Astro.props;
---

<div class="glow-card p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-bg-card-hover">
  <div class="flex items-start gap-3">
    <div class="w-10 h-10 rounded-lg border border-border-default bg-bg-secondary/80 overflow-hidden flex items-center justify-center shrink-0">
      {cert.issuerLogo
        ? <img src={cert.issuerLogo} alt={cert.issuer} class="w-full h-full object-contain p-1" loading="lazy" />
        : <span class="text-sm font-bold text-text-secondary">{cert.issuer[0]}</span>
      }
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-semibold text-text-primary leading-snug">{cert.name}</h3>
      <p class="text-xs text-text-secondary mt-0.5">{cert.issuer}</p>
    </div>
  </div>

  <div class="flex items-center justify-between gap-2">
    <span class="font-mono text-xs text-text-muted">{cert.issuedDate}</span>
    {cert.credentialId && (
      <span class="font-mono text-xs text-text-muted truncate">ID: {cert.credentialId}</span>
    )}
  </div>

  {cert.skills.length > 0 && (
    <div class="flex flex-wrap gap-1.5">
      {cert.skills.map((skill) => (
        <span class="px-2 py-0.5 text-xs font-mono bg-bg-secondary border border-border-subtle text-text-secondary rounded-sm">
          {skill}
        </span>
      ))}
    </div>
  )}

  {cert.pdfPath && (
    <a
      href={cert.pdfPath}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-auto inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-text-primary transition-colors duration-200"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      View Certificate
    </a>
  )}
</div>
```

- [ ] **Step 2: Start dev server and check for syntax errors**

```bash
npm run dev
```

Expected: dev server starts at `localhost:4321`, no build errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CertCard.astro
git commit -m "feat(certificates): add CertCard component"
```

---

### Task 3: Create the certificates page

**Files:**
- Create: `src/pages/certificates.astro`

- [ ] **Step 1: Create `src/pages/certificates.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import CertCard from '../components/CertCard.astro';
import { certificates } from '../data/certificates';
---

<Layout title="Certifications">
  <main class="max-w-3xl w-full mx-auto px-6 py-8" id="main-content">
    <div data-animate>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Certifications</p>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight gradient-text">Certifications</h1>
      <p class="text-text-muted mt-3 text-base max-w-md">licenses and certifications I've earned</p>
    </div>

    <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4" data-animate>
      {certificates.map((cert) => (
        <CertCard cert={cert} />
      ))}
    </div>
  </main>
</Layout>
```

- [ ] **Step 2: Visit `localhost:4321/certificates` and verify**

Check:
- Page loads with correct header
- All 9 certs render as cards
- Cards show logo (or letter fallback), name, issuer, date, skills
- No "View Certificate" links yet (no PDFs set)

- [ ] **Step 3: Commit**

```bash
git add src/pages/certificates.astro
git commit -m "feat(certificates): add certificates page"
```

---

### Task 4: Register page in NvimChrome

**Files:**
- Modify: `src/components/NvimChrome.astro`

- [ ] **Step 1: Add `certificates` to the buffers array**

In `src/components/NvimChrome.astro`, find the `buffers` array and add the new entry between `skills` and `blog`:

```ts
const buffers = [
  { path: '/', file: 'index.astro', icon: 'astro' },
  { path: '/about', file: 'about.astro', icon: 'astro' },
  { path: '/experience', file: 'experience.astro', icon: 'astro' },
  { path: '/projects', file: 'projects.astro', icon: 'astro' },
  { path: '/skills', file: 'skills.astro', icon: 'astro' },
  { path: '/certificates', file: 'certificates.astro', icon: 'astro' },
  { path: '/blog', file: 'blog.astro', icon: 'astro' },
  { path: '/contact', file: 'contact.astro', icon: 'astro' },
];
```

- [ ] **Step 2: Verify in browser**

Navigate between pages. Check:
- `certificates.astro` appears as buffer 6 in the bufferline
- It appears in the NvimTree file list under `src`
- Active highlight on `/certificates` works

- [ ] **Step 3: Commit**

```bash
git add src/components/NvimChrome.astro
git commit -m "feat(certificates): register certificates page in chrome buffers"
```

---

### Task 5: Create PDF directory and wire up first PDF

**Files:**
- Create: `public/certificates/` (directory)

- [ ] **Step 1: Create the certificates PDF directory**

```bash
mkdir -p public/certificates
```

- [ ] **Step 2: Add a PDF and wire it up in the data**

Drop a PDF (e.g. `claude-code.pdf`) into `public/certificates/`. Then in `src/data/certificates.ts`, add `pdfPath` to the matching entry:

```ts
{
  id: 'claude-code',
  name: 'Claude Code in Action',
  issuer: 'Anthropic',
  issuedDate: 'Mar 2026',
  credentialId: 'd32kcb65hmgw',
  pdfPath: '/certificates/claude-code.pdf',
  skills: ['Claude Code'],
},
```

- [ ] **Step 3: Verify "View Certificate" link appears and opens PDF in new tab**

Visit `localhost:4321/certificates`. The Claude Code card should show the "View Certificate" link. Click it — PDF opens in a new browser tab.

- [ ] **Step 4: Repeat for any other PDFs you have**

Add each PDF to `public/certificates/` and add its `pdfPath` to the matching entry in `certificates.ts`.

- [ ] **Step 5: Commit**

```bash
git add public/certificates/ src/data/certificates.ts
git commit -m "feat(certificates): add PDF assets and wire up view links"
```

---

### Task 6: Add issuer logos for remaining issuers

**Files:**
- Modify: `src/data/certificates.ts`
- Add assets: `src/assets/` (logos for GitHub, Anthropic, Databricks, Meta, Oracle, Certiport)

- [ ] **Step 1: Add logo files to `src/assets/`**

Download or source logos for the issuers that don't have assets yet:
- `src/assets/github-logo.png`
- `src/assets/anthropic-logo.png`
- `src/assets/databricks-logo.png`
- `src/assets/meta-logo.png`
- `src/assets/oracle-logo.png`
- `src/assets/certiport-logo.png`

- [ ] **Step 2: Import logos and add to certificate entries in `src/data/certificates.ts`**

```ts
import microsoftLogo from '../assets/microsoft-logo.jpg';
import servicenowLogo from '../assets/servicenow.png';
import githubLogo from '../assets/github-logo.png';
import anthropicLogo from '../assets/anthropic-logo.png';
import databricksLogo from '../assets/databricks-logo.png';
import metaLogo from '../assets/meta-logo.png';
import oracleLogo from '../assets/oracle-logo.png';
import certiportLogo from '../assets/certiport-logo.png';
```

Then add `issuerLogo: xyzLogo.src` to each matching certificate entry.

- [ ] **Step 3: Verify all cards show logos**

Visit `localhost:4321/certificates`. Every card should show an issuer logo instead of a letter fallback.

- [ ] **Step 4: Commit**

```bash
git add src/assets/ src/data/certificates.ts
git commit -m "feat(certificates): add issuer logos to all cert cards"
```

---

### Task 7: Final check and push

- [ ] **Step 1: Build for production**

```bash
npm run build
```

Expected: clean build, no errors or warnings about missing assets.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Visit `localhost:4321/certificates`. Verify:
- All 9 cards render correctly
- Logo fallbacks work for any certs without logos
- "View Certificate" links open PDFs in new tab
- Page entry animations run (GSAP fade+slide)
- Bufferline shows `certificates.astro` with correct number
- NvimTree highlights `/certificates` as active

- [ ] **Step 3: Push**

```bash
git push origin master
```
