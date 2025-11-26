import React from 'react';
import { Tag } from '@/components/atoms';
import './index.scss';

interface TagsContainerProps {
  tags: Array<{ label: string; color: string }>;
}

export const TagsContainer: React.FC<TagsContainerProps> = ({ tags }) => {
  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <Tag key={index} color={tag.color}>
          {tag.label}
        </Tag>
      ))}
    </div>
  );
};
