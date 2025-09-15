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
      state.students = action.payload.map((s) => ({
        ...s,
        email: s.email || '',
        turma: s.turma || '',      // adiciona turma
        turno: s.turno || '',      // adiciona turno
      }));
      nextId = state.students.length + 1;
    },
    addStudent: (state, action) => {
      const newStudent = {
        id: nextId.toString(),
        name: action.payload.name,
        email: action.payload.email,
        matricula: (1000 + nextId).toString(),
        hasTicket: false,
        ticketUsed: false,
        turma: action.payload.turma || '',   // turma escolhida
        turno: action.payload.turno || '',   // turno escolhido
      };
      state.students.push(newStudent);
      nextId += 1;
      AsyncStorage.setItem('@students', JSON.stringify(state.students));
    },
    updateStudent: (state, action) => {
      const { id, name, email, turma, turno } = action.payload;
      const student = state.students.find(s => s.id === id);
      if (student) {
        student.name = name;
        student.email = email;
        student.turma = turma;
        student.turno = turno;
        AsyncStorage.setItem('@students', JSON.stringify(state.students));
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      AsyncStorage.setItem('@students', JSON.stringify(state.students));
    },
    resetTickets: (state) => {
      state.students.forEach(student => {
        student.ticketUsed = false;
      });
      AsyncStorage.setItem('@students', JSON.stringify(state.students));
    },
    clearStudents: (state) => {
      state.students = [];
      AsyncStorage.removeItem('@students');
      nextId = 1;
    },
  },
});

export const { addStudent, updateStudent, removeStudent, resetTickets, clearStudents, setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
