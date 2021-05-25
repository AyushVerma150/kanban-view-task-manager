export interface StateSliceDto
{
    columnsFromBackend : 
  {
    [id:string]:
    {
      name : string,
      items: Array<{id:string , content:string , completed:boolean}> | any[]
    }

  } ,
  modalShow:boolean,
  editTaskDetails : {id:string|null , content :string},
  editColumnId:string | null,
  editColumn : null| {
    [id:string]:
    {
      name:string,
      items: Array<{id:string , content:string , completed:boolean}> | any[] | null
    }
  },
  updatedTaskText:string |null
}