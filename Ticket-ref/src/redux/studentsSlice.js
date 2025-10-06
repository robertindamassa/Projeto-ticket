import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gera um id único simples usando timestamp + aleatório
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
  },
  reducers: {
    setStudents: (state, action) => {
      // Normaliza a lista recebida garantindo ids únicos
      const seen = new Set();
      const normalized = action.payload.map((s) => {
        let id = s.id;
        if (!id || seen.has(id)) {
          id = generateId();
        }
        seen.add(id);
        return {
          ...s,
          id,
          email: s.email || '',
          turma: s.turma || '',
          turno: s.turno || '',
        };
      });
      state.students = normalized;
    },
    addStudent: (state, action) => {
      const id = generateId();
      const matricula = (1000 + state.students.length + 1).toString();
      const newStudent = {
        id,
        name: action.payload.name,
        email: action.payload.email,
        matricula,
        hasTicket: false,
        ticketUsed: false,
        turma: action.payload.turma || '',
        turno: action.payload.turno || '',
      };
      state.students.push(newStudent);
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
