
import React, { createRef, useContext, useLayoutEffect, useState } from 'react';
// import KeepAlive, { AliveScope,useActivate, useUnactivate} from 'react-activation'
import { Upload,UploadHandles,message } from 'redell-ui'
import useReactRouter from 'use-react-router';
import HeaderBar from '../../components/headerbar/HeaderBar'
import PostItem from '../../components/postItem/PostItem'
import ScrollView from '../../components/scrollview/ScrollView'
import PullRefreshViewm from '../../components/pullRefreshView/PullRefreshView'
import { StoreContext } from '../../store'
import { get,post } from '../../utils/http'
import './index.scss'
interface FileListProps {
  name?: string
  uid?: string
  status?: string
  url?: string
}
interface PostItemProps {
  [propName: string]: any;
}

const Index: React.FC<PostItemProps> = (props) => {
  const topImgRef = createRef<HTMLDivElement>()
  const [page, setPage] = useState(1)
  const pageRef = React.useRef(1)
  pageRef.current = page
  const { state, dispatch } = useContext(StoreContext);
  const [isend, setIsend] = useState(false)
  const [readyToLoad,setReadyToLoad] = useState(true)
  const { history } = useReactRouter();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') ||  '{}'))
  let per_page = 3
  const uploadRef = React.useRef<UploadHandles>(null)
  const [fileList, setFileList] = useState<FileListProps[]>([])
  const topbg = require('../../assets/images/topbg.jpg')
  const missing_face = require('../../assets/images/missing_face.png')

  // 更换背景图回调
  const onFileChange = (newFileList: FileListProps[]) => {
    setFileList(newFileList)
    newFileList.forEach(async v => {
      if (v.status === 'success') {
        const copy = JSON.parse(JSON.stringify(user))
        copy.bgurl = v.url
        localStorage.setItem('user', JSON.stringify(copy))
        try {
          await post('/api/user/update', { key: 'bgurl', value:v.url, phone: user.phone })
          message.success('背景图更新成功')
          setUser(JSON.parse(localStorage.getItem('user')!))
        } catch(err) {
          message.error(err)
        }
      }
    })
  }
  const handleClickUpload = () => {
    uploadRef.current && uploadRef.current.upload()
  }

  // 点击头像跳转
  const handlecClickAvatar = () => {
    if (user._id) {
      history.push('/info')
    } else {
      history.push('/login')
    }
  }
  // 第一次获取朋友圈数据
  const initCirclePost = async () => {
    setIsend(false)
    setPage(1)
    const res: any = await get(`/api/post/getpost?page=1&&per_page=${per_page}`)
    if (res && res.code === 0) {
      dispatch({ type: 'initCirclePost', postList: res.data})
    }
  }
  // 下拉刷新获取朋友圈数据
  const getpost = async () => {
      setReadyToLoad(false)
      const res: any = await get(`/api/post/getpost?page=${pageRef.current}&&per_page=${per_page}`)
      if (res && res.code === 0) {
        if (res.data.length === 0) {
          setIsend(true)
        }
        dispatch({ type: 'addCirclePost', postList: res.data })
        setReadyToLoad(true)
      }
  }
  // 下拉到底部触发更新
  const loadCallback = () => {
    setPage(page => page + 1)
    getpost()
  }
  useLayoutEffect(() => {
    initCirclePost()
  }, [])  // eslint-disable-line
  return (
    <PullRefreshViewm refreshFun={initCirclePost}>
      <div className="index">
        <HeaderBar />
        <div ref={topImgRef} className="top-img" style={{ backgroundImage: `url(${user.bgurl || topbg})` }} onClick={handleClickUpload}></div>
        <div className="name-info"  >
          <p className="nickname">{user.nickname || '游客账户'}</p>
          <img src={user.avatar || missing_face} className="avatar" alt="" onClick={handlecClickAvatar} />
        </div>
        <ScrollView isend={isend} readyToLoad={readyToLoad} loadCallback={loadCallback}>
          {
            state.postList.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PostItem item={item} getpost={getpost} />
                </div>
              )
            })
          }
        </ScrollView>
        <Upload style={{display:'none'}} ref={uploadRef} fileList={fileList} action={'http://101.132.117.183:7001/api/upload'} name="bg" onFileChange={onFileChange} />
      </div>
    </PullRefreshViewm>
  );
}

export default Index;