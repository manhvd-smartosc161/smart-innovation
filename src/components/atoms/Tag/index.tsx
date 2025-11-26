import React from 'react';
import { Tag as AntTag } from 'antd';

export const Tag: React.FC<React.ComponentProps<typeof AntTag>> = (props) => {
  return <AntTag {...props} />;
};
