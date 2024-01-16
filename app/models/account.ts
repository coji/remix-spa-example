import {
  type QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore'
import { db } from '~/services/firestore'

// ユーザのアカウント
export interface Account {
  id: string // ハンドル
  uid: string // アカウントのUID
  displayName: string
  photoURL: string | null
  profile: string | null
}

export const accountConverter = {
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

// アカウントの作成
export const createAccount = async (
  uid: string,
  handle: string,
  data: Pick<Account, 'displayName' | 'photoURL'>,
) => {
  runTransaction(db, async (transaction) => {
    // アカウントの重複チェック
    const account = await transaction.get(
      doc(db, 'accounts', handle).withConverter(accountConverter),
    )
    if (account.exists()) {
      throw new Error('Handle already exists.')
    }

    // アカウントの登録
    transaction.set(
      doc(db, 'accounts', handle).withConverter(accountConverter),
      {
        id: handle,
        uid,
        ...data,
        profile: null,
      },
    )
  })
}

export const isAccountExistsByHandle = async (handle: string) => {
  const account = await getDoc(
    doc(db, 'accounts', handle).withConverter(accountConverter),
  )
  return account.exists()
}

export const isAccountExistsByUID = async (uid: string) => {
  const q = query(
    collection(db, 'accounts'),
    where('uid', '==', uid),
  ).withConverter(accountConverter)
  const account = await getDocs(q)
  console.log('isAccountExistsByUID', { uid, account_size: account.size })
  return account.size > 0
}

export const getAccountByUID = async (uid: string) => {
  const q = query(
    collection(db, 'accounts'),
    where('uid', '==', uid),
  ).withConverter(accountConverter)
  const account = await getDocs(q)
  if (account.size === 0) {
    return undefined
  }
  return account.docs[0].data()
}
