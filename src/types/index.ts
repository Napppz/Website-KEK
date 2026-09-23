import type {
  User,
  KEK,
  News,
  NewsCategory,
  Document,
  Report,
  Gallery,
  Investment,
  Role,
  KekStatus,
  ContentStatus,
} from "@prisma/client";

export type {
  User,
  KEK,
  News,
  NewsCategory,
  Document,
  Report,
  Gallery,
  Investment,
  Role,
  KekStatus,
  ContentStatus,
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface KekWithInvestments extends KEK {
  investments: Investment[];
}

export interface NewsWithAuthorAndCategory extends News {
  author: {
    name: string;
    role: Role;
  };
  category: NewsCategory;
}
