export type CitationSegment = {
  text: string;
  italic?: boolean;
  href?: string;
};

export type Publication = {
  id: string;
  citation: CitationSegment[];
  preview?: {
    type: "Book" | "Article";
    title: string;
    href: string;
    image: string;
    imageAlt: string;
    abstract: string;
  };
};

const text = (value: string): CitationSegment => ({ text: value });
const italic = (value: string): CitationSegment => ({ text: value, italic: true });
const link = (value: string): CitationSegment => ({ text: value, href: value });

export const selectedPublications: Publication[] = [
  {
    id: "tang-xia-2026",
    citation: [
      text("Tang, W., & Xia, Y. (2026). "),
      italic("Proud and angry: Political culture in post-British Hong Kong"),
      text(". Oxford University Press."),
    ],
    preview: {
      type: "Book",
      title: "Proud and Angry: Political Culture in Post-British Hong Kong",
      href: "https://doi.org/10.1093/9780197831588.001.0001",
      image: "assets/publications/proud-and-angry-cover.jpg",
      imageAlt: "Cover of Proud and Angry",
      abstract:
        "This book addresses the question of what drove 2 million Hongkongers to the streets in 2019 in the largest protest in this postcolonial society. It answers this question by examining Hong Kong’s unique postcolonial political culture where the former colonists left but the succeeding power was unable to establish itself under the institutional design of One Country, Two Systems. In this political vacuum, local Hongkongers desperately searched for a new political identity rooted in its traditional culture; they felt angry about being abandoned by the British but were too proud to be associated with the Chinese Mainlanders who were perceived as newly rich but unsophisticated. They accepted Chinese sovereignty in Hong Kong but resisted being integrated into the Chinese state. They demonstrated a strong populist tendency to protest on the streets even after the passage of the Hong Kong National Security Law. This study draws solid empirical evidence from a territory-wide public opinion survey. Through multiple embedded survey experiments and an innovative statistical weighting technique, this study could detect a large amount of public resistance to the Chinese state that was otherwise hidden due to the respondents’ fear of political retribution. In addition to improving public opinion survey methodology, this study contributes to the political culture literature by presenting a distinctive transitional postcolonial culture that follows neither the colonial mentality nor the will of the new ruler.",
    },
  },
  {
    id: "he-tang-2024",
    citation: [
      text("He, D., & Tang, W. (2024). Constructed community: Rise and engines of Chinese nationalism under Xi Jinping. "),
      italic("Journal of Contemporary China"),
      text(", 1\u201323. "),
      link("https://doi.org/10.1080/10670564.2024.2339303"),
    ],
    preview: {
      type: "Article",
      title: "Constructed Community: Rise and Engines of Chinese Nationalism under Xi Jinping",
      href: "https://doi.org/10.1080/10670564.2024.2339303",
      image: "assets/publications/constructed-community-page.jpg",
      imageAlt: "First page of Constructed Community",
      abstract:
        "The Chinese state-sponsored campaign for nationalism has intensified since the last decade. This article is an empirical study focusing on Chinese mass nationalism in the same period. Drawing data from the World Values Surveys, it finds that mass nationalism significantly increased from 2012/13 to 2018, ranked second with a growth rate of 13.7% among 27 selected countries and regions. The origin of this remarkable rise of mass nationalism is rooted in elite construction. The findings suggest that constructivism is the most potent theory to explain nationalism during Xi’s presidency. The intensification of mass nationalism in China will continue as long as the construction of state nationalism is maintained. One backlash against this trend may come from social media.",
    },
  },
  {
    id: "tang-zhang-2023",
    citation: [
      text("Tang, W., & Zhang, Y. (2023). Revolution derailed: The struggle for internet control and media freedom in China. "),
      italic("Asian Politics & Policy, 15"),
      text("(4), 563\u2013584. "),
      link("https://doi.org/10.1111/aspp.12721"),
    ],
    preview: {
      type: "Article",
      title: "Revolution Derailed: The Struggle for Internet Control and Media Freedom in China",
      href: "https://doi.org/10.1111/aspp.12721",
      image: "assets/publications/revolution-derailed-page.jpg",
      imageAlt: "First page of Revolution Derailed",
      abstract:
        "Drawing on data from the 2018 China Internet Survey, this article analyzes the channels through which Chinese citizens acquire political information and how such information changes people’s political attitude and behavior. It finds that while many people particularly among the younger generations are using social media, an equally large number of people continue to rely on the officially controlled TV news for political and social information. As hoped by those who want to bring down the authoritarian regime through social media, the Internet contributes to questioning the government and developing liberal ideas among its users but fails to promote bottom-up political participation. Interestingly, government-controlled TV programming meets its goals of improving regime support as well as mobilizing mass political participation. The authoritarian government also seems effective in pushing social media into its orbit of political control. These findings suggest that techno-Utopianism exaggerated the role of technology in liberal democratization.",
    },
  },
  {
    id: "tang-hu-2023",
    citation: [
      text("Tang, W., & Hu, Y. (2023). Detecting grassroots bribery in an authoritarian society: A survey experimental approach. "),
      italic("Journal of Contemporary China, 32"),
      text("(140), 207\u2013224. "),
      link("https://doi.org/10.1080/10670564.2022.2071883"),
    ],
    preview: {
      type: "Article",
      title: "Detecting Grassroots Bribery and Its Sources in China: A Survey Experimental Approach",
      href: "https://doi.org/10.1080/10670564.2022.2071883",
      image: "assets/publications/detecting-bribery-page.jpg",
      imageAlt: "First page of Detecting Grassroots Bribery and Its Sources in China",
      abstract:
        "Drawing data from a national survey, this study relies on several embedded list experiments to examine the grassroots bribery that the survey respondents tried to hide due to social desirability. The findings from the list experiments are extracted to develop an innovative weighting technique to provide accurate estimations of bribery behavior. It finds that the level of grassroots bribery in public sectors is significantly higher than what people would admit; that the reasons for bribery can be traced to the country’s public service distribution, the low risk of practicing bribery, and the rapid increase in disposable income. These findings suggest that grassroots bribery is still a serious issue in Chinese society, and it creates new challenges for effective governance during the country’s anti-corruption campaign.",
    },
  },
  {
    id: "tang-2016-selected",
    citation: [
      text("Tang, W. (2016). "),
      italic("Populist authoritarianism: Chinese political culture and regime sustainability"),
      text(". Oxford University Press."),
    ],
    preview: {
      type: "Book",
      title: "Populist Authoritarianism: Chinese Political Culture and Regime Sustainability",
      href: "https://doi.org/10.1093/acprof:oso/9780190205782.001.0001",
      image: "assets/publications/populist-authoritarianism-cover.jpg",
      imageAlt: "Cover of Populist Authoritarianism",
      abstract:
        "This book is about how the Chinese Communist Party (CCP) governs the world’s largest population in a single-party authoritarian state. It attempts to explain the seemingly contradictory trends of the increasing number of protests, on the one hand, and the results of public opinion surveys that consistently show strong government support on the other hand. It accentuates the continuity of the political culture from the CCP’s revolutionary experiences to its present-day governing style, even though China has changed in many ways on the surface in the post-Mao era. The book proposes a theoretical framework of populist authoritarianism with six key elements, including the Mass Line ideology, accumulation of social capital, public political activism and contentious politics, a hyper-responsive government, weak political and civil institutions, and a high level of political trust. These traits of populist authoritarianism are supported by empirical evidence drawn from multiple public opinion surveys conducted from 1987 to 2014. Although the CCP currently enjoys strong public support, such a system is inherently vulnerable due to its institutional deficiency. Public opinion can swing violently due to policy failure and the up and down of a leader or an elite faction. The drastic change of public opinion cannot be filtered through political institutions such as elections and the rule of law, creating system-wide political earthquakes.",
    },
  },
];

export const booksAndEditedVolumes: Publication[] = [
  {
    id: "tang-2022-russian",
    citation: [
      text("Tang, W. (2022). "),
      italic("Популистский авторитаризм: Китайская политическая культура и устойчивость режима"),
      text(" [Populist authoritarianism: Chinese political culture and regime sustainability]. Academic Studies Press."),
    ],
  },
  {
    id: "tang-2016",
    citation: [
      text("Tang, W. (2016). "),
      italic("Populist authoritarianism: Chinese political culture and regime sustainability"),
      text(". Oxford University Press."),
    ],
  },
  {
    id: "tang-iyengar-2012",
    citation: [
      text("Tang, W., & Iyengar, S. (Eds.). (2012). "),
      italic("Political communication in China: Convergence or divergence between the media and political system in China"),
      text(". Routledge."),
    ],
  },
  {
    id: "tang-he-2010",
    citation: [
      text("Tang, W., & He, G. (2010). "),
      italic("Separate but loyal: Ethnicity and nationalism in China"),
      text(". East-West Center."),
    ],
  },
  {
    id: "tang-2008",
    citation: [
      text("Tang, W. (2008). "),
      italic("中国民意与公民社会 [Public opinion and civil society]"),
      text(". Sun Yat-sen University Press."),
    ],
  },
  {
    id: "tang-holzner-2007",
    citation: [
      text("Tang, W., & Holzner, B. (Eds.). (2007). "),
      italic("Social and political change in contemporary China: C. K. Yang and the concept of institutional diffusion"),
      text(". University of Pittsburgh Press."),
    ],
  },
  {
    id: "tang-ed-2007",
    citation: [
      text("Tang, W. (Ed.). (2007). "),
      italic("Pitt in China: A cultural perspective by American college students"),
      text(". China Intercontinental Press."),
    ],
  },
  {
    id: "tang-2005",
    citation: [
      text("Tang, W. (2005). "),
      italic("Public opinion and political change in China"),
      text(". Stanford University Press."),
    ],
  },
  {
    id: "tang-parish-2000",
    citation: [
      text("Tang, W., & Parish, W. L. (2000). "),
      italic("Chinese urban life under market reform: The changing social contract"),
      text(". Cambridge University Press."),
    ],
  },
  {
    id: "tang-1999",
    citation: [
      text("Tang, W. (1999). "),
      italic("Party intellectuals' demand for reform in contemporary China"),
      text(". Hoover Institution."),
    ],
  },
  {
    id: "tang-1996-book",
    citation: [
      text("Tang, W. (1996). "),
      italic("谁来做主？中国当代企业决策 [Who should rule? Enterprise decision making in contemporary China]"),
      text(". Oxford University Press."),
    ],
  },
];

export const articlesAndChapters: Publication[] = [
  {
    id: "tang-2024-chapter",
    citation: [
      text("Tang, W. (2024). Democratic authoritarianism: A study of Chinese political orientations. In Y. Zhong & R. Inglehart (Eds.), "),
      italic("China as number 1? Merging values of a rising power"),
      text(" (pp. 28\u201352). University of Michigan Press."),
    ],
  },
  {
    id: "tang-2022-propatainment",
    citation: [
      text("Tang, W. (2022). Propatainment: Party history education in China. In A. S. Bell (Ed.), "),
      italic("Party Watch annual report 2021"),
      text(". Center for Advanced China Research."),
    ],
  },
  {
    id: "zhang-tang-2022",
    citation: [
      text("Zhang, Y., & Tang, W. (2022). 中国青年眼中的中国共产党：文化与制度的两重逻辑 [Sources of popular political trust of the Chinese Communist Party]. "),
      italic("经济社会体制比较"),
      text("(1), 158\u2013170."),
    ],
  },
  {
    id: "pizzi-tang-2021",
    citation: [
      text("Pizzi, E., & Tang, W. (2021). Managed mobilization: Ethnic identity and political participation in China. "),
      italic("Nationalism and Ethnic Politics, 27"),
      text("(4), 456\u2013477."),
    ],
  },
  {
    id: "tang-2021-review",
    citation: [
      text("Tang, W. (2021). Understanding authoritarianism: Review essay. "),
      italic("American Affairs"),
      text(", 139\u2013153."),
    ],
  },
  {
    id: "tang-2020-reviewing",
    citation: [
      text("Tang, W. (2020). Publishing high-quality quantitative social science research papers: A reviewer's reflections [定量政治学论文审稿笔记]. "),
      italic("中国政治学"),
      text(", 86\u201399."),
    ],
  },
  {
    id: "tang-lin-2020",
    citation: [
      text("Tang, W., & Lin, J. (2020). The CPC as a populist authoritarian party: An impressionable years analysis. "),
      italic("China: An International Journal, 18"),
      text("(1), 26\u201346."),
    ],
  },
  {
    id: "liu-tang-2020",
    citation: [
      text("Liu, X., & Tang, W. (2020). Sexism in Taiwan and mainland China: A social experimental study. "),
      italic("China: An International Journal"),
      text("."),
    ],
  },
  {
    id: "zhou-tang-lei-2019",
    citation: [
      text("Zhou, Y. J., Tang, W., & Lei, X. (2019). Social desirability of dissent: An IAT experiment with Chinese university students. "),
      italic("Journal of Chinese Political Science"),
      text(", 1\u201326."),
    ],
  },
  {
    id: "tang-2018",
    citation: [
      text("Tang, W. (2018). The 'surprise' of authoritarian resilience in China. "),
      italic("American Affairs"),
      text(", 101\u2013117."),
    ],
  },
  {
    id: "tang-2017-measuring",
    citation: [
      text("Tang, W. (2017). "),
      italic("如何测量中国民主：关于民主与政治幸福感的讨论 [Measuring democracy in China: A discussion on democracy and political happiness]"),
      text(" (Issue 1, No. 10). National Academy of Development and Strategy, Renmin University of China."),
    ],
  },
  {
    id: "tang-zhang-martin-2017",
    citation: [
      text("Tang, W., Zhang, Y., & Martin, S. (2017). Revolution postponed: The limitation of the internet in promoting democracy in China. In W. Shan & L. Yang (Eds.), "),
      italic("The rising civil society and state-society relations in China"),
      text(". World Scientific."),
    ],
  },
  {
    id: "tang-2017-same-bed",
    citation: [
      text("Tang, W. (2017). Same bed, different dreams: The bifurcation of the Chinese Communist Party. In W. Shan & L. Yang (Eds.), "),
      italic("The rising civil society and state-society relations in China"),
      text(". World Scientific."),
    ],
  },
  {
    id: "tang-hu-jin-2016",
    citation: [
      text("Tang, W., Hu, Y., & Jin, S. (2016). Affirmative inaction: Education, language proficiency, and socioeconomic attainment among China's Uyghur minority. "),
      italic("Chinese Sociological Review, 48"),
      text("(4), 1\u201322."),
    ],
  },
  {
    id: "tang-2015-big-data",
    citation: [
      text("Tang, W. (2015). Big data and small data. "),
      italic("Journal of Sun Yat-sen University (Social Science Edition), 55"),
      text("(6), 141\u2013146."),
    ],
  },
  {
    id: "tang-yu-2015",
    citation: [
      text("Tang, W., & Yu, D. E. (2015). Public policy satisfaction in urban China. "),
      italic("East Asian Policy, 7"),
      text("(2), 63\u201377."),
    ],
  },
  {
    id: "tang-2014-religiosity",
    citation: [
      text("Tang, W. (2014). The worshipping atheist: Institutional and diffused religiosities in China. "),
      italic("China: An International Journal, 12"),
      text("(3), 1\u201326."),
    ],
  },
  {
    id: "tang-2014-report",
    citation: [
      text("Tang, W. (2014). "),
      italic("Public policy satisfaction in urban China: A survey report"),
      text(". Institute of Public Policy, South China University of Technology."),
    ],
  },
  {
    id: "lewis-beck-tang-martini-2014",
    citation: [
      text("Lewis-Beck, M. S., Tang, W., & Martini, N. F. (2014). A Chinese popularity function: Sources of government support. "),
      italic("Political Research Quarterly, 67"),
      text("(1), 16\u201325."),
    ],
  },
  {
    id: "tang-2013",
    citation: [
      text("Tang, W. (2013). 政治信任度之比较研究 [A comparative analysis of political trust]. "),
      italic("国外理论动态"),
      text(", 66\u201381."),
    ],
  },
  {
    id: "tang-darr-2012",
    citation: [
      text("Tang, W., & Darr, B. (2012). Chinese nationalism and its political and social origins. "),
      italic("Journal of Contemporary China, 21"),
      text("(77), 811\u2013826."),
    ],
  },
  {
    id: "tang-2012-ccp",
    citation: [
      text("Tang, W. (2012). 中共党员群体特征及政治态度之分析 [Chinese Communist Party members in transition]. "),
      italic("中国治理评论, 1"),
      text("(1)."),
    ],
  },
  {
    id: "yang-tang-2010",
    citation: [
      text("Yang, Q., & Tang, W. (2010). Exploring the sources of institutional trust in China: Culture, mobilization, or performance? "),
      italic("Asian Politics & Policy, 2"),
      text("(3), 415\u2013436."),
    ],
  },
  {
    id: "tang-2009",
    citation: [
      text("Tang, W. (2009). Dispute resolution and legal reform in China. "),
      italic("China Review, 9"),
      text("(1), 73\u201396."),
    ],
  },
  {
    id: "tang-yang-2008",
    citation: [
      text("Tang, W., & Yang, Q. (2008). The Chinese urban caste system in transition. "),
      italic("The China Quarterly, 196"),
      text(", 759\u2013779."),
    ],
  },
  {
    id: "tang-2001-religion",
    citation: [
      text("Tang, W. (2001). Religion and society in Taiwan and China: Evidence from survey data. In S. Hua (Ed.), "),
      italic("Politics and political culture in contemporary China"),
      text(". M. E. Sharpe."),
    ],
  },
  {
    id: "tang-2001-trends",
    citation: [
      text("Tang, W. (2001). Political and social trends in post-Deng urban China: Crisis or stability? "),
      italic("The China Quarterly, 168"),
      text(", 890\u2013909."),
    ],
  },
  {
    id: "tang-parish-1996",
    citation: [
      text("Tang, W., & Parish, W. L. (1996). Social reaction to urban reform in China. "),
      italic("Problems of Post-Communism"),
      text("."),
    ],
  },
  {
    id: "tang-1993-workplace",
    citation: [
      text("Tang, W. (1993). Workplace participation in Chinese local industrial enterprises. "),
      italic("American Journal of Political Science, 37"),
      text("(3), 920\u2013940."),
    ],
  },
  {
    id: "tang-1993-environment",
    citation: [
      text("Tang, W. (1993). Post-socialist transition and the environment. "),
      italic("Journal of Public Policy, 13"),
      text(", 89\u2013109."),
    ],
  },
];
