export interface Item {
  id: string
  name: string
}

export let items: Item[] = []

export const add = (item: Omit<Item, 'id'>) => {
  items = [...items, { ...item, id: Math.random().toString() }]
}
