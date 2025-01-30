import axios from "@/api/axios";

export const fetchCategories = async () => {
  const response = await axios.get("/api/categories");
  return response.data;
};

export const fetchSources = async () => {
  const response = await axios.get("/api/sources");
  return response.data;
};

export const fetchAuthors = async () => {
  const response = await axios.get("/api/authors");
  return response.data;
};
