import React, { useState } from 'react';
import useReactRouter from 'use-react-router';
import { Upload, Icon, Button, Textarea, Slide, message, Loading } from 'redell-ui'
import { post } from '../../utils/http'
import './post.scss'

interface ImgListProps {
  name?: string
  uid?: string
  status?: string
  url?: string
  width?: number
  height?: number
}

interface img {
  url: string
  height?: number
  width?: number
}
const Post: React.FC = () => {
  const [imgList, setImgList] = useState<ImgListProps[]>([])
  const [slideList, setSlideList] = useState()
  const [index, setIndex] = useState('0')
  const [content, setContent] = useState('')
  const [strLen, setStrLen] = useState(0)
  const [imgLen, setImgLen] = useState(0)
  const [visible, setVisible] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') ||  '{}')
  const { history } = useReactRouter();
  const [loading, setLoading] = useState(false)

  const handleChange = (val:string) => {
    const value = val
    if (strLen < 70 || value.length < content.length) {
      setContent(value)
      setStrLen(value.length)
      if (value.length > 70) {
        const slice = value.slice(0,70)
        setContent(slice)
        setStrLen(70)
      }
    }
  }
  const onFileChange = (newImgList: ImgListProps[]) => {
    setImgList(newImgList)
    const slideListCopy: img[] = []
    newImgList.forEach(item => {
      let v = { url: '', width: 0, height: 0 }
      if (item) {
        v.url = item.url!
        v.width = item.width!
        v.height = item.height!
        slideListCopy.push(v)
      }
    })
    setSlideList(slideListCopy)
    setImgLen(slideListCopy.length)
  }
  const handleImgClick = (imgSrc: string, index: string) => {
    setIndex(index)
    setVisible(true)
  }
  const publish = async () => {
    if (content === '' ) {
      message.info('请填写内容')
      return
    }
    setLoading(true)
    const res:any = await post('/api/post/savepost', { content, picList: imgList, myId: user._id })
    setLoading(false)
    if (res && res.code === 0) {
      history.push('/')
    } else {
      message.error(res.message)
    }
  }
  const onClose = () => {
    setIndex('0')
    setVisible(false)
  }
  return (
    <Loading name="spin" message="上传中..." loading={loading}>
    <div className="post">
      <div className="header">
        <span onClick={() => history.push('/')}>取消</span>
        <Button type="success" onClick={publish}>发表</Button>
      </div>
      <Textarea className="content" placeholder={'这一刻的想法'} onValueChange={handleChange} value={content}/>
      <div className="textarea-counter">
        {strLen}/70
      </div>
      <Upload action={'/api/upload'} name="post" fileList={imgList} onFileChange={onFileChange} handleImgClick={handleImgClick}>
      {
        imgLen < 5 ?  <div className="r-upload-action">
        <Icon name="add_light" />
      </div> : null
      }
      </Upload>
      <div className="img-counter">
        {imgLen}/5
      </div>
      
      <Slide list={slideList} visible={visible} onClose={onClose} defaultIndex={index} />
    </div>
    </Loading>
  );
}

export default Post;