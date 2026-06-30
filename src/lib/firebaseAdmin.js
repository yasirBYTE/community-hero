import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

let adminApp, adminDb, adminAuth

try {
  if (!getApps().length && adminConfig.clientEmail && adminConfig.privateKey) {
    adminApp = initializeApp({
      credential: cert(adminConfig),
      projectId: adminConfig.projectId,
    })
  } else if (getApps().length) {
    adminApp = getApps()[0]
  }
  if (adminApp) {
    adminDb = getFirestore(adminApp)
    adminAuth = getAuth(adminApp)
  }
} catch (e) {
  console.warn('Firebase Admin not configured:', e.message)
}

export { adminApp, adminDb, adminAuth }
