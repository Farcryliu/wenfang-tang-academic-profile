export type BiographySegment = {
  text: string;
  emphasis?: boolean;
};

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
  universityProfile: "https://myweb.cuhk.edu.cn/tangwenfang/Home/Index",
  biography: [
    [
      {
        text: "Wenfang Tang is Presidential Chair Professor in the School of Humanities and Social Science at The Chinese University of Hong Kong, Shenzhen. His current research focuses on public opinion, mass politics, and political culture in contemporary China.",
      },
    ],
    [
      {
        text: "He has authored and co-authored books published by Oxford University Press, Cambridge University Press, Stanford University Press, and the University of Pittsburgh Press. His articles have appeared in ",
      },
      {
        text: "American Journal of Political Science, Political Research Quarterly, Political Communication, Journal of Public Policy, The China Quarterly, and Journal of Contemporary China",
        emphasis: true,
      },
      { text: ", among others. His book " },
      {
        text: "Populist Authoritarianism: Chinese Political Culture and Regime Sustainability",
        emphasis: true,
      },
      {
        text: " (Oxford University Press, 2016) received the CHOICE Outstanding Academic Title Award.",
      },
    ],
    [
      {
        text: "Professor Tang received his B.A. in Law from Peking University, M.A. from the University of Kansas, and Ph.D. in Political Science from the University of Chicago. He previously served at the Hong Kong University of Science and Technology (2019–2022), the University of Iowa (2009–2019), and the University of Pittsburgh (1990–2009), and has held visiting appointments at several universities and research institutions.",
      },
    ],
    [
      { text: "He is currently the Field Chief Editor of " },
      {
        text: "Frontiers in Political Science",
        emphasis: true,
      },
      {
        text: " (since June 2025) and the Specialty Chief Editor for Comparative Governance at ",
      },
      {
        text: "Frontiers in Political Science",
        emphasis: true,
      },
      {
        text: " (since June 2021). He also serves as an editorial board member of ",
      },
      { text: "Political Psychology", emphasis: true },
      { text: " and " },
      { text: "Advances in Political Psychology", emphasis: true },
      {
        text: ", and as an Executive Committee member of RC17 \u2013 Comparative Public Opinion, International Political Science Association (2016\u20132025).",
      },
    ],
  ] satisfies BiographySegment[][],
};
