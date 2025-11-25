import React from "react";
import { Button } from "antd";
import "./index.scss";

type ButtonProps = React.ComponentProps<typeof Button>;

interface IconButtonProps extends Omit<ButtonProps, "icon"> {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Button
      type="text"
      size="small"
      icon={icon}
      onClick={handleClick}
      className="icon-button"
      {...props}
    />
  );
};

