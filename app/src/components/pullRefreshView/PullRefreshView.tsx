import React from 'react';
import './pullrefreshview.scss';

interface PullRefreshProps extends React.HTMLAttributes<HTMLElement> {
  refreshFun: () => any
}
interface refresh {
  dragStart: null | number
  percentage: number
  dragThreshold: number
  moveCount: number
  joinRefreshFlag: null | boolean
}

const PullRefreshView: React.FC<PullRefreshProps> = ({ refreshFun, children }) => {
  const circleIcon = React.useRef<any>()
  const circleIconInner = React.useRef<any>()
  const pullRefresh: refresh = {
    dragStart: null, // 开始抓取标志位
    percentage: 0, // 拖动量的百分比
    dragThreshold: 0.3, // 临界值，
    moveCount: 200, // 位移系数，可以调节圆形图片icon运动的速率
    joinRefreshFlag: null // 进入刷新状态标志位，为了在touchend时有标示可以判断
  }
  const touchstart: React.TouchEventHandler = (e) => {
    pullRefresh.dragStart = e.targetTouches[0].clientY
    circleIcon.current && (circleIcon.current.style.webkitTransition = 'none')
  }
  const touchmove: React.TouchEventHandler = (e) => {
    // 如果没有touchstart设置的值，说明没进入下拉状态，不影响正常的滚动
    if (pullRefresh.dragStart === null) {
      return
    }
    // 获取手指的一个target
    let target = e.targetTouches[0]
    // 根据起始位置和屏幕高度计算一个相对位移量，正值为向上拖动，负值为向下拖动
    pullRefresh.percentage = (pullRefresh.dragStart - target.clientY) / window.screen.height
    // 获取scrollTop，为了判断是否在页面顶部
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // 当页面处于顶部时，才能进入下拉刷新的逻辑
    if (scrollTop === 0) {
      // 当向下拖动时，才能进入下拉刷新的逻辑
      if (pullRefresh.percentage < 0 ) {
        // 将进入下拉刷新刷新标志位true
        pullRefresh.joinRefreshFlag = true
        // 根据moveCount速率系数计算位移的量
        let translateY = -pullRefresh.percentage * pullRefresh.moveCount
        // 当位移到一定程度，还没达到临界值时，不断去位移和旋转圆形icon
        if (Math.abs(pullRefresh.percentage) <= pullRefresh.dragThreshold) {
          // 计算圆形icon旋转的角度
          let rotate = translateY / 30 * 360
          // 位移和旋转圆形icon，利用translate3d和rotate属性
          circleIcon.current && (circleIcon.current.style.webkitTransform = 'translate3d(0,' + translateY + 'px,0) rotate(' + rotate + 'deg)')
        }
      } else {
        // 向上拖动就没有进入下拉，要清除下拉刷新刷新标志位true
        if (pullRefresh.joinRefreshFlag == null) {
          pullRefresh.joinRefreshFlag = false
        }
      }
    } else {
      // 清除下拉刷新刷新标志位true
      if (pullRefresh.joinRefreshFlag == null) {
        pullRefresh.joinRefreshFlag = false
      }
    }
  }
  const touchend: React.TouchEventHandler = () => {
    const innerEle = circleIconInner.current
    const iconEle = circleIcon.current
    // 如果没有touchstart设置的值，说明没进入下拉状态，不影响正常的滚动
    if (pullRefresh.percentage === 0) {
      return
    }
    // 在手指离开时，位移量达到临界值时，并且也有进入下拉刷新的标志位，就表明要触发正在刷新
    if (Math.abs(pullRefresh.percentage) > pullRefresh.dragThreshold && pullRefresh.joinRefreshFlag) {
      // 通知父元素触发正在刷新
      refreshFun()
      // 给circleIconInner一个正在旋转的动画，利用css的animation实现
      innerEle && innerEle.classList.add('circle-rotate')
      setTimeout(() => {
        innerEle && innerEle.classList.remove('circle-rotate')
        iconEle && (iconEle.style.webkitTransition = '330ms')
        iconEle && (iconEle.style.webkitTransform = 'translate3d(0,0,0) rotate(0deg)')
      }, 700)
      // 700ms之后，动画结束，立刻收起
    } else {
      // 在手指离开时，位移量没有达到临界值，就自动收回，通过transition，设定一个终止值即可。
      if (pullRefresh.joinRefreshFlag) {
        iconEle && (iconEle.style.webkitTransition = '330ms')
        iconEle && (iconEle.style.transform = 'translate3d(0,0,0) rotate(0deg)')
      }
    }
    // 重置joinRefreshFlag
    pullRefresh.joinRefreshFlag = null
    // 重置percentage
    pullRefresh.dragStart = null
    // 重置percentage
    pullRefresh.percentage = 0
  }

  return (
      <div className="pullRefreshView" onTouchMove={touchmove} onTouchStart={touchstart} onTouchEnd={touchend}>
        <div ref={circleIcon} className="circle-icon">
          <div ref={circleIconInner} className="circle-icon-inner"></div>
        </div>
        {children}
      </div>
  );
}

PullRefreshView.displayName = 'PullRefreshView'
export default PullRefreshView;