import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { logoutUser } from '../auth/authActions.js';
import { setAccessToken } from '../auth/authSlice.js';

const mutex = new Mutex();



// Normalize API URL and ensure it never ends with a trailing slash
const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, {getState}) => {
        const accessToken = getState().authSlice?.accessToken;
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
    },
})

const customFetchBase = async (args, api, extraOptions) => {
    const path = typeof args === 'string' ? args : args.url;
    const fullUrl = `${baseUrl}${path}`;
    console.log('[customFetchBase] \u{1F449} Fetching URL:', fullUrl, 'args:', args);

    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    const status = result.error?.status || 200;
    console.log('[customFetchBase] \u{1F448} Response status:', status);

    if (result.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery({
                    url: '/api/refresh',
                    method: 'POST',
                    body: { token: localStorage.getItem('refreshToken') }
                }, api, extraOptions);

                if (refreshResult.data) {
                    const { accessToken: newAccessToken, refreshToken } = refreshResult.data;
                    api.dispatch(setAccessToken(newAccessToken));
                    localStorage.setItem('refreshToken', refreshToken);
                    result = await baseQuery(args, api, extraOptions);
                } else if (refreshResult.error?.status === 401) {
                    logoutUser();
                } else {
                    return refreshResult;
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    } else if (result.error) {
        console.warn(`[customFetchBase] non-401 error for ${fullUrl}:`, result.error.status);
        return result;
    }

    return result;
};


export default customFetchBase;
