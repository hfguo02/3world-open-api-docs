import React from 'react';

export default function Steps({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="steps">{children}</div>;
}