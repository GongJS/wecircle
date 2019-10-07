import React, { useState } from 'react';
import useReactRouter from 'use-react-router'
import { Input,Loading } from 'redell-ui'
import { post } from '../../../utils/http'
import NavBar from '../../../components/navbar/NavBar'
import Empty from '../../../components/empty/Empty'
import './add.scss';

interface AddProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}


const Add: React.FC<AddProps> = () => {
  const [list, setList] = useState([])
  const [loading,setLoading] = useState(false)
  const [keyword, setKeyWord] = useState('')
  const [showEmpty, setShowEmpty] = useState(false)
  const { history } = useReactRouter()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const handleKeyWordChange = (keyword: string) => {
    setKeyWord(keyword)
  }
  const handleSearch = async () => {
    setLoading(true)
    const res: any = await post('/api/user/search', { keyword })
    setShowEmpty(true)
    const filter = res.data.filter((v:any) => v._id !== user._id)
    setList(filter)
    setLoading(false)
  }
  const goToPerson = (item:any) => {
    history.push({
      pathname: '/person',
      state: { ...item }
    })
  }
  return (
    <div className="add">
      <NavBar title="添加好友" />
      <div className="search-bar">
        <Input onValueChange={handleKeyWordChange} value={keyword} clearable addonAfter="查找" extraClick={handleSearch} placeholder="手机号/用户名"/>
      </div>
      <Loading name='loading' message="获取中..." loading={loading}/>
      {
        list.map((item: any) => {
          return (
            <div className="item" key={item._id} onClick={() => goToPerson(item)}>
              <img src={item.avatar} alt="" className="avatar" />
              <div className="right-content border-bottom">
                <p className="nickname">{item.nickname}</p>
              </div>
            </div>
          )
        })
      }
      {
        list.length === 0 && showEmpty? <Empty title="用户不存在"></Empty> : null
      }
    </div>
  );
}

Add.displayName = 'Add'
export default Add