import React from 'react';

export default function CardGroup({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) {
  return (
    <div className="card-group" style={{'--card-cols': cols} as React.CSSProperties}>
      {children}
    </div>
  );
}