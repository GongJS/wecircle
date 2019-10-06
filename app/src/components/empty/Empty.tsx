import React from 'react';
import './empty.scss';

interface EmptyProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

const Empty: React.FC<EmptyProps> = ({ title }) => {
  return (
    <div className="empty">
       {title}
    </div>
  );
}

Empty.displayName = 'Empty'
export default Empty;