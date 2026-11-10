import { biography } from "./biography.json";

export const profile = {
  name: "Wenfang Tang",
  nameChinese: "唐文方",
  portrait: "assets/tang-wenfang.jpg",
  portraitAlt: "Portrait of Professor Wenfang Tang",
  discipline: "Professor of Political Science",
  institution: "The Chinese University of Hong Kong, Shenzhen",
  roleLines: [
    "Presidential Chair Professor",
    "Dean, School of Humanities and Social Science",
  ],
  email: "tangwenfang@cuhk.edu.cn",
  officeAddress: [] as string[],
  universityProfile: "https://myweb.cuhk.edu.cn/tangwenfang/Home/Index",
  biography: biography
    .split(/\r?\n(?:[ \t]*\r?\n)+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
};
