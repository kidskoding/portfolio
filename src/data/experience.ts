import astralLogoIcon from "../assets/astral.jpg";
import brunswickLogoIcon from "../assets/brunswick.jpg";
import databricksLogoIcon from "../assets/databricks-logo.jpeg";
import sapienceLogoIcon from "../assets/sapience-logo.jpeg";
import agenticAiUiucLogoIcon from "../assets/agentic-ai-uiuc.jpg";
import ivrLogoIcon from "../assets/ivr-logo.jpeg";
import kidskodingLogoIcon from "../assets/kidskoding-logo.jpeg";
import tmobileLogoIcon from "../assets/tmobile-logo.png";

const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = endDate === "Present" ? new Date() : new Date(endDate);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
    return parts.join(" ") || "1 mo";
};

export interface ExperienceRole {
    title: string;
    employmentType?: string;
    startDate: string;
    endDate: string;
    duration: string;
    description: string[];
    skills: string[];
}

export interface Experience {
    id: string;
    company: string;
    companyLogo: string;
    location?: string;
    locationType?: string;
    hidden?: boolean;
    startDate: string;
    endDate: string;
    duration: string;
    roles: ExperienceRole[];
}

export const experiences: Experience[] = [
    {
        id: "11",
        company: "Brunswick Corporation",
        companyLogo: brunswickLogoIcon.src,
        location: "Champaign, Illinois",
        startDate: "Aug 2026",
        endDate: "Present",
        duration: calculateDuration("Aug 2026", "Present"),
        roles: [
            {
                title: "software development engineering intern",
                employmentType: "Internship",
                startDate: "Aug 2026",
                endDate: "Present",
                duration: calculateDuration("Aug 2026", "Present"),
                description: [
                    "fall 2026 | via uiuc research park, boating intelligence design lab",
                    "full stack development across various boating intelligence applications, enabling an ACES (autonomous, connected, electrified, and shared) strategy",
                ],
                skills: ["Cloudflare Workers", "Git", "GitHub", "Okta", "PostgreSQL", "EffectTS", "Rust", "Nix", "Vite Plus", "Vite"],
            },
        ],
    },
    {
        id: "12",
        company: "Astral",
        companyLogo: astralLogoIcon.src,
        startDate: "Sep 2026",
        endDate: "Present",
        duration: calculateDuration("Sep 2026", "Present"),
        roles: [
            {
                title: "oss developer",
                startDate: "Sep 2026",
                endDate: "Present",
                duration: calculateDuration("Sep 2026", "Present"),
                description: [
                    "improving the experience behind uv, ruff, and ty: the perfect triad for fast and efficient modern python development",
                ],
                skills: ["Rust", "GitHub", "Git", "Python"],
            },
        ],
    },
    {
        id: "9",
        company: "Databricks",
        companyLogo: databricksLogoIcon.src,
        startDate: "May 2026",
        endDate: "Present",
        duration: calculateDuration("May 2026", "Present"),
        roles: [
            {
                title: "student fellowship",
                startDate: "May 2026",
                endDate: "Present",
                duration: calculateDuration("May 2026", "Present"),
                description: [
                    "creating a launchpad into driving and fostering databricks, data, and ai adoption via tech talks, workshops, and hackathons!!",
                ],
                skills: ["Azure Databricks", "Databricks", "Business Intelligence (BI)", "Data Engineering"],
            },
        ],
    },
    {
        id: "8",
        company: "T-Mobile",
        companyLogo: tmobileLogoIcon.src,
        location: "Frisco, Texas",
        startDate: "May 2026",
        endDate: "Aug 2026",
        duration: calculateDuration("May 2026", "Aug 2026"),
        roles: [
            {
                title: "software engineering intern",
                employmentType: "Internship",
                startDate: "May 2026",
                endDate: "Aug 2026",
                duration: calculateDuration("May 2026", "Aug 2026"),
                description: [
                    "summer 2026 | servicenow itsm team; ai agents and ai governance within servicenow as a PaaS",
                ],
                skills: ["ServiceNow", "Atlassian Suite", "Agentic AI Development", "Claude", "Claude Cowork", "Claude Code"],
            },
        ],
    },
    {
        id: "1",
        company: "Agentic AI @ UIUC",
        companyLogo: agenticAiUiucLogoIcon.src,
        location: "Champaign, Illinois",
        startDate: "Feb 2026",
        endDate: "Present",
        duration: calculateDuration("Feb 2026", "Present"),
        roles: [
            {
                title: "president",
                startDate: "Aug 2026",
                endDate: "Present",
                duration: calculateDuration("Aug 2026", "Present"),
                description: [],
                skills: [],
            },
            {
                title: "member of technical staff",
                startDate: "Feb 2026",
                endDate: "Aug 2026",
                duration: calculateDuration("Feb 2026", "Aug 2026"),
                description: [
                    "actively building a community that involves 200+ UIUC students building impactful AI agents that solve real world business problems",
                ],
                skills: ["Claude Code", "Cursor", "Langchain", "MCP", "RAG", "Pinecone"],
            },
        ],
    },
    {
        id: "2",
        company: "Sapience Inc",
        companyLogo: sapienceLogoIcon.src,
        location: "Naperville, Illinois",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        duration: calculateDuration("Jun 2025", "Aug 2025"),
        roles: [
            {
                title: "google cloud ai & data intern",
                employmentType: "Internship",
                startDate: "Jun 2025",
                endDate: "Aug 2025",
                duration: calculateDuration("Jun 2025", "Aug 2025"),
                description: [
                    "summer 2025 | interned at client IAA (Insurance Auto Auctions) on the data science & data engineering team",
                    "google gemini and python extract important data from automobile registration documents → transform into structured JSON → load into Azure Blob Storage",
                ],
                skills: ["Google Cloud Platform", "Microsoft Azure", "Vertex AI", "Agile Project Management", "Prompt Engineering", "Python", "SQL"],
            },
        ],
    },
    {
        id: "3",
        company: "Illini VEX Robotics",
        companyLogo: ivrLogoIcon.src,
        location: "Champaign, Illinois",
        startDate: "Aug 2024",
        endDate: "May 2025",
        duration: calculateDuration("Aug 2024", "May 2025"),
        roles: [
            {
                title: "vex software - ai & ml research and development",
                startDate: "Aug 2024",
                endDate: "May 2025",
                duration: calculateDuration("Aug 2024", "May 2025"),
                description: [
                    "ai/ml research & development - built and optimized reinforcement learning models using PyTorch, OpenAI Gym, and Unity's MLAgents framework for simulated environments",
                ],
                skills: ["C#", "Unity", ".NET", "Python", "Artificial Intelligence (AI)", "Machine Learning"],
            },
        ],
    },
    {
        id: "4",
        company: "kidskoding.com",
        companyLogo: kidskodingLogoIcon.src,
        startDate: "Sep 2018",
        endDate: "Aug 2023",
        duration: calculateDuration("Sep 2018", "Aug 2023"),
        roles: [
            {
                title: "founder",
                startDate: "Sep 2018",
                endDate: "Aug 2023",
                duration: calculateDuration("Sep 2018", "Aug 2023"),
                description: [
                    "founded and scaled an edtech platform teaching coding to 1,000+ students",
                ],
                skills: ["Cursor", "Claude Code", "Astro", "Tailwind CSS", "Go", "MongoDB", "Node.js"],
            },
        ],
    },
];
