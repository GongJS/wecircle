import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { Input, Button } from 'redell-ui'
import { post } from '../../utils/http'
import { formateDate } from '../../utils/helper'
import NavBar from '../../components/navbar/NavBar'
import Empty from '../../components/empty/Empty'
import './friend.scss';

interface FriendProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

const Friend: React.FC<FriendProps> = () => {
  const [list, setList] = useState<any>([])
  const { history } = useReactRouter()
  const [keyword, setKeyWord] = useState('')
  const value = React.useRef('')
  value.current = keyword
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const handleChange = (value: string) => {
    setKeyWord(value)
  }
  const handleSearch = async () => {
    const res: any = await post('/api/user/search', { keyword: value.current, myId: user._id })
    if (res && res.code === 0) {
      setList(res.data[0])
    }
  }
  const clearClick = () => {
    setKeyWord('')
    handleSearch()
  }
  // 点击头像跳转到个人主页
  const goToPerson = (item: any) => {
    history.push({
      pathname: '/person',
      state: { ...item }
    })
  }
  useEffect(() => {
    handleSearch()
  }, []) // eslint-disable-line
  return (
    <div className="friend">
      <NavBar title="我的好友" />
      <div className="search-bar">
        <Input onValueChange={handleChange} value={keyword} clearable addonAfter="查找" extraClick={handleSearch} clearClick={clearClick} placeholder="手机号/用户名" />
      </div>
      {
        list.friend && list.friend.map((item: any) => {
          return (
            <div className="item" key={item._id} onClick={() => goToPerson(item)}>
              <img src={item.avatar} alt="" className="avatar" />
              <div className="right-content border-bottom">
                <p className="nickname">{item.nickname}</p>
              </div>
              <div className="time">{formateDate(item.create)}</div>
            </div>
          )
        })
      }
      {
        list.length === 0 ? <Empty title="暂无好友"></Empty> : null
      }
      <div className="add-friend">
        <Button type="success" icon="roundadd" iconPosition="right" onClick={() => history.push('/add')}>
          添加好友
      </Button>
      </div>
    </div>
  );
}

Friend.displayName = 'Friend'
export default Friend