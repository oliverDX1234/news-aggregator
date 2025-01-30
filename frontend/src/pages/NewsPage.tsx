import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/custom/multi-select";
import DateRangePicker from "@/components/custom/date-picker";
import Pagination from "@/components/custom/pagination";
import Article from "@/components/articles/Article";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ChevronDown, FilterIcon, XIcon } from "lucide-react";

import axios from "@/api/axios";
import { fetchAuthors, fetchCategories, fetchSources } from "@/api/filtersApi";

import { format } from "date-fns";
import { Card } from "@/components/ui/card";

import {
  ArticleType,
  AuthorType,
  CategoryType,
  SourceType,
} from "@/types/types";

import Cookies from "js-cookie";

import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const HIDE_ALERT_COOKIE =
  import.meta.env.VITE_HIDE_ALERT_COOKIE || "hide_profile_alert";

const filterSchema = z.object({
  keyword: z.string().optional(),
  categories: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  dateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const NewsPage = () => {
  const { user } = useAuth();

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [sources, setSources] = useState<SourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showProfileAlert, setShowProfileAlert] = useState(true);
  const [skipFetch, setSkipFetch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      keyword: searchParams.get("keyword") || "",
      categories: searchParams.getAll("categories"),
      sources: searchParams.getAll("sources"),
      authors: searchParams.getAll("authors"),
      dateRange: {
        from: searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : null,
        to: searchParams.get("to") ? new Date(searchParams.get("to")!) : null,
      },
    },
  });

  const fetchArticles = async (page = 1, filters = {}) => {
    setLoading(true);
    setSkipFetch(true);

    if (user?.personalized_news && !skipFetch) {
      return;
    }

    try {
      const response = await axios.get(`/api/articles`, {
        params: { ...filters, page },
      });

      setArticles(response.data.data);
      setTotalPages(response.data.last_page);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesData, sourcesData, authorsData] = await Promise.all([
        fetchCategories(),
        fetchSources(),
        fetchAuthors(),
      ]);
      setCategories(categoriesData);
      setSources(sourcesData);
      setAuthors(authorsData);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const updatePersonalizedData = async () => {
    if (user && user.personalized_news) {
      form.reset({
        ...form.getValues(),
        categories: user!.categories,
        sources: user!.sources,
        authors: user!.authors,
      });
    }
  };

  const handlePagination = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", (page + 1).toString());
      return newParams;
    });
  };

  const watchedFields = useWatch({
    control: form.control,
  });

  const [debouncedWatchedFields] = useDebounce(watchedFields, 500);

  useEffect(() => {
    const filters = {
      keyword: debouncedWatchedFields.keyword,
      categories: debouncedWatchedFields.categories,
      sources: debouncedWatchedFields.sources,
      authors: debouncedWatchedFields.authors,
      start_date: debouncedWatchedFields.dateRange?.from
        ? format(debouncedWatchedFields.dateRange.from, "yyyy-MM-dd")
        : null,
      end_date: debouncedWatchedFields.dateRange?.to
        ? format(debouncedWatchedFields.dateRange.to, "yyyy-MM-dd")
        : null,
    };

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (filters.keyword) {
        newParams.set("keyword", filters.keyword);
      } else {
        newParams.delete("keyword");
      }
      newParams.delete("categories");
      filters.categories?.forEach((cat: string) =>
        newParams.append("categories", cat)
      );

      newParams.delete("sources");
      filters.sources?.forEach((src: string) =>
        newParams.append("sources", src)
      );

      newParams.delete("authors");
      filters.authors?.forEach((aut: string) =>
        newParams.append("authors", aut)
      );

      if (filters.start_date) {
        newParams.set("from", filters.start_date);
      } else {
        newParams.delete("from");
      }
      if (filters.end_date) {
        newParams.set("to", filters.end_date);
      } else {
        newParams.delete("to");
      }
      return newParams;
    });

    fetchArticles(currentPage, filters);
  }, [debouncedWatchedFields, currentPage]);

  useEffect(() => {
    fetchFilters();
    updatePersonalizedData();

    const hideAlertCookie = Cookies.get(HIDE_ALERT_COOKIE);
    if (hideAlertCookie) {
      setShowProfileAlert(false);
    }
  }, []);

  const hideProfileAlert = () => {
    setShowProfileAlert(false);

    Cookies.set(HIDE_ALERT_COOKIE, "true", { expires: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 px-4 py-6 md:p-6">
      {showProfileAlert && user && (
        <Alert variant="info" className="mb-4 relative">
          <AlertTitle>Personalize your news feed</AlertTitle>
          <AlertDescription>
            Visit your{" "}
            <Link
              className="font-bold"
              to={{
                pathname: "/profile",
              }}
            >
              profile page
            </Link>{" "}
            to customize your news feed based on your interests.
          </AlertDescription>

          <div
            onClick={hideProfileAlert}
            className="absolute right-[8px] top-[8px] cursor-pointer"
          >
            <XIcon className="h-4 w-4" />
          </div>
        </Alert>
      )}

      <Card className="w-full shadow-soft-xl">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">News</h1>

        <Separator />

        <Button
          variant="outline"
          className="flex w-full items-center gap-2 mt-4 mb-4 md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="w-5 h-5" />
          Filters
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </Button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          } md:max-h-full md:opacity-100`}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 mb-6 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] w-full gap-3 sm:col-span-2">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-black">
                        Search keyword
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black w-full"
                          placeholder="Search by keyword"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="md:max-w-[200px]">
                      <FormLabel className="text-black">Date Range</FormLabel>
                      <FormControl>
                        <DateRangePicker
                          selectedRange={{
                            from: field.value?.from || undefined,
                            to: field.value?.to || undefined,
                          }}
                          onChange={field.onChange}
                          placeholderText="Select date range"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:col-span-2 w-full">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          key={categories.length}
                          options={categories.map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                          }))}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          placeholder="Select categories"
                          variant="default"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Sources</FormLabel>
                      <FormControl>
                        <MultiSelect
                          key={sources.length}
                          options={sources.map((source) => ({
                            value: source.id.toString(),
                            label: source.name,
                          }))}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          placeholder="Select sources"
                          variant="default"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Authors</FormLabel>
                      <FormControl>
                        <MultiSelect
                          key={authors.length}
                          options={authors.map((author) => ({
                            value: author.id.toString(),
                            label: author.name,
                          }))}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          placeholder="Select authors"
                          variant="default"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading || !skipFetch ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 shadow-lg">
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-4 mb-4" />
                <Skeleton className="h-4" />
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center text-neutral-500 my-10">
              <p className="text-xl text-neutral-600 font-semibold mb-2">
                No results found
              </p>
              <p className="text-sm text-neutral-600">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <Article
                key={article.id}
                id={article.id}
                title={article.title}
                content={article.content}
                published_at={article.published_at}
                source={article.source.name}
              />
            ))
          )}
        </div>

        {totalItems > 0 && (
          <Pagination
            page={currentPage - 1}
            totalItems={totalItems}
            totalPages={totalPages}
            handlePagination={handlePagination}
          />
        )}
      </Card>
    </div>
  );
};

export default NewsPage;
