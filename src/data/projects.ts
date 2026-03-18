export interface Project {
    name: string;
    description: string;
    githubUrl: string;
    language?: string;
    tags?: string[];
}

export const featuredProjects: Project[] = [];

export const hackathons: Project[] = [];

export const aiAgents: Project[] = [];
