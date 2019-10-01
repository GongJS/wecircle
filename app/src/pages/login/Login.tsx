import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { message } from 'redell-ui'
import { post } from '../../utils/http'
import './login.scss'
interface verifyCode {
  code: number
  msg: string
}
interface LoginProps {
  [propName: string]: any;
}
const Login: React.FC<LoginProps> = (props) => {
  const [phone, setPhone] = useState()
  const [code, setCode] = useState()
  const [hasCode, setHasCode] = useState(false)
  const [count, setCount] = useState(60)
  const { history } = useReactRouter()

  // 监听手机号
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPhone(e.target.value)
  }
  // 监听验证码
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setCode(e.target.value)
  }
  // 获取验证码
  const getVerifyCode = async () => {
    const res: any = await post('/api/verify_code', { phone })
    if (res && res.code === 0) {
      message.success('验证码发送成功，请注意查收!')
      setHasCode(true)
    } else {
      message.error(res.msg || '未知错误')
    }
  }
  const login = async () => {
    if (phone !== '' || code !== '') {
      const res: any = await post('/api/login', { phone, code })
      if (res.code === 0) {
        // 登录成功存储用户信息
        localStorage.setItem('token', res.result.token)
        res.result.user.phone = phone
        localStorage.setItem('user', JSON.stringify(res.result.user))
        history.push('/')
      } else {
        message.error('手机号错误或验证码失效！')
      }
    }
  }
  useEffect(() => {
    // 倒计时
    let timer: number = 0
    if (hasCode) {
      timer = window.setInterval(() => {
        setCount(count - 1)
      }, 1000)
    }
    if (count === 0) {
      setHasCode(false)
      setCount(60)
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [count, hasCode])
  return (
    <div className="login">
      <div className="close" onClick={() => history.push('/')} />
      <div className="content">
        <p className="title">手机号登录</p>
        <div className="phone-wrapper border-top">
          <div className="phone">手机号</div>
          <div className="input">
            <input type="number" onChange={handlePhoneChange} placeholder="请输入手机号" />
          </div>
          {
            hasCode ? <span style={{ color: '#3cc51f', fontSize: '16px', marginRight: '10vw' }}>{count}</span> : <div className="gcode" onClick={getVerifyCode}>获取验证码</div>
          }
        </div>
        <div className="border-top"></div>
        <div className="code-wrapper border-bottom">
          <div className="code">手机验证码</div>
          <div className="input">
            <input type="number" onChange={handleCodeChange} placeholder="请输入验证码" />
          </div>
        </div>
        <div className="login-btn" onClick={login}>确定</div>
      </div>
    </div>
  );
}

export default Login;