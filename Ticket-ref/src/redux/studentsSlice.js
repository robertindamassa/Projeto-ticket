import { createSlice } from '@reduxjs/toolkit';
import { saveStudentsToStorage } from '../storage';

const studentsSlice = createSlice({
  name: 'students',
  initialState: [],
  reducers: {
    addStudent: (state, action) => {
      state.push({
        id: Date.now().toString(),
        name: action.payload.name,
        matricula: action.payload.matricula,
        hasTicket: false,
        ticketUsed: false,
      });
      saveStudentsToStorage(state);
    },
    resetTickets: (state) => {
      state.forEach(student => {
        student.hasTicket = false;
        student.ticketUsed = false;
      });
      saveStudentsToStorage(state);
    },
    giveTicket: (state, action) => {
      const student = state.find(s => s.id === action.payload);
      if (student) {
        student.hasTicket = true;
        student.ticketUsed = false;
        saveStudentsToStorage(state);
      }
    },
    useTicket: (state, action) => {
      const student = state.find(s => s.id === action.payload);
      if (student && student.hasTicket) {
        student.ticketUsed = true;
        saveStudentsToStorage(state);
      }
    },
    setStudents: (state, action) => {
      return action.payload;
    },
  },
});

export const { addStudent, resetTickets, giveTicket, useTicket, setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
