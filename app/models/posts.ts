import { collection, getDocs, query } from 'firebase/firestore'
import { type QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '~/services/firestore'

interface Post {
  id: string
  title: string
  content: string
  isPublished: boolean
  isPublic: boolean
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

export const listUserPosts = async () => {
  const q = query(collection(db, 'posts')).withConverter<Post>(converter)
  const docs = await getDocs(q)
  return docs.docs.map((doc) => doc.data())
}
