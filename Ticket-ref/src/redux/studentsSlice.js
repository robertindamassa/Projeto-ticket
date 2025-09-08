import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

let nextId = 1;

export const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
  },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      nextId = state.students.length + 1; // ajusta ID
    },
    addStudent: (state, action) => {
      const newStudent = {
        id: nextId.toString(),
        name: action.payload.name,
        matricula: (1000 + nextId).toString(),
        hasTicket: false,
        ticketUsed: false,
      };
      state.students.push(newStudent);
      nextId += 1;
      // salva no AsyncStorage
      AsyncStorage.setItem('@students', JSON.stringify(state.students));
    },
    resetTickets: (state) => {
      state.students.forEach(student => {
        student.ticketUsed = false;
      });
      AsyncStorage.setItem('@students', JSON.stringify(state.students));
    },
  },
});

export const { addStudent, resetTickets, setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
