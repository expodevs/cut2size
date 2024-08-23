
import React from 'react';

export default function Placeholder(props) {
  return (
    <div className="placeholder lazy-load" style={{
        height:props.height
    }}>
      <div className="spinner"/>
    </div>
  );
}
