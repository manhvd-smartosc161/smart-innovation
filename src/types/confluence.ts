export interface ConfluencePageTree {
  id: string;
  title: string;
  url?: string;
  type: 'folder' | 'page';
  lastUpdate: string; // Format: "MMM DD, HH:mm" e.g., "Nov 12, 15:36"
  children?: ConfluencePageTree[];
}
