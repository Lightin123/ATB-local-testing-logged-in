import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectedProperty: "all",
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        selectProperty: (state, action) => {
            state.selectedProperty = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
    },
})



export const { selectProperty, setUser } = userSlice.actions
export default userSlice.reducer

