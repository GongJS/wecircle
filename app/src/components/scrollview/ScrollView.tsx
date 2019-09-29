import React, { useEffect } from 'react';
import {Button} from 'redell-ui'
import './scrollview.scss';

interface ScrollViewProps extends React.HTMLAttributes<HTMLElement> {
  isend: boolean, // 是否到达最后一页
  readyToLoad: boolean,
  loadCallback: () => any // 下拉更新完回调
}


const ScrollView: React.FC<ScrollViewProps> = ({ children, isend,readyToLoad,loadCallback }) => {
  const isEndRef = React.useRef(false)
  isEndRef.current = isend
  const readyToLoadRef= React.useRef(false)
  readyToLoadRef.current = readyToLoad
  const onLoadPage = () => {
      //获取clientHeight
      let clientHeight = document.documentElement.clientHeight
      //获取scrollHeight
      let scrollHeight = document.body.scrollHeight
      //获取scrollTop这里注意要兼容一下，某些机型的document.documentElement.scrollTop可能为0
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //通知距离底部还有多少px的阈值
      let proLoadDis = 30
      //判断是否页面滚动到底部
      if ((scrollTop + clientHeight) >= (scrollHeight - proLoadDis)) {
        //是否已经滚动到最后一页
        if (!isEndRef.current) {
          //通知父组件触发滚动到底部事件
           // 判断在一个api请求未完成时不能触发第二次滚动到底部的回调
           if (!readyToLoadRef.current) {
            return
          }
          loadCallback()
        }
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', onLoadPage)
    return () =>  window.removeEventListener('scroll', onLoadPage)
  },[]) // eslint-disable-line
  return (
   
    <div className="scrollview">
      {children}
      {
        !isend ?
          <div className="loadmore">
            <Button type="primary" loading={true} >加载中</Button> </div>: null
      }
      {
        isend ? 
        <div className="line">
           <span className="tips"></span>
        </div>
        : null
      }
    </div>
  );
}

ScrollView.displayName = 'ScrollView'
export default ScrollView;