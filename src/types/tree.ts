export interface TreeNode {
  key: string;
  title: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  isLeaf?: boolean;
}
