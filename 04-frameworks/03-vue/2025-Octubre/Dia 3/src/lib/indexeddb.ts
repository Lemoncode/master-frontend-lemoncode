const DB_NAME = 'my-tasks-db'
const DB_VERSION = 1
const STORE_LISTS = 'lists'
const STORE_ITEMS = 'list_items'

export type IDBPDatabase = IDBDatabase

function openDatabase(): Promise<IDBPDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_LISTS)) {
        const lists = db.createObjectStore(STORE_LISTS, { keyPath: 'id' })
        lists.createIndex('position', 'position', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        const items = db.createObjectStore(STORE_ITEMS, { keyPath: 'id' })
        items.createIndex('listId', 'listId', { unique: false })
        items.createIndex('position', 'position', { unique: false })
      }
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Transaction wrapper
 */
function tx<T>(
  db: IDBPDatabase,
  store: string,
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => T,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode)
    const s = t.objectStore(store)
    const result = op(s)
    t.oncomplete = () => resolve(result)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  })
}

export async function getAllListsOrdered(): Promise<any[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_LISTS, 'readonly')
    const s = t.objectStore(STORE_LISTS)
    const req = s.getAll()
    req.onsuccess = () => {
      const data = (req.result || []).sort((a: any, b: any) => a.position - b.position)
      resolve(data)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function putList(list: any): Promise<any> {
  const db = await openDatabase()
  await tx(db, STORE_LISTS, 'readwrite', (s) => s.put(list))
  return list
}

export async function updateListById(id: string, updates: any): Promise<any | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_LISTS, 'readwrite')
    const s = t.objectStore(STORE_LISTS)
    const getReq = s.get(id)
    getReq.onsuccess = () => {
      const existing = getReq.result
      if (!existing) return resolve(null)
      const updated = { ...existing, ...updates }
      s.put(updated)
      t.oncomplete = () => resolve(updated)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function deleteListById(id: string): Promise<void> {
  const db = await openDatabase()
  await tx(db, STORE_LISTS, 'readwrite', (s) => s.delete(id))
}

export async function getItemsByListOrdered(listId: string): Promise<any[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_ITEMS, 'readonly')
    const s = t.objectStore(STORE_ITEMS)
    const req = s.getAll()
    req.onsuccess = () => {
      const all = req.result || []
      const data = all
        .filter((i: any) => i.listId === listId)
        .sort((a: any, b: any) => a.position - b.position)
      resolve(data)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function putItem(item: any): Promise<any> {
  const db = await openDatabase()
  await tx(db, STORE_ITEMS, 'readwrite', (s) => s.put(item))
  return item
}

export async function updateItemById(id: string, updates: any): Promise<any | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_ITEMS, 'readwrite')
    const s = t.objectStore(STORE_ITEMS)
    const getReq = s.get(id)
    getReq.onsuccess = () => {
      const existing = getReq.result
      if (!existing) return resolve(null)
      const updated = { ...existing, ...updates }
      s.put(updated)
      t.oncomplete = () => resolve(updated)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function deleteItemById(id: string): Promise<void> {
  const db = await openDatabase()
  await tx(db, STORE_ITEMS, 'readwrite', (s) => s.delete(id))
}

export async function deleteItemsByList(listId: string): Promise<void> {
  const db = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(STORE_ITEMS, 'readwrite')
    const s = t.objectStore(STORE_ITEMS)
    const cursorReq = s.openCursor()
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result as IDBCursorWithValue | null
      if (!cursor) return
      const value: any = cursor.value
      if (value && value.listId === listId) {
        cursor.delete()
      }
      cursor.continue()
    }
    t.oncomplete = () => resolve()
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  })
}
