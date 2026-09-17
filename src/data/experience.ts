export type AcademicRole = {
  period: string;
  title: string;
  organization: string;
};

export type LeadershipRole = {
  role: string;
  title: string;
  organization?: string;
};

export const academicRoles: AcademicRole[] = [
  {
    period: "Present",
    title: "Dean, School of Humanities and Social Science",
    organization: "The Chinese University of Hong Kong, Shenzhen",
  },
  {
    period: "2019—2022",
    title: "Head and Chair Professor",
    organization: "Division of Social Science, Hong Kong University of Science and Technology",
  },
  {
    period: "2009—2019",
    title: "Chair, Department of Political Science",
    organization: "University of Iowa",
  },
  {
    period: "1990—2009",
    title: "Assistant, Associate and Full Professor",
    organization: "Department of Political Science, University of Pittsburgh",
  },
];

export const academicProjects: LeadershipRole[] = [
  {
    role: "Leading role",
    title: "World Values Survey",
    organization: "Sixth and seventh waves",
  },
  {
    role: "Academic Advisory Committee",
    title: "Chinese Family Panel Survey (CFPS)",
    organization: "Peking University",
  },
  {
    role: "Academic Advisory Committee",
    title: "Chinese General Social Survey (CGSS)",
    organization: "Renmin University of China",
  },
  {
    role: "Academic Advisory Committee",
    title: "Chinese Labor Dynamics Survey (CLDS)",
    organization: "Sun Yat-sen University",
  },
];

export const editorialRoles: LeadershipRole[] = [
  {
    role: "Since June 2025",
    title: "Field Chief Editor",
    organization: "Frontiers in Political Science",
  },
  {
    role: "Since June 2021",
    title: "Specialty Chief Editor for Comparative Governance",
    organization: "Frontiers in Political Science",
  },
  {
    role: "Editorial Board Member",
    title: "Political Psychology",
  },
  {
    role: "Editorial Board Member",
    title: "Advances in Political Psychology",
  },
  {
    role: "2016—2025",
    title: "Executive Committee Member",
    organization:
      "RC17 — Comparative Public Opinion, International Political Science Association",
  },
];
