import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json',
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
