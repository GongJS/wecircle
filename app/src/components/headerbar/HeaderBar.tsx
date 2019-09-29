import React, { useEffect, useState } from 'react';
import {message} from 'redell-ui'
import useReactRouter from 'use-react-router';
import {combineClass} from '../../utils/helper'
import {Icon} from 'redell-ui'
import './headerbar.scss';

const HeaderBar: React.FC= () => {
  const [visible, setVisible] = useState(false)
  const {history} = useReactRouter()
  const user = JSON.parse(localStorage.getItem('user') ||  '{}')
  const barEle = React.useRef<HTMLDivElement>(null)
  const goToPost = () => {
    if (!user._id) {
      message.info('请先登录')
      return
    } else {
      history.push('/post')
    }
  }
  const hanldeScroll = () => {
    document.addEventListener('scroll', () => {
      const imgEle = document.querySelector('.top-img')
      if (barEle.current && imgEle) {
        if (imgEle.getBoundingClientRect().top < -100) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }
    })
  }
  useEffect(() => {
   hanldeScroll()
   return () => document.removeEventListener('scroll', hanldeScroll)
  },[])
  return (
    <div className={combineClass('header-bar', `${visible ? 'show' : ''}`)} ref={barEle}>
        <p className="title" style={{display: visible? 'block' : 'none'}}>Wecircle</p>
        <Icon name="cameraaddfill" color={!visible? '#fff' : '#000'} size="1.8em" className="right-icon" onClick={goToPost}/>
    </div>
  );
}
HeaderBar.displayName = 'HeaderBar'
export default HeaderBar;