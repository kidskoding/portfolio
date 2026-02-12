export interface Experience {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    employmentType: string;
    startDate: string;
    endDate: string;
    duration: string;
    location: string;
    locationType: string;
    description: string[];
    skills: string[];
}

export const experiences: Experience[] = [
    {
        id: "1",
        title: "Senior Software Engineer",
        company: "Google",
        companyLogo: "https://logo.clearbit.com/google.com",
        employmentType: "Full-time",
        startDate: "Jan 2023",
        endDate: "Present",
        duration: "2 yrs 1 mo",
        location: "Mountain View, California",
        locationType: "Hybrid",
        description: [
            "Led the development of a real-time data pipeline processing 10M+ events/day using Go and Apache Kafka, reducing latency by 40%.",
            "Architected and shipped a new microservices platform serving 50M+ users, improving system reliability to 99.99% uptime.",
            "Mentored 4 junior engineers and led weekly code review sessions across the team.",
        ],
        skills: ["Go", "Kubernetes", "Apache Kafka", "gRPC", "Google Cloud Platform"],
    },
    {
        id: "2",
        title: "Software Engineer",
        company: "Meta",
        companyLogo: "https://logo.clearbit.com/meta.com",
        employmentType: "Full-time",
        startDate: "Jun 2021",
        endDate: "Dec 2022",
        duration: "1 yr 7 mos",
        location: "Menlo Park, California",
        locationType: "Remote",
        description: [
            "Built and optimized React-based UI components used by 2B+ monthly active users on the Facebook News Feed.",
            "Developed a GraphQL API layer that reduced frontend data fetching overhead by 35%.",
            "Collaborated with the design team to implement an accessible component library following WCAG 2.1 guidelines.",
        ],
        skills: ["React", "TypeScript", "GraphQL", "Relay", "Jest"],
    },
    {
        id: "3",
        title: "Software Engineering Intern",
        company: "Stripe",
        companyLogo: "https://logo.clearbit.com/stripe.com",
        employmentType: "Internship",
        startDate: "May 2020",
        endDate: "Aug 2020",
        duration: "4 mos",
        location: "San Francisco, California",
        locationType: "On-site",
        description: [
            "Designed and implemented an internal dashboard for monitoring payment processing metrics in real time.",
            "Reduced API response times by 25% through query optimization and caching strategies using Redis.",
        ],
        skills: ["Ruby", "Python", "PostgreSQL", "Redis", "AWS"],
    },
    {
        id: "4",
        title: "Undergraduate Research Assistant",
        company: "MIT CSAIL",
        companyLogo: "https://logo.clearbit.com/mit.edu",
        employmentType: "Part-time",
        startDate: "Sep 2019",
        endDate: "May 2020",
        duration: "9 mos",
        location: "Cambridge, Massachusetts",
        locationType: "On-site",
        description: [
            "Conducted research on distributed systems consensus algorithms, contributing to a published paper at SOSP 2020.",
            "Built simulation tools in Python to model network partitions and Byzantine fault scenarios.",
        ],
        skills: ["Python", "Distributed Systems", "LaTeX", "C++"],
    },
];
