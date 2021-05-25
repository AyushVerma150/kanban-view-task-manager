import { configureStore } from '@reduxjs/toolkit';
import ListReducer from './Components/Features/DragDropContentSlice';

const store =  configureStore(
    {
        reducer:
        {
            list: ListReducer,
        }
    }
);

// Infer the `RootState` and `AppDispatch` types from the store itself
//what is Return Type ??
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;