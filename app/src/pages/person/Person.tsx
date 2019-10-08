import React, { useLayoutEffect, useState, useEffect } from 'react';
import {Modal, Input, message} from 'redell-ui'
import useReactRouter from 'use-react-router';
import { post } from '../../utils/http'
import NavBar from '../../components/navbar/NavBar'
import './person.scss';

interface PersonProps {
  [propName: string]: any;
}
const Person: React.FC<PersonProps> = (props) => {
  const { history } = useReactRouter()
  const [visible, setVisible] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [content, setContent] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  let toUserId = React.useRef<string>()

  const goToChat = () => {
    history.push({
      pathname: '/chat',
      state: { ...props.location.state }
    })
  }
  const handleContentChange = (content:string)  => {
    setContent(content)
  }
  const handleFriend = async () => {
    const res: any = await post('/api/user/search', { keyword: '', myId: user._id })
    if (res && res.code === 0) {
      res.data[0] && res.data[0].friend.forEach((v:any) => {
        if (v._id === props.location.state._id) {
          setIsFriend(true)
        }
      });
    }
  }
  const showModal = async () => {
    setVisible(true)
    toUserId.current = props.location.state._id
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
  useLayoutEffect(() => {
    if (!props.location.state) {
      history.push('/')
    }
  })
  useEffect(() => {
    handleFriend()
  },[]) // eslint-disable-line
  return (
    <div className="person">
      < NavBar title="个人信息" />
      <div className="person-info">
        <span>
          <img src={props.location && props.location.state && props.location.state.avatar} className="avatar" alt="" />
          <div className="person-info-right">
            <p className="nickname">
              {props.location && props.location.state && props.location.state.nickname}
            </p>
            <p className="phone">
              Tel: {props.location && props.location.state && props.location.state.phone}
            </p>
          </div>
        </span>
      </div>
      <div className="panel">
        <div className="left">
          <div className="msg-icon"></div>
          {
            !isFriend ? <div onClick={showModal}>添加好友</div> : <div onClick={goToChat}>发送消息</div>
          }
        </div>
        <div className="right"></div>
      </div>
      <Modal visible={visible} onOk={handleOk}
        onCancel={() => setVisible(false)} title="添加好友" className="wrapper">
           <Input onValueChange={handleContentChange} value={content} clearable  addonBefore="内容"/>
      </Modal> 
    </div>
  );
}

Person.displayName = 'Person'
export default Person;