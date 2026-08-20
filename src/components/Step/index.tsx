import React from 'react';

export default function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="step">
      <h3 className="step-title">{title}</h3>
      <div className="step-body">{children}</div>
    </div>
  );
}