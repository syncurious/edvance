import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json',
    },
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { session: { accessToken: string } | null } }).auth.session?.accessToken;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    'Attendance',
    'Dashboard',
    'Exam',
    'Fee',
    'Report',
    'School',
    'Student',
    'Subscription',
    'Teacher',
    'User',
  ],
  endpoints: () => ({}),
});
