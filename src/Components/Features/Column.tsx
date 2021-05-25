import React from 'react';
import {useDispatch} from 'react-redux';
import {Droppable , DroppableProvided , DroppableStateSnapshot } from "react-beautiful-dnd";

import Todo from './Task';
import {addNewTask} from './DragDropContentSlice';

import ProjectConstants from '../../Contants/Constants';


interface sliceState
{
  columnsFromBackend : 
  {
    [id:string]:
    {
      name : string,
      items: Array<{id:string , content:string , completed:boolean}> | []
    }
  }
}


//use destructuring..
const Column:React.FC<{columnId:string , column:any , initialData:sliceState}>  = ({columnId , column , initialData}) =>
{
    const dispatch = useDispatch();

    const columnStyles = {
        display:"flex", 
        justifyContent:"space-evenly" , 
        backgroundColor:"#81CCFF",
        borderRadius:"10px",
        opacity:"0.99",
        height:"70px",
        padding:"20px",
    }

    const columnHeading = (snapshot : DroppableStateSnapshot) => {
        return {   
            borderRadius:"10px",
            background: snapshot.isDraggingOver
            ? "#FAF9F6"
            : "#FAF9F6",
            padding: 4,
            width: "350px",
            minHeight: "600px",
            opacity:"0.7",
            overflow:"scroll"
        }    
    }

    return(
        <>
        <div style={{ margin: 8 }}>
          <div style={columnStyles}>
            <h4>{column.name}</h4>
            <h4>{column.items.length>=1 ? column.items.length:null }</h4>
            <div style={{marginTop:"5px"}}>
            <i 
            onClick={() =>{

              //seperate function .....
                dispatch(addNewTask({column:column , columnId:columnId}))
            }}
            className="fa fa-plus-square" aria-hidden="true"></i>
            </div> 
           </div>
           {/* //what is render props... */}
            <Droppable droppableId={columnId} key={columnId}>
                {(provided :DroppableProvided, snapshot:DroppableStateSnapshot) => {
                return (
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={columnHeading(snapshot)}>
                    {column.items.map((item:
                    {
                      id:string ,
                      content:string ,
                      completed :boolean
                    }, 
                    index:number) => {
                        return (
                        <div>
                           {
                              column.name === ProjectConstants.USER_MSG.DONE ?
                              <p><strong style={{color:"green"}}>
                                {ProjectConstants.USER_MSG.CONGRATULATION}
                                </strong> 
                                {ProjectConstants.USER_MSG.COMPLETE}
                              </p>
                                : null
                            }
                            <Todo 
                                item={item} 
                                index={index} 
                                initialData={initialData}
                                columnId = {columnId}
                                column ={column}
                            />
                            </div>
                        );
                    })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
        </>
    );
};



export default Column;