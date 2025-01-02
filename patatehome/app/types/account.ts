export type Account = {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageUrl: string;
  features: string[] | string;
  status: string;
  createdAt: number;
  updatedAt: number;
};

export const accounts: Account[] = [
  {
    id: "1",
    category: "hdv17",
    hdv: 17,
    level: 300,
    price: 299.99,
    imageUrl: "/accounts/hdv17-max.jpg",
    additionalImages: [
      "/accounts/hdv17-max-2.jpg",
      "/accounts/hdv17-max-3.jpg",
      "/accounts/hdv17-max-4.jpg",
    ],
    features: ["HDV 17 Max", "Héros Max", "Murs Max"],
    tags: ["max", "premium", "hdv17"],
  },
  {
    id: "2",
    category: "hdv16",
    hdv: 16,
    level: 275,
    price: 199.99,
    imageUrl: "/accounts/hdv16-max.jpg",
    additionalImages: [
      "/accounts/hdv16-max-2.jpg",
      "/accounts/hdv16-max-3.jpg",
      "/accounts/hdv16-max-4.jpg",
    ],
    features: ["HDV 16 Max", "Héros Max", "Murs Max"],
    tags: ["max", "premium", "hdv16"],
  },
  {
    id: "3",
    category: "hdv15-",
    hdv: 15,
    level: 250,
    price: 149.99,
    imageUrl: "/accounts/hdv15-max.jpg",
    features: ["HDV 15 Max", "Héros Max", "Murs Max"],
    tags: ["max", "hdv15"],
  },
  {
    id: "4",
    category: "clans",
    level: 15,
    price: 399.99,
    imageUrl: "/accounts/clan-max.jpg",
    features: ["Niveau 15", "Capital Max", "50 membres actifs"],
    tags: ["clan", "max"],
  },
  {
    id: "5",
    category: "brawlstars",
    level: 300,
    price: 199.99,
    imageUrl: "/accounts/brawl-max.jpg",
    features: ["Tous les Brawlers", "Niveau Power 11", "Tous les Gadgets"],
    tags: ["brawlstars", "max"],
  },
];

export const getFeaturedAccounts = () => accounts.slice(0, 3);
