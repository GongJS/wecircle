
import React, { useState } from 'react';
import useReactRouter from 'use-react-router';
import {Icon,Upload,UploadHandles, message} from 'redell-ui'
import { post } from '../../utils/http'
import EditItem from '../../components/editItem/EditItem'
import NavBar from '../../components/navbar/NavBar'
import './info.scss'

interface FileListProps {
  name?: string
  uid?: string
  status?: string
  url?: string
}

const Info: React.FC = () => {
  const [visibleEditItem, setVisibleEditItem] = useState(true)
  const [title, setTitle] = useState()
  const [value, setValue] = useState()
  const [type, setType] = useState()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') ||  '{}'))
  const { history } = useReactRouter();
  const uploadRef = React.useRef<UploadHandles>(null)
  const [fileList, setFileList] = useState<FileListProps[]>([])
   
  // 更换头像回调
  const onFileChange = (newFileList: FileListProps[]) => {
    setFileList(newFileList)
    newFileList.forEach( async v => {
      if(v.status === 'success') {
        const copy = JSON.parse(JSON.stringify(user))
        copy.avatar= v.url
        localStorage.setItem('user', JSON.stringify(copy))
        setUser(JSON.parse(localStorage.getItem('user')!))
        try {
          await post('/api/updateuserinfo', { key: 'avatar', value:v.url, phone: user.phone })
          message.success('头像更新成功')
        } catch(err) {
          message.error(err)
        }
      }
    })
  }
  const handleClickUpload = () => {
    uploadRef.current && uploadRef.current.upload()
  }

  const goBack = () => {
    setVisibleEditItem(true)
  }
  // 监听text
  const onChange = (value: string) => {
    setValue(value)
  }
  // 要更新到属性
  const handleClickItem = (type:string,title: string) => {
    setTitle(title)
    setValue(user[type])
    setVisibleEditItem(false)
    setType(type)
  }
  // 更新用户信息
  const update = async () => {
    const res: any = await post('/api/updateuserinfo', { key: type, value, phone: user.phone })
    if (res && res.code === 0) {
      const copy = JSON.parse(JSON.stringify(user))
      copy[type]= value
      setUser(copy)
      localStorage.setItem('user', JSON.stringify(copy))
    }
    setVisibleEditItem(true)
  }
  // 退出登录
  const logOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    history.push('/')
  }
  return (
      visibleEditItem ?  <div className="info">
     <NavBar title="个人信息"/>
      <div className="content">
        <div className="panel">
          <div className="item border-bottom">
            <div className="cell">
              <p>头像</p>
              <img src={user.avatar} alt="" className="avatar" onClick={handleClickUpload}/>
              <Icon name="right" color="#999" />
            </div>
          </div>
          <div className="item border-bottom" onClick={() => handleClickItem('nickname','更改用户名')}>
            <div className="cell">
              <p>名字</p>
              <div className="right">{user.nickname}</div>
              <Icon name="right" color="#999" />
            </div>
          </div>
          <div className="item border-bottom" onClick={() => handleClickItem('desc', '更改个性签名')}>
            <div className="cell">
              <p>个性签名</p>
              <div className="right">{user.desc}</div>
              <Icon name="right" color="#999" />
            </div>
          </div>
          <div className="item border-bottom">
            <div className="cell">
              <p>性别</p>
              <div className="right">男</div>
              <Icon name="right" color="#999" />
            </div>
          </div>
          <div className="item">
            <div className="cell">
              <p>电话号码</p>
              <div className="right">{user.phone}</div>
            </div>
          </div>
        </div> 
        <div className="panel">
          <div className="item item-msg" style={{flexDirection: 'column'}}>
          <div className="cell border-bottom" style={{paddingBottom: '10px'}}onClick={() =>history.push('/chatlist')}>
              <p className="msg">私信</p>
              <Icon name="right" color="#999" />
            </div>
            <div className="cell" onClick={logOut} style={{paddingTop: '10px'}}>
              <p className="msg">退出</p>
              <Icon name="right" color="#999" />
            </div>
          </div>
        </div>
        <Upload style={{display:'none'}} ref={uploadRef} fileList={fileList} action={'http://101.132.117.183:7001/api/upload'} name="avatar"  onFileChange={onFileChange}/>
      </div>
    </div> : <EditItem goBack={goBack} title={title} value={value} onChange={onChange} update={update} />
  );
}

export default Info;