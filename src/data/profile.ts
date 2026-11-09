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
  officeAddress: [] as string[],
  universityProfile: "https://myweb.cuhk.edu.cn/tangwenfang/Home/Index",
  biography: [
    [
      {
        text: "Wenfang Tang is Presidential Chair Professor in the School of Humanities and Social Science at The Chinese University of Hong Kong, Shenzhen. His research focuses on public opinion, mass politics, and political culture in contemporary China. He holds a B.A. in Law from Peking University, an M.A. from the University of Kansas, and a Ph.D. in Political Science from the University of Chicago. He previously taught at the Hong Kong University of Science and Technology, the University of Iowa, and the University of Pittsburgh.",
      },
    ],
    [
      {
        text: "He has published nine books and 55 journal articles. His book ",
      },
      {
        text: "Populist Authoritarianism: Chinese Political Culture and Regime Sustainability",
        emphasis: true,
      },
      {
        text: " (Oxford University Press, 2016) received a CHOICE Outstanding Academic Title award. Oxford University Press released the print edition of his latest book, ",
      },
      {
        text: "Proud and Angry: Political Culture in Post-British Hong Kong",
        emphasis: true,
      },
      { text: ", co-authored with Ying Xia, in 2026. His articles have appeared in the " },
      { text: "American Journal of Political Science", emphasis: true },
      { text: ", " },
      { text: "Political Research Quarterly", emphasis: true },
      { text: ", " },
      { text: "Political Communication", emphasis: true },
      { text: ", and " },
      { text: "The China Quarterly", emphasis: true },
      { text: ", among others." },
    ],
    [
      { text: "Professor Tang serves as a Field Chief Editor of " },
      { text: "Frontiers in Political Science", emphasis: true },
      { text: " and sits on the editorial boards of " },
      { text: "Political Psychology", emphasis: true },
      { text: " and " },
      { text: "Advances in Political Psychology", emphasis: true },
      {
        text: ". From 2016 to 2025, he served on the executive committee of the International Political Science Association’s Research Committee on Comparative Public Opinion (RC17).",
      },
    ],
  ] satisfies BiographySegment[][],
};
