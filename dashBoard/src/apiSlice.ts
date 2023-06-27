import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase, cleanTags } from './helpers'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({ page, limit = 10 }) => `events/?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => {
        // Преобразование ответа сервера перед обработкой
        const { events } = response
        const transformedEvents = events.map(el => {
          const tag = cleanTags(el.tags).split(',')
          return { ...toCamelCase(el), tags: tag }
        })
        return transformedEvents;
      },
      providesTags: ['Events'] as any
    }),
    createEvent: builder.mutation({
      query: (event) => ({
        url: '/events',
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['Events'] as any
    }),
  }),
});

export const { useGetEventsQuery, useCreateEventMutation } = apiSlice;