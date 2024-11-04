import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {isLoggedIn: false, role: "user"},
  reducers: {
    login(state){
        state.isLoggedIn = true;
    },
    logout(state){
        state.isLoggedIn = false;
    },
    changeRole(state, action){
        const role = action.payload;
        state.role = role;
    }
  },
});

// Export actions
export const authActions = authSlice.actions;

// Export reducer
export default authSlice.reducer;