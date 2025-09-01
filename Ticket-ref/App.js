import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { fetchStudentsFromStorage } from './src/redux/studentsSlice';
import AdminScreen from './src/screens/AdminScreen';

const Loader = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentsFromStorage()); // carrega alunos ao abrir o app
  }, [dispatch]);
  return <AdminScreen />; // aqui você pode depois colocar a navegação
};

export default function App() {
  return (
    <Provider store={store}>
      <Loader />
    </Provider>
  );
}
