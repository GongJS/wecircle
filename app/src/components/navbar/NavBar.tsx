import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
import './navbar.scss';

interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}


const NavBar: React.FC<NavBarProps> = ({ title }) => {
  const { history } = useReactRouter()
  const goBack = () => {
    history.goBack();
  }

  useEffect(() => {
    return () => {
      localStorage.setItem('lastRouter', history.location.pathname)
    }
  })
  return (
    <div className="navbar">
       <div className="navbar-item border-bottom">
        <p className="title">{title}</p>
        <div className="left-icon" onClick={goBack}></div>
      </div>
    </div>
  );
}

NavBar.displayName = 'NavBar'
export default NavBar;