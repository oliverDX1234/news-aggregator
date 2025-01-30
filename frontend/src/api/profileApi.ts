import axios from "@/api/axios";

import { ProfileType } from "@/types/types";

export const fetchProfile = async () => {
  const response = await axios.get("/api/user");
  return response.data;
};

export const updateProfile = async (data: ProfileType) => {
  const response = await axios.put("/api/user", data);
  return response.data;
};
