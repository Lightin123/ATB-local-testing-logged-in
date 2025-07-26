import { authApi } from './authApi.js';

export const adminApi = authApi.injectEndpoints({
  endpoints: build => ({
    getAdminProperties: build.query({
      query: adminId => `/api/admin/${adminId}/properties`,
      providesTags: ['Properties']
    }),
    generateOverwriteCode: build.mutation({
      query: body => ({
        url: '/api/admin/generate-overwrite-code',
        method: 'POST',
        body
      })
    })
  })
});

export const { useGetAdminPropertiesQuery, useGenerateOverwriteCodeMutation } = adminApi;
