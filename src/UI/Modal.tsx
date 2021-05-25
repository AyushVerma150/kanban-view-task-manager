import React  from 'react';
import {Modal , Button} from 'react-bootstrap';
import {useSelector , useDispatch} from 'react-redux';

import {RootState , AppDispatch} from '../Store';
import InputTextBox from '../UI/InputTextBox';
import {updateModalState , onEditTask} from '../Components/Features/DragDropContentSlice';

import ProjectConstants from '../Contants/Constants';

const ModalComponent:React.FC = ():JSX.Element =>
{
    const dispatch:AppDispatch = useDispatch();
    const show = useSelector( (state:RootState) => state.list.modalShow);

    return(
        <div>
        <Modal show={show} onHide={()=>
        {
            dispatch(updateModalState({showState:false}));
        }}>
        <Modal.Header closeButton>
        <Modal.Title>{ProjectConstants.USER_MSG.EDIT}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputTextBox />
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() =>{
            dispatch(onEditTask());
            dispatch(updateModalState({showState:false}));
            }}>
        {ProjectConstants.HTML_VARIABLES.SAVE}
        </Button>
        <Button variant="primary" onClick={()=>
        {
            dispatch(updateModalState({showState:false}));
        }}>
        {ProjectConstants.HTML_VARIABLES.CANCEL}
        </Button>
        </Modal.Footer>
        </Modal>
        </div>
    );
   
};


export default ModalComponent;