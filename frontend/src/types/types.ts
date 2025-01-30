import { DateRange } from "react-day-picker";

export type User = {
  id: number;
  name: string;
  email: string;
  personalized_news: boolean;
  categories: string[];
  sources: string[];
  authors: string[];
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null | ((prevUser: User | null) => User | null)) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
};

export type ArticleType = {
  id: number;
  title: string;
  content: string;
  published_at: string;
  source: {
    id: number;
    name: string;
  };
};

export type CategoryType = {
  id: number;
  name: string;
};

export type SourceType = {
  id: number;
  name: string;
};

export type AuthorType = {
  id: number;
  name: string;
};

export type ProfileType = {
  full_name?: string;
  email?: string;
  personalized_news: boolean;
  categories?: string[];
  sources?: string[];
  authors?: string[];
};

export type ArticlePropsType = {
  id: number;
  title: string;
  content: string;
  published_at: string;
  source: string;
};

export type DateRangePickerProps = {
  selectedRange: DateRange;
  onChange: (range: DateRange) => void;
  placeholderText?: string;
};

export type FilterType = {
  keyword: string;
  category: string[];
  source: string[];
  author: string[];
  start_date: string | null;
  end_date: string | null;
};
