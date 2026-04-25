import microsoftLogo from '../assets/microsoft-logo.jpg';
import servicenowLogo from '../assets/servicenow.png';

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
