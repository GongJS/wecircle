import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router'
import io from 'socket.io-client';
import Navbar from '../../components/navbar/NavBar'
import ChatItem from '../../components/chatitem/ChatItem'
import InputBar, { InputBarHandles } from '../../components/inputbar/InputBar'
import os from '../../utils/os'
import {post} from '../../utils/http'
import './chat.scss';
import { message } from 'redell-ui';

interface ChatProps {
  [propName: string]: any;
}

interface ImgProps {
  width?: number
  height?: number
  url?: string
}
const Chat: React.FC<ChatProps> = (props) => {
  const [data, setData] = useState<any[]>([])
  const [content, setContent] = useState('')
  const chatView = React.useRef<HTMLDivElement>(null)
  const inputbarRef = React.useRef<InputBarHandles>(null)
  const [bottomClass, setBottomClass] = useState('bottom-view')
  const { history } = useReactRouter()
  const user= JSON.parse(localStorage.getItem('user') ||  '{}')
  const socket = io('http://101.132.117.183:7001', {transports: ['websocket']})

  // 获取聊天记录
  const gethistory = async () => {
    if(!props.location.state) {
      history.push('/')
      return
    }
    const res:any = await post('/api/message/gethistory', {myId: user._id, toUserId:props.location.state._id })
    if (res && res.code === 0) {
      setData(res.data)
      scrollToEnd(false)
    }
  }

  // 显示+号
  const showBottom = () => {
    if (bottomClass.indexOf('show') > -1) {
      setBottomClass('bottom-view')
    } else {
      setBottomClass(bottomClass => bottomClass + ' show')
    }
  }

  const closePanel = () => {
    setBottomClass('bottom-view')
    inputbarRef.current!.closePanel()
  }
  const scrollToEnd = (immediate: boolean) => {
    const ele = chatView.current
    if (immediate) {
      ele && (ele.scrollTop = ele.scrollHeight)
      return
    }
    setTimeout(() => {
      ele && (ele.scrollTop = ele.scrollHeight)
    }, 200)
  }
  const hideBottomOnPanel = () => {
    // 将聊天界面滚动到底部，看到最新的聊天内容
    scrollToEnd(true)
    // 此时图片操作面板处于展开状态时
    if (bottomClass.indexOf('show') > -1) {
      if (os.isIOS) {
        // 将页面在顶回去
        window.scroll(0, 70) // 键盘高度-图片操作面板高度+输入框高度
      } else {
        // Android无需修改，直接将图片操作面板隐藏即可
        closePanel()
      }
    }
  }
  const touchstart = () => {
    closePanel()
    inputbarRef.current!.blurInput()
  }
  const initSocket = () => {
    socket.on('connect', () => {
      console.log('connect')
      socket.emit('login', {...user});
    });
    socket.on('disconnect', () => {
      console.log('disconnect')
    });
    socket.on('recieveMsg', (res: any) => {
      console.log('receiveMsg')
      const newContent = {
        content: res.content,
        fromUser: res.fromUser,
        mine: false
      }
      setData(data => data.concat(newContent))
      scrollToEnd(false)
    });
    socket.on('error', (err: any) => {
      console.log(err)
    });
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.currentTarget.value)
  }
  const uploadImg = async (img:ImgProps) => {
    const newContent = {
      content: { type: 'pic', value: img },
      fromUser: user,
      mine: true
    }
    setData(data => data.concat(newContent))
    setContent('')
    scrollToEnd(false)
    const res:any = await post('/api/message/save', { myId: user._id, toUserId: props.location.state._id, content: { type: 'pic', value: img }})
    if (!res || res.code !== 0) {
      message.error('发送失败')
    }
  }
  const addMsg = async () => {
    if (content === '') return
    const newContent = {
      content: { type: 'str', value: content },
      fromUser: user,
      mine: true
    }
    setData(data => data.concat(newContent))
    setContent('')
    scrollToEnd(false)
    const res:any = await post('/api/message/save', { myId: user._id, toUserId: props.location.state._id, content: { type: 'str', value: content }})
    if (!res || res.code !== 0) {
      message.error('发送失败')
    }
  }
  useEffect(() => {
    gethistory()
    initSocket()
    return () => {socket.emit('loginout', {...user})};
  }, []) //eslint-disable-line
  return (
    <div className="chat">
      <Navbar title={props.location && props.location.state && props.location.state.nickname} />
      <div className="chat-view" ref={chatView}>
        {
          data.map((item, index) => {
            return (
              <div key={index} className="chat-view" onTouchStart={touchstart}>
                <ChatItem data={item} />
              </div>

            )
          })
        }
      </div>
      <div className={bottomClass} >
        <InputBar ref={inputbarRef} content={content} showPlus={true} showBottom={showBottom} hideBottomOnPanel={hideBottomOnPanel} onChange={handleChange} hanldeClick={addMsg} uploadImg={uploadImg}/>
      </div>
    </div>
  );
}

Chat.displayName = 'Chat'
export default Chat;