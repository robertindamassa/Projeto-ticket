import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// thunk para buscar alunos do AsyncStorage
export const fetchStudentsFromStorage = createAsyncThunk(
  'students/fetchFromStorage',
  async () => {
    const data = await AsyncStorage.getItem('students');
    return data ? JSON.parse(data) : [];
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    list: [],
    status: 'idle',
  },
  reducers: {
    addStudent: (state, action) => {
      state.list.push(action.payload);
      AsyncStorage.setItem('students', JSON.stringify(state.list));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsFromStorage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentsFromStorage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStudentsFromStorage.rejected, (state) => {
        state.status = 'failed';
      });
  },
});


export const { addStudent, resetTickets, giveTicket, useTicket, setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
