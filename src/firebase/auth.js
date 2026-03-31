import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const signup = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    email: user.email,
    created_at: new Date().toISOString(),
    rating_avg: 0,
    reviews_count: 0,
    blocked_users: []
  });
  
  // Send email verification on signup
  try { await sendEmailVerification(user); } catch(e) { console.error("Verification failed", e); }

  return user;
};

export const sendVerificationEmail = async () => {
    if (auth.currentUser) {
        return await sendEmailVerification(auth.currentUser);
    }
};

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
        await setDoc(userRef, {
            name: user.displayName || 'Google User',
            email: user.email,
            profile_photo_url: user.photoURL || '',
            college_name: "Default College", // Placeholder, user should edit profile
            city: "Default City",
            phone: "",
            created_at: new Date().toISOString(),
            rating_avg: 0,
            reviews_count: 0,
            blocked_users: []
        });
    }
    return user;
};

export const logout = async () => {
  return await signOut(auth);
};

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
