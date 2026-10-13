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
