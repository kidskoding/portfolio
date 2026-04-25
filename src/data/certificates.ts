import microsoftLogo from '../assets/microsoft-logo.jpg';
import servicenowLogo from '../assets/servicenow.png';

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuerLogo?: string;
  issuedDate: string;
  pdfPath?: string;
  skills: string[];
}

// Keep certificate PDF paths out of source control by setting:
// PUBLIC_CERTIFICATE_PDFS='{"cert-id":"/certificates/file.pdf"}' (local files)
// or external URLs like 'https://.../file.pdf' in `.env`/production env vars.
// `public/certificates/` is gitignored so PDFs stay out of GitHub.
const certificatePdfMap = (() => {
  const raw = import.meta.env.PUBLIC_CERTIFICATE_PDFS;
  if (!raw) return {} as Record<string, string>;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {} as Record<string, string>;

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, path]) => typeof id === 'string' && typeof path === 'string' && path.trim().length > 0
      )
    );
  } catch {
    return {} as Record<string, string>;
  }
})();

const resolveCertificatePdfPath = (id: string): string | undefined => certificatePdfMap[id];

export const certificates: Certificate[] = [
  {
    id: 'github-actions',
    name: 'Automate development tasks by using GitHub Actions',
    issuer: 'GitHub',
    issuedDate: 'Apr 2026',
    pdfPath: resolveCertificatePdfPath('github-actions'),
    skills: ['GitHub', 'GitHub Actions'],
  },
  {
    id: 'microsoft-ai-agent',
    name: 'Microsoft Applied Skills: Create an AI agent',
    issuer: 'Microsoft',
    issuerLogo: microsoftLogo.src,
    issuedDate: 'Apr 2026',
    pdfPath: resolveCertificatePdfPath('microsoft-ai-agent'),
    skills: ['Microsoft Azure'],
  },
  {
    id: 'servicenow-admin',
    name: 'ServiceNow Administration Fundamentals',
    issuer: 'ServiceNow',
    issuerLogo: servicenowLogo.src,
    issuedDate: 'Apr 2026',
    pdfPath: resolveCertificatePdfPath('servicenow-admin'),
    skills: ['ServiceNow'],
  },
  {
    id: 'claude-code',
    name: 'Claude Code in Action',
    issuer: 'Anthropic',
    issuedDate: 'Mar 2026',
    pdfPath: resolveCertificatePdfPath('claude-code'),
    skills: ['Claude Code'],
  },
  {
    id: 'databricks-ai-agents',
    name: 'AI Agent Fundamentals',
    issuer: 'Databricks',
    issuedDate: 'Jan 2026',
    pdfPath: resolveCertificatePdfPath('databricks-ai-agents'),
    skills: ['Databricks'],
  },
  {
    id: 'meta-frontend',
    name: 'Meta Front End Development Capstone',
    issuer: 'Meta',
    issuedDate: 'Aug 2024',
    pdfPath: resolveCertificatePdfPath('meta-frontend'),
    skills: ['Front-End Development', 'HTML', 'Cascading Style Sheets (CSS)', 'React.js', 'Git', 'JavaScript'],
  },
  {
    id: 'meta-backend',
    name: 'Meta Backend Development Capstone',
    issuer: 'Meta',
    issuedDate: 'Aug 2024',
    pdfPath: resolveCertificatePdfPath('meta-backend'),
    skills: ['Python', 'Back-End Web Development'],
  },
  {
    id: 'oracle-java',
    name: 'Oracle Certified Associate, Java SE 8 Programmer',
    issuer: 'Oracle',
    issuedDate: 'Jul 2024',
    pdfPath: resolveCertificatePdfPath('oracle-java'),
    skills: ['Java', 'Computer Science'],
  },
  {
    id: 'certiport-java',
    name: 'Java IT Specialist',
    issuer: 'Certiport',
    issuedDate: 'May 2022',
    pdfPath: resolveCertificatePdfPath('certiport-java'),
    skills: ['Java', 'Computer Science'],
  },
];
