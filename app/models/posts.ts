import {
  type QueryDocumentSnapshot,
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '~/services/firestore'

// 個別の投稿
export interface Post {
  id: string
  uid: string
  handle: string
  title: string
  content: string
  publishedAt: string | null
  createdAt: string
}

const converter = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Post
  },
  toFirestore: (model: Post) => {
    const { id, ...rest } = model
    return { ...rest }
  },
}

export const listUserPosts = async (handle: string) => {
  const q = query(
    collection(db, 'accounts', handle, 'posts'),
  ).withConverter<Post>(converter)
  const docs = await getDocs(q)
  return docs.docs.map((doc) => doc.data())
}

export const listAllPosts = async () => {
  const q = collectionGroup(db, 'posts').withConverter<Post>(converter)
  const docs = await getDocs(q)
  return docs.docs.map((doc) => doc.data())
}

export const getUserPostById = async (handle: string, id: string) => {
  const postDocRef = doc(
    db,
    'accounts',
    handle,
    'posts',
    id,
  ).withConverter<Post>(converter)
  const postDoc = await getDoc(postDocRef)
  if (postDoc.exists()) {
    return postDoc.data()
  }
  return null
}

export const addUserPost = async (handle: string) => {
  const postsRef = collection(db, 'accounts', handle, 'posts')
  return await addDoc(postsRef, {
    handle,
    title: '',
    content: '',
    publishedAt: null,
    createdAt: new Date().toISOString(),
  })
}

export const updateUserPost = async (
  handle: string,
  data: Omit<Post, 'createdAt'>,
) => {
  const postDocRef = doc(
    db,
    'accounts',
    handle,
    'posts',
    data.id,
  ).withConverter<Post>(converter)

  if (!data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  await setDoc(postDocRef, data, { merge: true })
}

export const deleteUserPost = async (handle: string, id: string) => {
  const postDocRef = doc(db, 'accounts', handle, 'posts', id)
  await deleteDoc(postDocRef)
}
