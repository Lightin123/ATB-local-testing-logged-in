import { authApi } from "./authApi.js";
import { toast } from "../../components/ui/use-toast.ts";

interface MaintenanceRequest {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

interface Unit {
  id: number;
  unitNumber: string;
  tenant: { user: { id: number; firstName: string; lastName: string } } | null;
  owners: Array<{ id: number; firstName: string; lastName: string }>;
  maintenanceRequests: MaintenanceRequest[];
}

interface Property {
  id: number;
  name: string;
  address: string;
  units: Unit[];
}

export const propertyApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getProperties: build.query<Property[], void>({
      query: () => ({
        url: '/api/properties',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Properties' as const, id })),
              { type: 'Properties', id: 'LIST' },
            ]
          : [{ type: 'Properties', id: 'LIST' }],
    }),

    getUnitsByProperty: build.query<Unit[], number | string>({
      query: (propertyId) => `/api/properties/${propertyId}/units`,
      providesTags: (result, error, propertyId) => [
        { type: 'Properties', id: propertyId },
      ],
    }),

    createProperty: build.mutation<Property, any>({
      query: (property) => ({
        url: '/api/properties',
        method: 'POST',
        body: {
          title: property.title,
          street: property.street,
          city: property.city,
          state: property.state,
          zip: property.zip,
          country: property.country,
          units: property.units.map(u => (
            u.isNewOwner
              ? { unitNumber: u.unitNumber, owners: { create: [u.ownerFields] } }
              : { unitNumber: u.unitNumber, owners: { connect: [{ id: u.ownerId }] } }
          ))
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        toast({
          title: "Creating Property...",
          variant: "loading",
        });
        try {
          // Get the created property directly
          const { data: property } = await queryFulfilled;
          const unitShortCodes = property?.units?.map(unit => unit.unitNumber);
          toast({
            title: "Success",
            description: "Property created successfully, your units are: " +
              (unitShortCodes ? unitShortCodes.join(", ") : ""),
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            variant: "error",
          });
        }
      },
      invalidatesTags: ['Properties', 'Units'],
    }),

    getProperty: build.query<Property, number | string>({
      query: (id) => ({
        url: `/api/properties/${id}`,
        method: 'GET',
      }),
    }),

    getPropertyById: build.query<Property, number | string>({
      query: (id) => `/api/properties/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Properties', id: result.id }] : [],
    }),

    deleteProperty: build.mutation<{ success: boolean }, number | string>({
      query: (id) => ({
        url: '/api/properties/' + id,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        toast({
          title: "Deleting Property...",
          variant: "loading",
        });
        try {
          await queryFulfilled;
          toast({
            title: "Success",
            description: "Property deleted successfully",
            variant: "success",
          });
        } catch {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            variant: "error",
          });
        }
      },
      invalidatesTags: [
        { type: 'Properties', id: 'LIST' },
        'Units'
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPropertiesQuery,
  useGetUnitsByPropertyQuery,
  useCreatePropertyMutation,
  useGetPropertyQuery,
  useGetPropertyByIdQuery,
  useDeletePropertyMutation,
} = propertyApi;
