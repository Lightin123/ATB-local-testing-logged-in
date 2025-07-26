import customFetchBase from "./customFetchBase.js";
import { toast } from "../../components/ui/use-toast.tsx";
import { authApi } from "./authApi.js";

// Add the "Maintenance" tag type so we can invalidate and refetch data
authApi.enhanceEndpoints({ addTagTypes: ["Maintenance"] });

export const maintenanceApi = authApi.injectEndpoints({
    reducerPath: 'maintenanceApi',
    baseQuery: customFetchBase,
    endpoints: (build) => ({
        getMaintenanceReports: build.query({
            query: (unitId) =>
                unitId != null
                    ? `/api/maintenance?unitId=${unitId}`
                    : '/api/maintenance',
            // provide tags for each record and a LIST tag for the whole set
            providesTags: (result = []) => [
                ...result.map(({ id }) => ({ type: 'Maintenance', id })),
                { type: 'Maintenance', id: 'LIST' },
            ],
        }),
        createMaintenanceReport: build.mutation({
            query: (body) => ({
                url: '/api/maintenance',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Maintenance'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                toast({
                    title: "Creating Maintenance Report...",
                    variant: "loading",
                })
                queryFulfilled
                    .then(() => {
                        toast({
                            title: "Success",
                            description: "Maintenance Report created successfully.",
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
        }),
        updateMaintenanceReport: build.mutation({
            query: ({ id, ...patch }) => ({
                url: `/api/maintenance/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            // invalidate both the individual record and the list
            invalidatesTags: (result, error, { id }) => [
                { type: 'Maintenance', id },
                { type: 'Maintenance', id: 'LIST' },
            ],
        }),
    }),
})

export const {
  useGetMaintenanceReportsQuery,
  useCreateMaintenanceReportMutation,
  useUpdateMaintenanceReportMutation,
} = maintenanceApi;

export const usePatchMaintenanceReportMutation =
  useUpdateMaintenanceReportMutation;
