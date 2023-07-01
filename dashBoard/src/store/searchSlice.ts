import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: ''
  },
  reducers: {
    setTerm: (state, action) => {
      state.term = action.payload;
    },
    clearTerm: state => {
      state.term = '';
    }
  }
});

export const { setTerm, clearTerm } = searchSlice.actions;

export default searchSlice.reducer;