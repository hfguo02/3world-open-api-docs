import React from 'react';

export default function Card({
  title,
  children,
  icon,
  href,
}: {
  title: string;
  children?: React.ReactNode;
  icon?: string;
  href?: string;
}) {
  const content = (
    <>
      {icon && <div className="card-icon">{icon}</div>}
      <h3 className="card-title">{title}</h3>
      {children && <p className="card-body">{children}</p>}
    </>
  );

  if (href) {
    return (
      <a href={href} className="card">
        {content}
      </a>
    );
  }

  return <div className="card">{content}</div>;
}