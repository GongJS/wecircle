import React, { useState, useEffect } from 'react';
import {Button} from 'redell-ui'
import {post} from '../../utils/http'
import {formateDate} from '../../utils/helper'
import NavBar from '../../components/navbar/NavBar'
import './requestlist.scss';

interface RequestListProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}


const RequestList: React.FC<RequestListProps> = () => {
  const [list, setList] = useState([])
  const user = JSON.parse(localStorage.getItem('user') ||  '{}')
  const getRequestList = async () => {
    const res:any = await post('/api/request/getlist',{myId:user._id})
    setList(res.data)
  }
  const handleAgree = async (item:any) => {
    const res:any = await post('/api/request/agree',{myId:user._id,requestId:item._id,fromUserId:item.fromUser._id})
    if (res && res.code === 0) {
      getRequestList()
    }
  }
  const handleReject = async (item:any) => {
    const res:any = await post('/api/request/reject',{requestId:item._id})
    if (res && res.code === 0) {
      getRequestList()
    }
  }
  useEffect(() => {
    getRequestList()
  },[]) // eslint-disable-line
  return (
    <div className="request-list">
      <NavBar title="我的请求" />
      {
        list.map((item:any) => {
          return (
            <div className="item" key={item._id}>
              <img src={item.fromUser && item.fromUser.avatar} alt="" className="avatar"/>
              <div className="right-content border-bottom">
                <p className="nickname">{item.fromUser && item.fromUser.nickname}</p>
                  <p className="text one-line">{item.content}</p>
                  <div className="action">
                    {
                      item.status === 'pedding' ? 
                      <>
                      <Button type="success" onClick={() => handleAgree(item)}>同意</Button>
                      <Button type="danger" onClick={() => handleReject(item)}>拒绝</Button>
                      </> : item.status === 'agree' ? <span>已同意</span> : <span>已拒绝</span>
                    }
                  </div>
              </div>
              <div className="time">{formateDate(item.create)}</div>
            </div>
          )
        })
      }
    </div>
  );
}

RequestList.displayName = 'RequestList'
export default RequestList