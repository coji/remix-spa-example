import {
  type QueryDocumentSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '~/services/firestore'

interface Account {
  id: string
  displayName: string
  photoURL: string | null
  profile: string | null
  isRegistered: boolean // 登録済みかどうか
}

const converter = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Account
    }
    return undefined
  },
  toFirestore: (model: Account) => {
    const { id, ...rest } = model
    return { ...rest }
  },
}

export const getAccount = async (id: string) => {
  const account = await getDoc(doc(db, 'accounts', id).withConverter(converter))
  return account.data()
}

export const updateAccount = async (id: string, data: Partial<Account>) => {
  return await setDoc(doc(db, 'accounts', id).withConverter(converter), data, {
    merge: true,
  })
}
