import React, { useState } from 'react';
import { Input, Button, Modal,message } from 'redell-ui'
import { post } from '../../../utils/http'
import { formateDate } from '../../../utils/helper'
import NavBar from '../../../components/navbar/NavBar'
import Empty from '../../../components/empty/Empty'
import './add.scss';

interface AddProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}


const Add: React.FC<AddProps> = () => {
  const [list, setList] = useState([])
  const [visible,setVisible] = useState(false)
  const [keyword, setKeyWord] = useState('')
  const [content, setContent] = useState('')
  const [showEmpty, setShowEmpty] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  let toUserId = React.useRef<string>()
  const handleKeyWordChange = (keyword: string) => {
    setKeyWord(keyword)
  }
  const handleContentChange = (content:string)  => {
    setContent(content)
  }
  const handleSearch = async () => {
    const res: any = await post('/api/user/search', { keyword })
    setShowEmpty(true)
    setList(res.data)
  }
  const showModal = async (id:string) => {
    setVisible(true)
    toUserId.current = id
  }
  const handleOk = async () => {
    const res: any = await post('/api/request/addfriend', { content, myId: user._id,toUserId:toUserId.current })
    if (res && res.code === 0) {
      setVisible(false)
      message.success('好友请求发送成功')
    } else {
      message.error(`${res.msg}`)
    }
  }
  return (
    <div className="add">
      <NavBar title="添加好友" />
      <div className="search-bar">
        <Input onValueChange={handleKeyWordChange} value={keyword} clearable addonAfter="查找" extraClick={handleSearch} placeholder="手机号/用户名"/>
      </div>
      {
        list.map((item: any) => {
          return (
            <div className="item" key={item._id} >
              <img src={item.avatar} alt="" className="avatar" />
              <div className="right-content border-bottom">
                <p className="nickname">{item.nickname}</p>
                <Button type="success" onClick={() => showModal(item._id)} >添加</Button>
              </div>
              <div className="time">{formateDate(item.create)}</div>
            </div>
          )
        })
      }
      {
        list.length === 0 && showEmpty? <Empty title="用户不存在"></Empty> : null
      }
      <Modal visible={visible} onOk={handleOk}
        onCancel={() => setVisible(false)} title="添加好友" className="wrapper">
           <Input onValueChange={handleContentChange} value={content} clearable addonBefore="内容"/>
      </Modal> 
    </div>
  );
}

Add.displayName = 'Add'
export default Add