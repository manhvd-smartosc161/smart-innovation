import React from 'react';
import { Button, Tooltip } from 'antd';
import './index.scss';

type ButtonProps = React.ComponentProps<typeof Button>;

interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  tooltip,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const button = (
    <Button
      type="text"
      size="small"
      icon={icon}
      onClick={handleClick}
      className="icon-button"
      {...props}
    />
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} mouseEnterDelay={0.5}>
        {button}
      </Tooltip>
    );
  }

  return button;
};
