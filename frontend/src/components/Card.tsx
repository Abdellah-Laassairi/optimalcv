import React, { memo } from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = memo(function Card({ children, className = "" }: CardProps) {
  return <div className={`acv-card ${className}`}>{children}</div>;
});

export default Card;
