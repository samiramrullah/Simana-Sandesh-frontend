export interface Category {
  id: string;
  slug: string;
  name: string;
  color?: string;
  order?: number;
  showOnHome?: boolean;
  articleCount?: number;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

export interface MediaImage {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  publicId?: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: MediaImage }
  | { type: "list"; items: string[] };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: ContentBlock[];
  coverImage: MediaImage;
  category: Category;
  author: Author;
  tags: string[];
  location?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  views?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
}

export type ArticleSummary = Omit<Article, "content"> & { content?: ContentBlock[] };

export interface CategorySection {
  category: Category;
  articles: ArticleSummary[];
}

export interface HomepageData {
  breaking: ArticleSummary[];
  lead: ArticleSummary | null;
  secondary: ArticleSummary[];
  topStories: ArticleSummary[];
  trending: ArticleSummary[];
  opinion: ArticleSummary[];
  sections: CategorySection[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type Role = "admin" | "editor";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  bio: string;
  avatar: string;
  active: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AdminArticle extends Article {
  status: "draft" | "published";
  categoryId: string;
  createdAt?: string;
}

export interface AdminStats {
  published: number;
  drafts: number;
  categories: number;
  users: number;
  subscribers: number;
  views: number;
  recent: AdminArticle[];
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt?: string;
}
