export interface List {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
}

export interface ListItem {
  id: string;
  listId: string;
  content: string;
  isChecked: boolean;
  position: number;
  createdAt: number;
}
