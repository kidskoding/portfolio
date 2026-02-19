import sapienceLogoIcon from "../assets/sapience-logo.jpeg";
import uiucLogoIcon from "../assets/illini-logo.png";
import ivrLogoIcon from "../assets/ivr-logo.jpeg";
import kidskodingLogoIcon from "../assets/kidskoding-logo.jpeg";

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

export interface Experience {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    employmentType?: string;
    startDate: string;
    endDate: string;
    duration: string;
    location?: string;
    locationType?: string;
    description: string[];
    skills: string[];
}

export const experiences: Experience[] = [
    {
        id: "1",
        title: "Software Developer - AI Agents @ UIUC",
        company: "University of Illinois Urbana-Champaign",
        companyLogo: uiucLogoIcon.src,
        startDate: "Feb 2026",
        endDate: "Present",
        duration: calculateDuration("Feb 2026", "Present"),
        location: "Champaign, Illinois",
        description: [

        ],
        skills: ["Claude Code", "Cursor", "Langchain", "MCP", "RAG", "Pinecone"],
    },
    {
        id: "2",
        title: "Google Cloud AI & Data Intern",
        company: "Sapience Inc",
        companyLogo: sapienceLogoIcon.src,
        employmentType: "Full-time",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        duration: calculateDuration("Jun 2025", "Aug 2025"),
        location: "Naperville, Illinois",
        description: [
            "Interned at client, a $4 billion global digital automobile auction marketplace",
			"Automated auto title data pipelines with Python & SQL in Microsoft Azure, reducing preparation time by 90%, improving data reliability, scalability, and integrity. Leveraged Scrum development methodology",
			"Built Google Cloud Vertex AI prompts for title document parsing, improving data accuracy by 30%",
        ],
        skills: ["Google Cloud Platform", "Microsoft Azure", "Vertex AI", "Agile Project Management", "Prompt Engineering", "Python", "SQL"],
    },
    {
        id: "3",
        title: "VEX Software - AI & ML Research and Development",
        company: "Illini VEX Robotics",
        companyLogo: ivrLogoIcon.src,
        startDate: "Aug 2024",
        endDate: "May 2025",
        duration: calculateDuration("Aug 2024", "May 2025"),
        location: "Champaign, Illinois",
        description: [
            "Trained a Lunar Lander Reinforced Learning (RL) agent using Open AI Gym, Deep Q-Learning (DQN), and PyTorch for smooth landings",
			"Developed a custom Pong environment in Unity to train a Paddle RL agent to enable human vs AI gameplay",
			"Optimized reinforcement learning model training with reward functions and training policies, improving model efficiency and decision-making",
        ],
        skills: ["C#", "Unity", ".NET", "Python", "Artificial Intelligence (AI)", "Machine Learning"],
    },
    {
        id: "4",
        title: "Founder",
        company: "kidskoding.com",
        companyLogo: kidskodingLogoIcon.src,
        employmentType: "Part-time",
        startDate: "Sep 2018",
        endDate: "Aug 2023",
        duration: calculateDuration("Sep 2018", "Aug 2023"),
        locationType: "On-site",
        description: [
            "Founded and scaled an edtech platform teaching coding to 1,000+ students",
			"Produced 200+ videos and interactive lessons, simplifying complex programming concepts for beginners",
			"Built engaging learning experiences, fostering a global community of learners",
        ],
        skills: ["Astro", "Tailwind CSS", "Go", "MongoDB", "Node.js"],
    },
];
