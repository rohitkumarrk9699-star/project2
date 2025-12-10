import { addHours, subHours } from "date-fns";

import imgInternational from "@assets/stock_images/international_news_g_a1f507eb.jpg";
import imgSports from "@assets/stock_images/sports_action_stadiu_4e52c5d5.jpg";
import imgTech from "@assets/stock_images/technology_futuristi_499af580.jpg";
import imgHealth from "@assets/stock_images/health_medical_welln_017ada52.jpg";
import imgScience from "@assets/stock_images/science_laboratory_r_99b960a9.jpg";

export type Category = "International" | "Sports" | "Technology" | "Health" | "Science";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  category: Category;
  timestamp: string;
}

const CATEGORIES: Category[] = ["International", "Sports", "Technology", "Health", "Science"];

const SAMPLE_TITLES: Record<Category, string[]> = {
  International: [
    "Global Summit Reaches Historic Agreement on Climate Action",
    "Diplomatic Talks Resume Amidst Rising Tensions in Eastern Europe",
    "Economic Forum Predicts Shift in Global Trade Patterns",
    "New Trade Deal Signed Between Major Asian Economies",
    "UN Security Council Holds Emergency Meeting",
    "International Aid Convoy Reaches Remote Regions",
    "Global Markets React to Central Bank Policy Changes",
    "Cross-Border Infrastructure Project Gets Green Light",
    "Election Results in Major European Power Surprise Analysts",
    "International Space Station Welcomes New Crew Members"
  ],
  Sports: [
    "Underdog Team Secures Championship in Stunning Upset",
    "Star Athlete Breaks Decade-Old World Record",
    "Olympic Committee Announces New Host City for 2032",
    "Premier League Transfer Window Closes with Record Spending",
    "Tennis Legend Announces Retirement After Illustrious Career",
    "NBA Finals: Game 7 Decides the Champion Tonight",
    "Formula 1 Introduces Radical New Car Regulations",
    "World Cup Qualifiers: National Team Secures Spot",
    "Marathon Winner Disqualified After Controversial Ruling",
    "Cricket World Cup: Hosts Eliminated in Group Stage"
  ],
  Technology: [
    "Breakthrough in Quantum Computing Achieved by Researchers",
    "New AI Model Surpasses Human Performance in Complex Tasks",
    "Major Tech Giant Unveils Revolutionary AR Glasses",
    "Cybersecurity Firm Warns of Sophisticated New Ransomware",
    "Electric Vehicle Sales Surpass Traditional Cars in Key Markets",
    "SpaceX Successfully Lands Starship After Orbital Flight",
    "New Battery Technology Promises Week-Long Phone Charge",
    "Blockchain Technology Adopted for National Voting System",
    "Social Media Platform Launches Decentralized Protocol",
    "5G Network Expansion Reaches 90% of Global Population"
  ],
  Health: [
    "New Vaccine Shows 99% Efficacy Against Tropical Disease",
    "Study Links Mediterranean Diet to Increased Longevity",
    "Global Health Organization Declares End of Pandemic Phase",
    "Breakthrough Treatment for Alzheimer's Shows Promise in Trials",
    "Mental Health App Usage Surges Among Young Adults",
    "New Guidelines Released for Daily Exercise Requirements",
    "Robotic Surgery Success Rates Improve Drastically",
    "Telemedicine Adoption Permanently Shifts Healthcare Delivery",
    "Nutritional Science: The Benefits of Plant-Based Proteins",
    "Sleep Study Reveals Impact of Blue Light on Circadian Rhythms"
  ],
  Science: [
    "NASA Telescope Captures Clearest Image of Distant Galaxy",
    "New Species of Marine Life Discovered in Deep Ocean Trench",
    "Archaeologists Unearth Ancient City Buried for Millennia",
    "Physics Experiment Confirms Existence of Theoretical Particle",
    "Climate Scientists Warn of Accelerating Ice Shelf Collapse",
    "Mars Rover Finds Definitive Evidence of Past Water Flow",
    "Gene Editing Technology Cures Genetic Blindness in Mice",
    "Astronomers Detect Radio Signal from Deep Space",
    "Study on Bee Populations Highlights Critical Ecosystem Role",
    "Fusion Energy Milestone: Net Energy Gain Achieved"
  ]
};

const SOURCES = ["The Global Times", "TechCrunch Daily", "Sports Illustrated", "Healthline Journal", "Science Daily", "Reuters", "Bloomberg", "The Verge", "ESPN", "Nature"];

const IMG_MAP: Record<Category, string> = {
  International: imgInternational,
  Sports: imgSports,
  Technology: imgTech,
  Health: imgHealth,
  Science: imgScience
};

export function generateArticles(countPerCategory: number = 20): Article[] {
  const articles: Article[] = [];
  let idCounter = 1;

  CATEGORIES.forEach(category => {
    for (let i = 0; i < countPerCategory; i++) {
      const titles = SAMPLE_TITLES[category];
      const title = titles[i % titles.length] + (i >= titles.length ? ` (Part ${Math.floor(i / titles.length) + 1})` : "");
      
      articles.push({
        id: `art-${idCounter++}`,
        title: title,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
        imageUrl: IMG_MAP[category],
        source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
        sourceUrl: "#",
        category: category,
        timestamp: subHours(new Date(), Math.floor(Math.random() * 48)).toISOString()
      });
    }
  });

  return articles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const fetchArticles = async (category?: Category): Promise<Article[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const allArticles = generateArticles();
  if (category) {
    return allArticles.filter(a => a.category === category);
  }
  return allArticles;
};
