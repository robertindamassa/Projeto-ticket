import { createSlice } from '@reduxjs/toolkit';

let nextId = 1; // contador para IDs e matrículas

export const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
  },
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        id: nextId.toString(),
        name: action.payload.name,
        matricula: (1000 + nextId).toString(), // matrícula automática
        hasTicket: false,
        ticketUsed: false,
      };
      state.students.push(newStudent);
      nextId += 1;
    },
    resetTickets: (state) => {
      state.students.forEach(student => {
        student.ticketUsed = false;
      });
    },
  },
});

export const { addStudent, resetTickets } = studentsSlice.actions;
export default studentsSlice.reducer;
