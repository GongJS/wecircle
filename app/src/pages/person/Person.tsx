import React, { useLayoutEffect } from 'react';
import useReactRouter from 'use-react-router';
import NavBar from '../../components/navbar/NavBar'
import './person.scss';

interface PersonProps {
  [propName: string]: any;
}
const Person: React.FC<PersonProps> = (props) => {
  const { history } = useReactRouter()
  const goToChat = () => {
    history.push({
      pathname: '/chat',
      state: {...props.location.state}
    })
  }
  useLayoutEffect(() => {
    if(!props.location.state) {
      history.push('/')
    }
   },[]) //eslint-disable-line
  return (
    <div className="person">
      < NavBar title="个人信息" />
      <div className="person-info">
        <span>
          <img src={props.location && props.location.state && props.location.state.avatar} className="avatar" alt="" />
          <div className="person-info-right">
            <p className="nickname">
              {props.location && props.location.state && props.location.state.nickname}
            </p>
            <p className="phone">
              Tel: {props.location && props.location.state && props.location.state.phone}
            </p>
          </div>
        </span>
      </div>
      <div className="panel">
        <div className="left">
          <div className="msg-icon"></div>
          <div onClick={goToChat}>发送消息</div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
}

Person.displayName = 'Person'
export default Person;