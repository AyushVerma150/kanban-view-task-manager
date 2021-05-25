import React , {useState} from 'react';
import { InputGroup , FormControl} from 'react-bootstrap';
import {useSelector , useDispatch} from 'react-redux';

import {RootState , AppDispatch} from '../Store';
import {onUpdateTaskText}  from '../Components/Features/DragDropContentSlice';


const InputTextBox = () =>
{
    const dispatch:AppDispatch = useDispatch();
    const taskDetails  = useSelector((state:RootState) => state.list.editTaskDetails);
    const [updatedText , setUpdatedText]  = useState<string>("");
  
    const handleTextBoxChange = (e : React.ChangeEvent<HTMLInputElement>) =>
    {
        const value:string = e.target.value;
        setUpdatedText(value);
        dispatch(onUpdateTaskText( {updatedText : updatedText}));
    }

    return (
        <div>
            <InputGroup className="mb-3">
            <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Edit Task</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
            onChange = {handleTextBoxChange}
            defaultValue={taskDetails.content}
            placeholder="updated task Details"
            aria-label="Username"
            aria-describedby="basic-addon1"
            />
            </InputGroup>
        </div>
    )
};

export default InputTextBox;
