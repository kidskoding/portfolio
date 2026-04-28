import uiucLogoIcon from "../assets/illini-logo.png";
import codepathLogoIcon from "../assets/codepath-logo.png";

export interface Education {
    id: string;
    institution: string;
    institutionLogo: string;
    degree: string;
    field: string;
    location?: string;
    startDate?: string;
    endDate: string;
    description?: string[];
}

export const educations: Education[] = [
    {
        id: "1",
        institution: "University of Illinois Urbana-Champaign",
        institutionLogo: uiucLogoIcon.src,
        degree: "Bachelor of Science",
        field: "Computer Science and Education, concentrated in Learning Sciences and Learning Technologies",
        endDate: "May 2027",
        description: [],
    },
    {
        id: "2",
        institution: "CodePath",
        institutionLogo: codepathLogoIcon.src,
        degree: "Technical Interview Prep",
        field: "Data Structures & Algorithms",
        startDate: "Apr 2026",
        endDate: "Aug 2026",
        description: [
            "writing optimal solutions and analyzing time and space complexity for programming problems using data structures and algorithms",
        ],
    },
];
