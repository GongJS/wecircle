import React from 'react';
import { Input, Button } from 'redell-ui'
import NavBar from '../navbar/NavBar'
import './edititem.scss';

interface EditItemProps {
  title?: string
  value?: string
  goBack?: () => any
  onChange?: (value:string) => any
  update?: () => any
}

const EditItem: React.FC<EditItemProps> = ({ title, value, onChange,update }) => {
  return (
    <div className="edit-item">
      <NavBar title={title} />
      <div className="edit-item-input border-bottom">
        <Input value={value} onValueChange={onChange}/>
      </div>
      <div className="edit-item-button">
          <Button type="danger" onClick={update}>确定</Button>
        </div>
    </div>
  );
}

EditItem.displayName = 'EditItem'
export default EditItem;