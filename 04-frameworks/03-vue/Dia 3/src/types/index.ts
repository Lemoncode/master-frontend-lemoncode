export type List = {
  id: string
  title: string
  position: number
  createdAt: number
}

export type ListInsert = {
  title: string
  position: number
}

export type ListItem = {
  id: string
  listId: string
  content: string
  isChecked: boolean
  position: number
  createdAt: number
}

export type ListItemInsert = {
  listId: string
  content: string
  position: number
}
