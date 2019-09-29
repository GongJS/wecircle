import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import ReactDOM from 'react-dom'
import useReactRouter from 'use-react-router';
import { Slide, message } from 'redell-ui'
import { StoreContext } from '../../store'
import { post } from '../../utils/http'
import { formateDate } from '../../utils/helper'
import os from '../../utils/os'
import InputBar, { InputBarHandles } from '../inputbar/InputBar'
import './post-item.scss';

interface PostItemProps {
  [propName: string]: any;
}
interface img {
  url: string
  height?: number
  width?: number
}

const PostItem: React.FC<PostItemProps> = (props) => {
  const [showPanel, setShowPanel] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [comment, setComment] = useState()
  const [slideList, setSlideList] = useState()
  const [index, setIndex] = useState()
  const indexRef = React.useRef<string>()
  indexRef.current = index
  const [visible, setVisible] = useState(false)
  const [pageY, setPageY] = useState()
  const iosInput = os.isIOS
  const androidInput = os.isAndroid
  const inputbarWrapRef = React.useRef<HTMLDivElement>(null)
  const inputbarRef = React.useRef<InputBarHandles>(null)
  const { history } = useReactRouter()
  const { state, dispatch } = useContext(StoreContext); // eslint-disable-line
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 监听评论内容
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }

  // 处理评论框位置
  const handleComment = (e: React.MouseEvent) => {
    if (!user._id) {
      message.info('请先登录')
      return
    }
    const ele = inputbarRef.current
    e.stopPropagation()
    setShowInput(!showInput)
    setShowPanel(false)
    ele && ele.focusInput()
    if (os.isIOS) {
      // 设置input在手指点击的那个位置出现10表示稍向下移动一些
      inputbarWrapRef.current && (inputbarWrapRef.current.style.top = (pageY - 10) + 'px')
      setTimeout(() => {
        // 输入框的位置剪去键盘的高度剪去位置微调系数45 ： 5
        let y = pageY - (window as any).keyboardHeight - (os.isIpP ? 45 : 5)
        // 通过调用window.scroll在将页面顶回去一定距离
        window.scroll(0, y)
      }, 300)
    }
  }

  // 发表评论
  const saveComment = async () => {
    if (!user._id) {
      message.info('请先登录')
      return
    }
    const res: any = await post(`/api/savecomment`, { postId: props.item._id, userId: user._id, content: comment })
    if (res && res.code === 0) {
      inputbarRef.current!.blurInput()
      setShowInput(false)
      dispatch({ type: 'updateCirclePost', post: res.data })
    }
  }

  // 关闭评论输入框
  const closeInput = () => {
    setTimeout(() => {
      setShowInput(false)
    })
  }

  // 点赞
  const handleLike = async () => {
    if (!user._id) {
      message.info('请先登录')
      return
    }
    setShowInput(false)
    const res: any = await post(`/api/post/${hasLike() ? 'dislike' : 'like'}`, { postId: props.item._id, userId: user._id })
    if (res.code === 0) {
      dispatch({ type: 'updateCirclePost', post: res.data })
      setShowPanel(false)
    }
  }
  
  // 是否点赞过
  const hasLike = () => {
    const likes = props.item && (props.item.like as any).map((item: any) => item._id)
    return likes.includes(user._id)
  }

  // 处理 点赞/评论 面板
  const handlePanel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPageY(e.pageY)
    setShowPanel(!showPanel)
    setShowInput(false)
  }
  const pxtovw = (px: number) => {
    return (px / 375 * 100) + 'vw'
  }

  // 图片样式转换
  const imgOneStyle = (item: any): {} => {
    let height = null
    let width = null
    if (!item.height) {item.height = 500}
    if (!item.width) {item.width = 500}
    // 如果图片是长图则给定最大的长度
    if (item.height > item.width) {
      height = Math.min(200, item.height)
      // 根据比例设置宽度
      width = height * item.width / item.height
    } else { // 如果图片是宽图则给定固定的宽度
      width = Math.min(200, item.width)
      // 根据比例设置高度
      height = width * item.height / item.width
    }
    // 转换成vw单位
    return {
      height: `${pxtovw(height)}`,
      width: `${pxtovw(width)}`
    }
  }

  // 放大图片展示
  const handleImgClick = (index: number) => {
    setIndex(`${index}`)
    setVisible(true)
  }

  // 关闭图片展示
  const onClose = () => {
    setIndex('0')
    setVisible(false)
  }

  // 点击头像跳转到个人主页
  const goToPerson = () => {
    if (props.item.user._id === user._id) {
      return
    }
    history.push({
      pathname: '/person',
      state: { ...props.item.user }
    })
  }

  // 处理全局click事件
  const globalClick:React.MouseEventHandler = (e) => {
    setShowPanel(false)
  }

  useLayoutEffect(() => {
    (window as any).windowHeightOrgin = window.innerHeight;
    (window as any).keyboardHeight = os.getKeyBoardHeightDefault() - (window.screen.height - (window as any).windowHeightOrgin)
  })
  useEffect(() => {
    const slideListCopy: img[] = []
    props.item && props.item.picList.forEach((item: any) => {
      let v = { url: '', width: 0, height: 0 }
      if (item) {
        v.url = item.url!
        v.width = item.width!
        v.height = item.height!
        slideListCopy.push(v)
      }
    })
    setSlideList(slideListCopy)
  }, [props.item])

  const iosInputBar = <div style={{ zIndex: showInput ? 999 : -1, opacity: showInput ? 1 : 0 }} ref={inputbarWrapRef} className="postitem-input-wrap ios">
    <InputBar ref={inputbarRef} hanldeClick={saveComment} onChange={handleChange} closeInput={closeInput} content={comment} /></div>

  const androidInputBar = <div style={{ opacity: showInput ? 1 : 0, bottom: showInput ? '0' : '-60px' }} ref={inputbarWrapRef} className="postitem-input-wrap android" >
    <InputBar ref={inputbarRef} hanldeClick={saveComment} onChange={handleChange} closeInput={closeInput} content={comment} />
  </div>

  const container = document.querySelector('.index')

  return (
    <div className="post-item border-bottom" onClick={globalClick}>
      <div className="avatar-wrap" onClick={goToPerson}>

        <img src={props.item && props.item.user ? props.item.user.avatar : ''} alt="" />
      </div>
      <div className="content-info">
        <p className="nickname">
          {props.item && props.item.user ? props.item.user.nickname : ''}
        </p>
        <div className="post-content">
          {props.item && props.item.user ? props.item.content : ''}
        </div>
        {
          props.item && props.item.picList.length > 1 ?
            <div className="img-content">
              {
                props.item.picList.map((v: any, index: number) => {
                  return (
                    <div className="img-wrap" style={{ backgroundImage: `url(${v.url})` }} key={index} onClick={() => handleImgClick(index)}></div>
                  )
                })
              }
            </div> :
            <div className="img-content-one">
              <img onClick={() => handleImgClick(0)} src={props.item && props.item.picList[0] ? props.item.picList[0].url : ''} alt="" style={props.item && props.item.picList[0] ? imgOneStyle(props.item.picList[0]) : undefined} />
            </div>
        }
        <div className="time">{props.item && formateDate(props.item.create)}</div>
        <div className="opera-box" onClick={handlePanel}>
          {
            showPanel ? <div className="box-panel-wrap">
              <div className="box-panel">
                <div className="like-box" onClick={handleLike}>
                  <div className="like-icon"></div>
                  <div className="like-text">{hasLike() ? '取消' : '赞'}</div>
                </div>
                <div className="divider"></div>
                <div className="comment-box" onClick={handleComment}>
                  <div className="comment-icon"></div>
                  <div className="comment-text">评论</div>
                </div>
              </div>
            </div> : null
          }
        </div>
        {
          props.item.like.length > 0 || props.item.comment.length > 0 ?
            <div className="comment-list">
              <div className="like-content border-bottom" style={{ display: props.item.like.length > 0 ? 'block' : 'none' }}>
                <div className="like-heart-icon"></div>
                {
                  props.item && props.item.like.map((item: any, index: number) => {
                    return (
                      <span className="like-nickname" key={index}>{item.nickname}{index < (props.item.like.length - 1) ? ',' : ''} </span>
                    )
                  })
                }
              </div>
              <div className="comment-item border-top" style={{ display: props.item.comment.length > 0 ? 'block' : 'none' }}>
                {
                  props.item && props.item.comment.map((item: any, index: number) => {
                    return (
                      <div key={index}>
                        <div className="comment-nickname" >{item && item.user && item.user.nickname}</div>
                        <div>{item.content}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div> : null
        }

      </div>
      {
        iosInput && container ? ReactDOM.createPortal(
          iosInputBar, container
        ) : null
      }
      {
        androidInput && container ? ReactDOM.createPortal(
          androidInputBar, container
        ) : null
      }
      {
        props.item && props.item.picList.length > 0 && index ? <Slide list={slideList} visible={visible} onClose={onClose} defaultIndex={indexRef.current} /> : null
      }
    </div>
  );
}

PostItem.displayName = 'PostItem'
export default PostItem