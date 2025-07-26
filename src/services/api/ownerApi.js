import customFetchBase from "./customFetchBase.js";
import { toast } from "../../components/ui/use-toast.tsx";
import { authApi } from "./authApi.js";

export const ownerApi = authApi.injectEndpoints({
    reducerPath: 'ownerApi',
    baseQuery: customFetchBase,
    endpoints: (build) => ({
        getOwners: build.query({
            query: () => ({
                url: '/api/owners',
                method: 'GET',
            }),
            providesTags: ['Owners'],
        }),
        changeUnitOwner: build.mutation({
            query: ({unitId, data}) => ({
                url: `/api/units/${unitId}/owner`,
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                toast({
                    title: 'Updating Owner...',
                    variant: 'loading',
                });
                queryFulfilled
                    .then(() => {
                        toast({
                            title: 'Success',
                            description: 'Owner updated successfully',
                            variant: 'success',
                        });
                    })
                    .catch(() => {
                        toast({
                            title: 'Uh oh! Something went wrong.',
                            description: 'There was a problem with your request.',
                            variant: 'error',
                        });
                    });
            },
            invalidatesTags: ['Units'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetOwnersQuery, useChangeUnitOwnerMutation } = ownerApi;
