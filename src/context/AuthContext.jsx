import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { login, signup, loginWithGoogle, logout as firebaseLogout, resetPassword, sendVerificationEmail } from '../firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfile = async (data) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);
      setUserProfile(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error updating profile", error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseLogout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
     loginWithGoogle,
     logout,
     updateProfile,
     resetPassword,
     sendVerificationEmail
   };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
