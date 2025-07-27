import authSlice from "../auth/authSlice";
import userReducer from "../slices/userSlice";
// The following imports were previously required to ensure endpoint injection
// before store setup. They are replaced by the consolidated appApi slice.
import { appApi } from "../appApi";

import {
    leasesReducer,
    paymentsReducer,
    propertiesReducer,
    tenantsReducer,
    unitsReducer,
    maintenanceReducer,
    expensesReducer
} from "../slices/objectSlice";
import { configureStore } from '@reduxjs/toolkit'
import {eventsReducer} from "../slices/eventSlice";
import {messagesReducer} from "../slices/messageSlice";


export const store = configureStore({
    reducer: {
        [appApi.reducerPath]: appApi.reducer,
        authSlice: authSlice,
        userSlice: userReducer,
        properties: propertiesReducer,
        units: unitsReducer,
        leases: leasesReducer,
        payments: paymentsReducer,
        tenants: tenantsReducer,
        maintenance: maintenanceReducer,
        events: eventsReducer,
        messages: messagesReducer,
        expenses: expensesReducer


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(appApi.middleware)

})


