import {ItemStateDto} from './ItemStateDto';

export interface ColumnStateDto
{
    [id:string] :
    {
        name:string,
        items: Array<ItemStateDto> | any[]
    }
}