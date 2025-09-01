import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENTS_KEY = '@tickets_students_v1';

export const loadStudentsFromStorage = async () => {
  try {
    const raw = await AsyncStorage.getItem(STUDENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao carregar alunos', e);
    return [];
  }
};


export const saveStudentsToStorage = async (students) => {
  try {
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn('Erro ao salvar alunos', e);
  }
};