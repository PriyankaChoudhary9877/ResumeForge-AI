import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

const COLLECTION = 'resumes'

/** Lists all resumes belonging to the current user, most recently updated first. */
export async function listResumes(userId) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('user_id', '==', userId),
      orderBy('updated_at', 'desc')
    )
    const snap = await getDocs(q)
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { data, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

/** Fetches a single resume's full data. */
export async function getResume(id) {
  try {
    const ref = doc(db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { data: null, error: new Error('Resume not found.') }
    return { data: { id: snap.id, ...snap.data() }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Creates a new resume document and returns it. */
export async function createResume(userId, title, resumeData) {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      user_id: userId,
      title,
      resume_data: resumeData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    const snap = await getDoc(ref)
    return { data: { id: snap.id, ...snap.data() }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/** Updates an existing resume's title and/or data. updated_at is refreshed. */
export async function updateResume(id, fields) {
  try {
    const ref = doc(db, COLLECTION, id)
    await updateDoc(ref, { ...fields, updated_at: serverTimestamp() })
    const snap = await getDoc(ref)
    return { data: { id: snap.id, ...snap.data() }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteResume(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/** Duplicates a resume document, returning the newly created copy. */
export async function duplicateResume(userId, sourceResume) {
  return createResume(userId, `${sourceResume.title} (copy)`, sourceResume.resume_data)
}
