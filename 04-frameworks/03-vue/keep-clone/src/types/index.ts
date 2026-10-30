export interface List {
  id: string
  title: string
  position: number
  createdAt: number
}

export interface ListItem {
  id: string
  listId: string
  content: string
  isChecked: boolean
  position: number
  createdAt: number
}
