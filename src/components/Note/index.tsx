import React from 'react';

export default function Note({
  children,
  type = 'info',
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success';
}) {
  return <div className={`note note-${type}`}>{children}</div>;
}