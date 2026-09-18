export type Category = string;

export interface CategoryDefinition {
  label: string;
  value: string;
  description?: string;
}

export interface LeakedDocument {
  title: string;
  source: string;
  date: string;
  excerpt: string;
  classification: string;
}

export interface ArticleSection {
  title?: string;
  paragraphs: string[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  highlightBox?: {
    title: string;
    content: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  chapeau: string;
  category: Category;
  categoryTag: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  heroImage: string;
  heroImageCaption: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  investigationDays: number;
  leakedDocumentsCount: number;
  audioDuration: string;
  keyRevelations: string[];
  sections: ArticleSection[];
  documentEvidence?: LeakedDocument;
  sourcesCount: number;
  verifiedFactChecks: number;
}

export interface BookmarkItem {
  articleId: string;
  savedAt: string;
}

export interface Journalist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  specialties: string[];
  email?: string;
  pgpFingerprint?: string;
  signalPhone?: string;
  joinedYear?: string;
}
