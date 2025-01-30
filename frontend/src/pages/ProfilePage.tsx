import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/custom/multi-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { fetchCategories, fetchSources, fetchAuthors } from "@/api/filtersApi";
import { updateProfile } from "@/api/profileApi";

import { CategoryType, SourceType, AuthorType, User } from "@/types/types";

import Cookies from "js-cookie";

import useAuth from "@/hooks/useAuth";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const HIDE_ALERT_COOKIE =
  import.meta.env.VITE_HIDE_ALERT_COOKIE || "hide_profile_alert";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  personalizedNews: z.boolean(),
  categories: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [sources, setSources] = useState<SourceType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      personalizedNews: false,
      categories: [],
      sources: [],
      authors: [],
    },
  });

  const fetchData = async () => {
    setLoading(true);

    try {
      const [categoriesData, sourcesData, authorsData] = await Promise.all([
        fetchCategories(),
        fetchSources(),
        fetchAuthors(),
      ]);

      setCategories(categoriesData);
      setSources(sourcesData);
      setAuthors(authorsData);

      form.reset({
        fullName: user!.name,
        email: user!.email,
        personalizedNews: user!.personalized_news,
        categories: user!.categories,
        sources: user!.sources,
        authors: user!.authors,
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Failed to load profile information. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setSavingUser(true);

    try {
      await updateProfile({
        full_name: data.fullName,
        personalized_news: data.personalizedNews,
        categories: data.categories,
        sources: data.sources,
        authors: data.authors,
      });

      setUser((prevUser: User | null) => {
        if (prevUser) {
          return {
            ...prevUser,
            name: data.fullName,
            personalized_news: data.personalizedNews,
            categories: data.categories || [],
            sources: data.sources || [],
            authors: data.authors || [],
          };
        }

        return prevUser;
      });

      Cookies.set(HIDE_ALERT_COOKIE, "true", { expires: 1 });

      toast({
        title: "Success",
        description: "Profile updated successfully!",
        variant: "success",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSavingUser(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 px-4 py-6 sm:p-6">
      <Card className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Profile</h1>

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 mt-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black w-full"
                      placeholder="Enter your full name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input className="text-black w-full" {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator className="my-4" />

            <FormField
              control={form.control}
              name="personalizedNews"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-black font-bold text-lg">
                      Personalized feed
                    </FormLabel>
                    <FormDescription>
                      Enable personalized news based on your interests.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                form.watch("personalizedNews")
                  ? "max-h-[600px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select personalized categories"
                        disabled={loading}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select personalized sources"
                        disabled={loading}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select personalized authors"
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" disabled={savingUser}>
                {savingUser ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
