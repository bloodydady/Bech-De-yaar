import { db } from './firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, startAfter, addDoc, onSnapshot
} from 'firebase/firestore';

// --- Users ---
export const getUserById = async (id) => {
  const docSnap = await getDoc(doc(db, 'users', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateUser = async (id, data) => {
  await updateDoc(doc(db, 'users', id), data);
};

// Admin Functions
export const getAllUsers = async () => {
    try {
        const q = query(collection(db, 'users'), limit(100));
        const res = await getDocs(q);
        const users = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) { throw error; }
};

export const createGlobalAd = async (adData) => {
    try {
        const docRef = await addDoc(collection(db, 'global_ads'), {
            ...adData,
            created_at: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) { throw error; }
};

export const getGlobalAds = async () => {
    try {
        const q = query(collection(db, 'global_ads'), orderBy('created_at', 'desc'));
        const res = await getDocs(q);
        return res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { throw error; }
};

export const deleteGlobalAd = async (adId) => {
    try {
        await deleteDoc(doc(db, 'global_ads', adId));
    } catch (error) { throw error; }
};

// --- Listings ---
export const getListings = async (filters = {}, limitCount = 10, lastDoc = null) => {
  const listingsRef = collection(db, 'listings');
  let qArgs = [];
  
  if (filters.category && filters.category !== 'All') qArgs.push(where('category', '==', filters.category));
  if (filters.type && filters.type !== 'All') qArgs.push(where('listing_type', '==', filters.type.toLowerCase()));
  if (filters.condition && filters.condition !== 'All') qArgs.push(where('condition', '==', filters.condition));
  if (filters.status) qArgs.push(where('status', '==', filters.status));
  if (filters.is_exit_sale) qArgs.push(where('is_exit_sale', '==', true));
  if (filters.userId) qArgs.push(where('user_id', '==', filters.userId));
  
  // Note: We remove limit() from the DB query because without orderBy('created_at')
  // (which requires a composite index), Firebase returns an arbitrary unordered
  // batch (usually the oldest). This makes new listings appear "deleted".
  qArgs.push(limit(1000)); // fetch broadly to ensure newest are included
  
  const q = query(listingsRef, ...qArgs);
  const snapshot = await getDocs(q);
  
  let fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Client-side Sort
  fetchedData.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  // Client-side pagination/limiting
  let startIndex = 0;
  if (lastDoc) {
      const lastIndex = fetchedData.findIndex(l => l.id === lastDoc.id);
      if (lastIndex !== -1) startIndex = lastIndex + 1;
  }
  
  const pageData = fetchedData.slice(startIndex, startIndex + limitCount);

  return {
    data: pageData,
    lastDoc: pageData.length > 0 ? { id: pageData[pageData.length - 1].id } : null
  };
};

export const getListingById = async (id) => {
  const docSnap = await getDoc(doc(db, 'listings', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createListing = async (data) => {
  const listingsRef = collection(db, 'listings');
  const docRef = await addDoc(listingsRef, {
    ...data,
    created_at: new Date().toISOString(),
    views: 0,
    status: 'active'
  });
  return docRef.id;
};

export const updateListing = async (id, data) => {
  await updateDoc(doc(db, 'listings', id), data);
};

export const deleteListing = async (id) => {
  await deleteDoc(doc(db, 'listings', id));
};

// --- Notes ---
export const getNotes = async (filters = {}, limitCount = 10, lastDoc = null) => {
  const notesRef = collection(db, 'notes');
  let qArgs = [];
  
  if (filters.userId) qArgs.push(where('user_id', '==', filters.userId));
  // Could add more filters for subject, course
  
  qArgs.push(limit(limitCount));
  if (lastDoc) qArgs.push(startAfter(lastDoc));

  const q = query(notesRef, ...qArgs);
  const snapshot = await getDocs(q);
  
  const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  fetchedData.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    data: fetchedData,
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  };
};

export const getNoteById = async (id) => {
  const docSnap = await getDoc(doc(db, 'notes', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createNote = async (data) => {
  const notesRef = collection(db, 'notes');
  const docRef = await addDoc(notesRef, {
    ...data,
    created_at: new Date().toISOString(),
    download_count: 0
  });
  return docRef.id;
};

export const deleteNote = async (id) => {
  await deleteDoc(doc(db, 'notes', id));
};

// --- Ratings ---
export const getRatings = async (userId) => {
  const q = query(collection(db, 'ratings'), where('reviewed_user_id', '==', userId));
  const snap = await getDocs(q);
  const ratings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return ratings.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
};

export const createRating = async (data) => {
  await addDoc(collection(db, 'ratings'), {
    ...data,
    created_at: new Date().toISOString()
  });
};

export const deleteRating = async (id) => {
  await deleteDoc(doc(db, 'ratings', id));
};

export const createReport = async (data) => {
  await addDoc(collection(db, 'reports'), {
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  });
};

// --- Notifications ---
export const subscribeToNotifications = (userId, callback) => {
    const q = query(
        collection(db, 'notifications'), 
        where('recipient_id', '==', userId), 
        limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort client-side to avoid index requirement
        notifs.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        callback(notifs);
    });
};

export const markNotificationRead = async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
};

export const createNotification = async (data) => {
    await addDoc(collection(db, 'notifications'), {
        ...data,
        read: false,
        created_at: new Date().toISOString()
    });
};

// --- Admin: Ban/Unban Users ---
export const banUser = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { is_banned: true, banned_at: new Date().toISOString() });
};

export const unbanUser = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { is_banned: false, banned_at: null });
};

// --- Comments on Listings ---
export const getComments = async (listingId) => {
    const q = query(collection(db, 'comments'), where('listing_id', '==', listingId));
    const snap = await getDocs(q);
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const createComment = async (data) => {
    await addDoc(collection(db, 'comments'), {
        ...data,
        created_at: new Date().toISOString()
    });
};

export const deleteComment = async (id) => {
    await deleteDoc(doc(db, 'comments', id));
};

// --- Lazy Tasks ---
export const createLazyTask = async (data) => {
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 2); // 2 hour lifespan for unaccepted tasks

    const docRef = await addDoc(collection(db, 'lazy_tasks'), {
        ...data,
        status: 'open', // open, accepted, completed, cancelled
        created_at: new Date().toISOString(),
        expires_at: expires_at.toISOString()
    });
    return docRef.id;
};

export const getLazyTasks = async (filters = {}, limitCount = 50) => {
    const tasksRef = collection(db, 'lazy_tasks');
    let qArgs = [];
    
    if (filters.status) qArgs.push(where('status', '==', filters.status));
    if (filters.category && filters.category !== 'All') qArgs.push(where('category', '==', filters.category));
    qArgs.push(limit(limitCount));
    
    const q = query(tasksRef, ...qArgs);
    const snap = await getDocs(q);
    let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Sort Newest First
    fetched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return fetched;
};

export const getLazyTaskById = async (id) => {
    const docSnap = await getDoc(doc(db, 'lazy_tasks', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateLazyTask = async (id, data) => {
    await updateDoc(doc(db, 'lazy_tasks', id), data);
};

export const deleteLazyTask = async (id) => {
    await deleteDoc(doc(db, 'lazy_tasks', id));
};

export const getUserLazyTasks = async (userId) => {
    const tasksRef = collection(db, 'lazy_tasks');
    
    const snapPosted = await getDocs(query(tasksRef, where('posted_by', '==', userId)));
    const snapAccepted = await getDocs(query(tasksRef, where('accepted_by', '==', userId)));
    
    const posted = snapPosted.docs.map(d => ({ id: d.id, ...d.data() }));
    const accepted = snapAccepted.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const sortDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at);
    return {
        posted: posted.sort(sortDesc),
        accepted: accepted.sort(sortDesc)
    };
};

// --- Task Ratings ---
export const createTaskRating = async (data) => {
    await addDoc(collection(db, 'task_ratings'), {
        ...data,
        created_at: new Date().toISOString()
    });
};
