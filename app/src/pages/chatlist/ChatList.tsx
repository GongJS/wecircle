import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import {Input} from 'redell-ui'
import {post} from '../../utils/http'
import {formateDate} from '../../utils/helper'
import NavBar from '../../components/navbar/NavBar'
import './chatlist.scss';

interface ChatListProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}


const ChatList: React.FC<ChatListProps> = () => {
  const [list, setList] = useState([])
  const { history } = useReactRouter()
  const [keyword,setKeyWord] = useState('')
  const user = JSON.parse(localStorage.getItem('user') ||  '{}')
  const handleChange = (value:string | number) => {
    setKeyWord(value.toString())
  }
  const getchatlist = async () => {
    const res:any = await post('/api/getchatlist',{keyword: '',myId:user._id})
    setList(res.data)
  }
  const handleSearch = async () => {
    const res:any = await post('/api/getchatlist',{keyword,myId:user._id})
    setList(res.data)
  }
  const clearClick = () => {
    getchatlist()
  }
  const goToChat = (item:any) => {
    let userInfo: any
    if (item.fromUser._id === user._id) {
      userInfo = item.toUser
    } else {
      userInfo = item.fromUser
    }
    history.push({
      pathname: '/chat',
      state: {...userInfo}
    })
  }
  useEffect(() => {
    getchatlist()
  },[]) // eslint-disable-line
  return (
    <div className="chat-list">
      <NavBar title="我的私信" />
      <div className="search-bar">
        <Input onValueChange={handleChange} value={keyword} clearable  addonAfter="查找" extraClick={handleSearch} clearClick={clearClick}/>
      </div>
      {
        list.map((item:any) => {
          return (
            <div className="item" key={item._id} onClick={() => goToChat(item)}>
              <img src={item.user.avatar} alt="" className="avatar"/>
              <div className="right-content border-bottom">
                <p className="nickname">{item.user.nickname}</p>
                {
                  item.msg.content && item.msg.content.type==='str' ? 
                  <p className="text one-line">{item.msg.content.value}</p> :
                  <p className="text one-line">[图片]</p> 
                }
              </div>
              <div className="time">{formateDate(item.msg.create)}</div>
            </div>
          )
        })
      }
    </div>
  );
}

ChatList.displayName = 'ChatList'
export default ChatList