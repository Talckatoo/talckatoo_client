import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MediaState {
  type: string;
  url: string;
  altText: string;
  error: string;
}

export const MediaApi = createApi({
  reducerPath: "MediaApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL as string,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadFile: builder.mutation<MediaState, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = MediaApi;
