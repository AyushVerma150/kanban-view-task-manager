import React from "react";
import { DragDropContext, DropResult} from "react-beautiful-dnd";
import {useSelector , useDispatch , RootStateOrAny} from 'react-redux';

import Column from './Components/Features/Column';
import {sliceDragEnd} from './Components/Features/DragDropContentSlice';
import ModalComponent from '../src/UI/Modal';

import backgroundImage from  '../src/25501.jpg';

const App :React.FC = (): JSX.Element => {

  const dispatch = useDispatch();
  const initialData = useSelector((state:RootStateOrAny) => state.list.columnsFromBackend);  
  const onDragEnd = (result: DropResult):void => {
    dispatch(sliceDragEnd({result:result , prevData:initialData}));
  };

  const headerDiv = {
    display: "flex", 
    justifyContent: "space-evenly", 
    height: "100vh" ,
    width:"100%",
    backgroundImage:`url(${backgroundImage})`,
    backgroundSize:"1800px 900px"
  }

  return (
    <div style={headerDiv}>
    <ModalComponent />
     <DragDropContext onDragEnd={(result:DropResult) => onDragEnd(result)}>
        {Object.entries( (initialData)).map(([columnId,column]) => {
          return (
            <div key={columnId} >
           <Column columnId={columnId} column={column} initialData={initialData}/>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
