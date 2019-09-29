import React, { useImperativeHandle, useState } from 'react';
import { Button, Upload, UploadHandles } from 'redell-ui'
import './inputbar.scss';

export interface InputBarHandles {
  blurInput(): void;
  focusInput(): void;
  closePanel(): void;
}

interface InputBarProps {
  hanldeClick?: () => any
  closeInput?: () => any
  showBottom?: () => any
  hideBottomOnPanel?: () => any
  uploadImg?: (src: ImgProps) => any
  content?: string
  onChange?: React.ChangeEventHandler
  showPlus?: boolean
}

interface FileListProps {
  name?: string
  uid?: string
  status?: string
  url?: string
}
interface ImgProps {
  width?: number
  height?: number
  url?: string
}
const InputBar: React.RefForwardingComponent<InputBarHandles, InputBarProps> = ({ hanldeClick, onChange, content, closeInput, showPlus, showBottom, hideBottomOnPanel, uploadImg }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const uploadRef = React.useRef<UploadHandles>(null)
  const [fileList, setFileList] = useState<FileListProps[]>([])
  const [panelShow, setPanelShow] = useState(false)
  const showPanel = () => {
    setPanelShow(true)
    showBottom && showBottom()
  }
  const focusInput = () => {
    if (!showPlus) {
      setTimeout(() => {
        // 键盘在页面底部时在获取
        if (!panelShow) {
          // 键盘呼起前剪去键盘呼起后
          let kh = (window as any).windowHeightOrgin - window.innerHeight
          if (kh > 0) {
            // 由于一些webview上下底部有导航栏，所以我们需要剪去这部分高度
            (window as any).keyboardHeight = kh - (window.screen.height - (window as any).windowHeightOrgin)
            // weui.toast(window.windowHeightOrgin +'xx'+ window.innerHeight + 'yy'+(window.screen.height - window.windowHeightOrgin))
          }
        }
        // 通知父组件隐藏掉图片操作面板
        hideBottomOnPanel && hideBottomOnPanel()
      }, 200)
    }
  }
  useImperativeHandle(ref, () => ({
    closePanel: () => {
      setPanelShow(false)
    },
    blurInput: () => {
      inputRef.current && inputRef.current.blur();
    },
    focusInput: () => {
      inputRef.current && inputRef.current.focus()
      if (!showPlus) {
        setTimeout(() => {
          // 键盘在页面底部时在获取
          if (!panelShow) {
            // 键盘呼起前剪去键盘呼起后
            let kh = (window as any).windowHeightOrgin - window.innerHeight
            if (kh > 0) {
              // 由于一些webview上下底部有导航栏，所以我们需要剪去这部分高度
              (window as any).keyboardHeight = kh - (window.screen.height - (window as any).windowHeightOrgin)
              // weui.toast(window.windowHeightOrgin +'xx'+ window.innerHeight + 'yy'+(window.screen.height - window.windowHeightOrgin))
            }
          }
          // 通知父组件隐藏掉图片操作面板
          hideBottomOnPanel && hideBottomOnPanel()
        }, 200)
      }
    },
  }));

  // 上传图片回调
  const onFileChange = (newFileList: FileListProps[]) => {
    setFileList(newFileList)
    newFileList.forEach(async (v: any) => {
      if (v.status === 'success') {
        let img: ImgProps = {}
        img.width = v.width
        img.height = v.height
        img.url = v.url
        uploadImg && uploadImg(img)
      }
    })
  }
  const handleClickUpload = () => {
    uploadRef.current && uploadRef.current.upload()
  }
  return (
    <div className="inputbar border-top">
      <div className="inputbar-content">
        <div className="inputbar-wrap">
          <input ref={inputRef} className="weui-input input-inner" type="text" value={content || ''} onChange={onChange} onBlur={closeInput} onFocus={focusInput} />
        </div>
        {
          showPlus ? <div className="plus-btn" onClick={showPanel}></div> : null
        }
        <Button type="success" onClick={hanldeClick} className="inputbar-button">
          发表
        </Button>
      </div>
      {
        showPlus ?
          <div className="opera-panel">
            <div className="opera-item" >
              <div className="item-icon" onClick={handleClickUpload}></div>
              <p className="item-text" >照片</p>
              <Upload style={{display: 'none'}} ref={uploadRef} fileList={fileList} action={'http://101.132.117.183:7001/api/upload'} name="chat" onFileChange={onFileChange} />  <input id="input-bg" type="file" name="bg" style={{ display: 'none' }} />
            </div>
          </div> : null
      }
    </div>
  );
}

export default React.forwardRef(InputBar)