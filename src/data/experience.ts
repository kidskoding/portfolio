import sapienceLogoIcon from "../assets/sapience-logo.jpeg";
import uiucLogoIcon from "../assets/illini-logo.png";
import ivrLogoIcon from "../assets/ivr-logo.jpeg";
import kidskodingLogoIcon from "../assets/kidskoding-logo.jpeg";
import microsoftLogoIcon from "../assets/microsoft-logo.jpg";
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
                    "incoming summer 2026 - servicenow platform team, building ai agents and enterprise workflows to support internal IT operations",
                ],
                skills: ["ServiceNow"],
            },
        ],
    },
    {
        id: "6",
        company: "Microsoft",
        companyLogo: microsoftLogoIcon.src,
        startDate: "Mar 2026",
        endDate: "Present",
        duration: calculateDuration("Mar 2026", "Present"),
        roles: [
            {
                title: "student ambassador",
                startDate: "Apr 2026",
                endDate: "Present",
                duration: calculateDuration("Apr 2026", "Present"),
                description: [
                    "leading and sharing knowledge about Microsoft technologies and ai on uiuc campus",
                ],
                skills: ["Microsoft Azure"],
            },
            {
                title: "open source contributor",
                startDate: "Mar 2026",
                endDate: "Present",
                duration: calculateDuration("Mar 2026", "Present"),
                description: [
                    "contributed to open-source developer tools, including Microsoft-backed frameworks and projects focused on Rust and automation",
                ],
                skills: ["Rust", "Git", "GitHub", "Go"],
            },
        ],
    },
    {
        id: "1",
        company: "Agentic AI @ UIUC",
        companyLogo: uiucLogoIcon.src,
        location: "Champaign, Illinois",
        startDate: "Feb 2026",
        endDate: "Present",
        duration: calculateDuration("Feb 2026", "Present"),
        roles: [
            {
                title: "member of technical staff",
                startDate: "Feb 2026",
                endDate: "Present",
                duration: calculateDuration("Feb 2026", "Present"),
                description: [
                    "actively building a community that involves 100+ UIUC students building impactful AI agents that solve real world business problems",
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
                    "interned at client IAA (Insurance Auto Auctions) on the data science & data engineering team - google gemini and python extract important data from automobile registration documents → transform into structured JSON → load into Azure Blob Storage",
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
