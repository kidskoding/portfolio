import uiucLogoIcon from "../assets/illini-logo.png";

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
];
