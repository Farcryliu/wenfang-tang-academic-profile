import data from "./experience.json" with { type: "json" };

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

export type ExperienceData = {
  academicRoles: AcademicRole[];
  academicProjects: LeadershipRole[];
  editorialRoles: LeadershipRole[];
};

export const defaultExperience: ExperienceData = data;
