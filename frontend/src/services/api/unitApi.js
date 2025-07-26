import customFetchBase from "./customFetchBase.js";
import {authApi} from "./authApi.js";
import {toast} from "../../components/ui/use-toast.ts";

export const unitApi = authApi.injectEndpoints({
    reducerPath: 'unitApi',
    baseQuery: customFetchBase,
    endpoints: (build) => ({
        getUnits: build.query({
            query: () => ({
                url: '/api/units',
                method: 'GET',
            }),
            providesTags: ['Units'],
        }),
        getUnit: build.query({
            query: (id) => ({
                url: `/api/units/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Units', id }],
        }),
        getUnitById: build.query({
            query: (unitId) => `/api/units/${unitId}`,
            providesTags: (result, error, unitId) => [{ type: 'Units', id: unitId }],
        }),
        updateUnit: build.mutation({
            query: (data) => {
                const id = data.id;
                const body = {...data};
                delete body.id;
                return {
                    url: `/api/units/${id}`,
                    method: 'PATCH',
                    body
                }
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                toast({
                    title: "Updating Unit...",
                    variant: "loading",
                })
                queryFulfilled
                    .then(() => {
                        toast({
                            title: "Success",
                            description: "Unit updated successfully",
                            variant: "success",
                        });
                    })
                    .catch(() => {
                        toast({
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem with your request.",
                            variant: "error",
                        });
                    })
            },
            invalidatesTags: ['Units']
        }),
        assignTenant: build.mutation({
            query: (data) => ({
                url: `/api/units/${data.unitId}/tenant`,
                method: 'PUT',
                body: {
                    tenantId: data.tenantId
                }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                toast({
                    title: "Updating Unit...",
                    variant: "loading",
                })
                queryFulfilled
                    .then(() => {
                        toast({
                            title: "Success",
                            description: "Unit updated successfully",
                            variant: "success",
                        });
                    })
                    .catch(() => {
                        toast({
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem with your request.",
                            variant: "error",
                        });
                    })
            },
            invalidatesTags: ['Units', 'Tenants']
        }),
        getRequestsByUnit: build.query({
            query: (unitId) => `/api/units/${unitId}/requests`,
            providesTags: ['Maintenance']
        }),
        updateUnitOwner: build.mutation({
            query: ({ unitId, ownerId }) => ({
                url: `/api/units/${unitId}/owner`,
                method: 'PUT',
                body: { ownerId }
            }),
            invalidatesTags: ['Units']
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetUnitsQuery,
    useGetUnitQuery,
    useGetUnitByIdQuery,
    useUpdateUnitMutation,
    useAssignTenantMutation,
    useGetRequestsByUnitQuery,
    useUpdateUnitOwnerMutation
} = unitApi;
