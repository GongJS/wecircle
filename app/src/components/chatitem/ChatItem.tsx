import React from 'react';
import './chatitem.scss';

interface ChatItemProps extends React.HTMLAttributes<HTMLElement> {
  data: any
}
interface ImgProps {
  width?: number
  height?: number
  url?: string
}
const pxtovw = (px: number) => {
  return (px / 375 * 100) + 'vw'
}
const ChatItem: React.FC<ChatItemProps> = ({ data }) => {
  const imgOneStyle = (item: ImgProps):{} => {
    let height = null
    let width = null
    // 如果图片是长图则给定最大的长度
    if (item.height! > item.width!) {
      height = Math.min(123, item.height!)
      // 根据比例设置宽度
      width = height * item.width! / item.height!
    } else { // 如果图片是宽图则给定固定的宽度
      width = Math.min(120, item.width!)
      // 根据比例设置高度
      height = width * item.height! / item.width!
    }
    // 转换成vw单位
    return {
      height: `${pxtovw(height)}`,
      width: `${pxtovw(width)}`
    }
  }
  const showImage = () => {

  }
  return (
    <div className={data.mine ? 'chat-item chat-item-mine':'chat-item'}>
    <img className="avatar" src={data.fromUser.avatar} alt='' />
    <div className="right-content">
      <p className="nickname one-line">{data.fromUser.nickname}</p>
      {
        data.content.type === 'str' ? <div className="chat-text left-arrow">{data.content.value}</div> : 
        <img onClick={showImage}  style={imgOneStyle(data.content.value)} className="chat-image" src={data.content.value.url} alt=""/> 
      }
    </div>
  </div>
  );
}

ChatItem.displayName = 'ChatItem'
export default ChatItem;