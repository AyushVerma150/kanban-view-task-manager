import { createSlice } from "@reduxjs/toolkit";
//use nano id instead of uuid
import { v4 as uuid } from "uuid";
import { DropResult } from "react-beautiful-dnd";
import { StateSliceDto } from "../../DTO/StateSlice";
import { ItemStateDto } from "../../DTO/ItemStateDto";
import { ColumnStateDto } from "../../DTO/ColumnStateDto";

//add a seperate class , and why it is better ?
//domain Modal ..?
const itemsFromBackend: Array<ItemStateDto> = [
  { id: uuid(), content: "First task", completed: false },
  { id: uuid(), content: "Second task", completed: false },
  { id: uuid(), content: "Third task", completed: false },
  { id: uuid(), content: "Fourth task", completed: false },
  { id: uuid(), content: "Fifth task", completed: false },
];

const initialState: StateSliceDto = {
  columnsFromBackend: {
    [uuid()]: {
      name: "Todo Tasks",
      items: itemsFromBackend,
    },
    [uuid()]: {
      name: "Pending",
      items: [],
    },
    [uuid()]: {
      name: "Waiting",
      items: [],
    },
    [uuid()]: {
      name: "Done",
      items: [],
    },
  },
  modalShow: false,
  editTaskDetails: { id: null, content: "" },
  editColumnId: null,
  editColumn: null,
  updatedTaskText: null,
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    sliceDragEnd: (
      state: StateSliceDto,
      action: { payload: { result: DropResult; prevData: StateSliceDto } }
    ) => {
      const { result, prevData } = action.payload;
      if (!result.destination) return;
      const { source, destination } = result;

      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = state.columnsFromBackend[source.droppableId];
        const destColumn = state.columnsFromBackend[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        if (destColumn.name === "Done") {
          removed.completed = true;
        }
        destItems.splice(destination.index, 0, removed);
        const newObject = {
          ...prevData,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        };
        //@ts-ignore
        state.columnsFromBackend = newObject;
      } else {
        const column = state.columnsFromBackend[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        const newObject = {
          ...prevData,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        };
        //@ts-ignore
        state.columnsFromBackend = newObject;
      }
    },

    onTaskCompleted: (
      state: StateSliceDto,
      action: {
        payload: {
          item: ItemStateDto;
          initialData: StateSliceDto;
          columnId: string;
          column: ColumnStateDto;
        };
      }
    ) => {
      const { item, initialData, columnId, column } = action.payload;

      let rememberTheColumnKey: string = "none";
      let doneTasks: any[] = [];
      for (let key in initialData) {
        //@ts-ignore
        if (initialData[key].name === "Done") {
          rememberTheColumnKey = key;
          //@ts-ignore
          doneTasks = initialData[key].items;
        }
      }
      const newArray: Array<ItemStateDto> = [];
      let newItem: ItemStateDto | any = null;
      //@ts-ignore
      for (let i = 0; i < column.items.length; i++) {
        //@ts-ignore
        const columnItem = column.items[i];
        if (columnItem === item) {
          newItem = {
            id: columnItem.id,
            content: columnItem.content,
            completed: true,
          };
        } else {
          newArray.push(columnItem);
        }
      }
      //newArray.splice(IndexFound ,  0 , newItem);
      let finalObject: any[] = [];

      if (
        doneTasks.length >= 1 &&
        doneTasks.some((item) => item.id === newItem.id)
      ) {
        finalObject = [...doneTasks];
      } else {
        finalObject = [...doneTasks, newItem];
      }
      const newFinalObject = {
        ...initialData,
        [columnId]: {
          name: column.name,
          items: newArray,
        },
        [rememberTheColumnKey]: {
          name: "Done",
          items: finalObject,
        },
      };

      //@ts-ignore
      state.columnsFromBackend = newFinalObject;
    },

    onTaskRemove: (
      state: StateSliceDto,
      action: {
        payload: {
          item: ItemStateDto;
          initialData: StateSliceDto;
          columnId: string;
          column: ColumnStateDto;
        };
      }
    ) => {
      const { item, initialData, columnId, column } = action.payload;
      const newArray: Array<ItemStateDto> = [];
      //@ts-ignore
      for (let i = 0; i < column.items.length; i++) {
        //@ts-ignore
        const columnItem = column.items[i];
        if (columnItem === item) {
        } else {
          newArray.push(columnItem);
        }
      }
      const newFinalObject = {
        ...initialData,
        [columnId]: {
          name: column.name,
          items: newArray,
        },
      };
      //@ts-ignore
      state.columnsFromBackend = newFinalObject;
    },
    onAddNewList: (state) => {
      const newListObj = {
        ...state.columnsFromBackend,
        [uuid()]: {
          name: "Untitles List",
          items: [],
        },
      };
      state.columnsFromBackend = newListObj;
    },
    addNewTask: (
      state: StateSliceDto,
      action: {
        payload: {
          columnId: string;
          column: ColumnStateDto;
        };
      }
    ) => {
      const { columnId, column } = action.payload;
      const newItem: ItemStateDto = {
        id: uuid(),
        content: "Untitled Task",
        completed: false,
      };

      const newArray: any = [];
      //@ts-ignore
      for (let i = 0; i < column.items.length; i++) {
        //@ts-ignore
        const columnItem = column.items[i];
        newArray.push(columnItem);
      }

      newArray.splice(0, 0, newItem);
      const newFinalState = {
        ...state.columnsFromBackend,
        [columnId]: {
          name: column.name,
          items: newArray,
        },
      };
      //@ts-ignore
      state.columnsFromBackend = newFinalState;
    },

    updateModalState: (
      state: StateSliceDto,
      action: {
        payload: {
          showState: boolean;
        };
      }
    ) => {
      const { showState } = action.payload;
      state.modalShow = showState;
    },
    updateEditTaskDetails: (
      state: StateSliceDto,
      action: {
        payload: {
          id: string;
          content: string;
          columnId: string;
          column: ColumnStateDto;
        };
      }
    ) => {
      const { id, content, columnId, column } = action.payload;
      state.editColumnId = columnId;
      state.editColumn = column;
      state.editTaskDetails = { id: id, content: content };
    },
    onEditTask: (state: StateSliceDto) => {
      const updatedText = state.updatedTaskText;

      const newArray: any = [];
      let IndexFound: number | null = null;
      let newItem: {
        id: string;
        content: string | null;
        completed: boolean;
      } | null = null;
      //@ts-ignore
      for (let i = 0; i < state.editColumn.items.length; i++) {
        //@ts-ignore
        const columnItem = state.editColumn.items[i];
        if (columnItem.id === state.editTaskDetails.id) {
          IndexFound = i;
          newItem = {
            id: columnItem.id,
            content: updatedText,
            completed: false,
          };
        } else {
          newArray.push(columnItem);
        }
      }
      newArray.splice(IndexFound, 0, newItem);

      const newFinalState = {
        ...state.columnsFromBackend,
        //@ts-ignore
        [state.editColumnId]: {
          //@ts-ignore
          name: state.editColumn.name,
          items: newArray,
        },
      };

      state.columnsFromBackend = newFinalState;
    },
    onUpdateTaskText: (
      state: StateSliceDto,
      action: {
        payload: {
          updatedText: string;
        };
      }
    ) => {
      const { updatedText } = action.payload;
      state.updatedTaskText = updatedText;
    },
  },
});

export const {
  sliceDragEnd,
  onTaskCompleted,
  onTaskRemove,
  onAddNewList,
  addNewTask,
  updateModalState,
  updateEditTaskDetails,
  onEditTask,
  onUpdateTaskText,
} = listSlice.actions;

export default listSlice.reducer;
