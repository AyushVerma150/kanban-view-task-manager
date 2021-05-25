import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import {
  Button,
  Menu,
  Fade,
  MenuItem
} from '@material-ui/core';


import ProjectConstants from '../../Contants/Constants';
import {
  onTaskCompleted,
  onTaskRemove,
  updateModalState,
  updateEditTaskDetails
} from './DragDropContentSlice';
import { ItemStateDto } from '../../DTO/ItemStateDto';

//destructuring ...
const Draggables: React.FunctionComponent<{
  item: ItemStateDto,
  index: number,
  initialData: any,
  columnId: any,
  column: any
}> = ({item , index , initialData , columnId , column}) => {

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

   
    const doneTaskHandler = ({item , initialData , columnId , column} : any) =>
    {
      dispatch(onTaskCompleted({
                item: item,
                initialData: initialData,
                columnId: columnId,
                column:column
              }));
    }

    const removeTaskHandler = ({item , initialData , columnId , column}:any) =>
    {
      dispatch(onTaskRemove({
        item: item,
        initialData: initialData,
        columnId: columnId,
        column:column
      }));
    }

    const editTaskHandler = ({id , content , columnId , column} : any) =>
    {
      dispatch(updateEditTaskDetails({
        id: id,
        content:content,
        columnId: columnId,
        column:column
      }));

    }

    const getDraggableStyle = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
      return {
        userSelect: "none",
        fontWeight: "bold",
        padding: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0 0 8px 0",
        minHeight: "50px",
        backgroundColor: snapshot.isDragging
          ? "#C5C5C5"
          : "#E6E7E7",
        color: "black",
        ...provided.draggableProps.style
      }
    }

    return (
      <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              // @ts-ignore
              style={getDraggableStyle(provided, snapshot)}
            >
              { item.completed ?
                <i style={{ color: "green" }} className="fas fa-check-circle"></i> :
                <i style={{ color: "red" }} className="fas fa-exclamation-triangle"></i>
              }
              {item.content}
              <div>
                <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                  <i style={{ color: "black" }} className="fa fa-ellipsis-v" aria-hidden="true"></i>
                </Button>
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  {
                    item.completed ? null : <>
                      {/* //add seperate function... */}
                      <MenuItem onClick={() => {
                        doneTaskHandler({item , initialData , columnId , column});
                        handleClose();
                      }}>
                        {ProjectConstants.HTML_VARIABLES.DONE}
                      </MenuItem>
                    </>
                  }
                  <MenuItem onClick={() => {
                    removeTaskHandler({item , initialData , columnId , column});
                    handleClose();
                  }
                  }>
                    {ProjectConstants.HTML_VARIABLES.REMOVE}
                  </MenuItem>
                    <MenuItem onClick={() => {
                    editTaskHandler({ id:item.id , content:item.content , columnId , column});
                    dispatch(updateModalState({ showState: true }));
                    handleClose();
                  }}>
                    {ProjectConstants.HTML_VARIABLES.EDIT}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          );
        }}
      </Draggable>
    );
  };

export default Draggables;