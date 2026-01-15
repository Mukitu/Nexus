import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { User, Post, Story, Comment, Notification } from '@/lib/types';

// Users
export async function createUser(uid: string, data: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...data,
    id: uid,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateUser(uid: string, data: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}

export async function searchUsers(searchQuery: string, limitCount = 10) {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('username', '>=', searchQuery.toLowerCase()),
    where('username', '<=', searchQuery.toLowerCase() + '\uf8ff'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as User);
}

// Follow system
export async function followUser(followerId: string, followingId: string) {
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  await setDoc(followRef, {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
  
  await updateDoc(doc(db, 'users', followerId), { followingCount: increment(1) });
  await updateDoc(doc(db, 'users', followingId), { followersCount: increment(1) });
}

export async function unfollowUser(followerId: string, followingId: string) {
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  await deleteDoc(followRef);
  
  await updateDoc(doc(db, 'users', followerId), { followingCount: increment(-1) });
  await updateDoc(doc(db, 'users', followingId), { followersCount: increment(-1) });
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  const snap = await getDoc(followRef);
  return snap.exists();
}

// Posts
export async function createPost(data: {
  authorId: string;
  content: string;
  mediaUrls?: string[];
}) {
  const postRef = doc(collection(db, 'posts'));
  await setDoc(postRef, {
    id: postRef.id,
    authorId: data.authorId,
    content: data.content,
    mediaUrls: data.mediaUrls || [],
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: serverTimestamp(),
  });
  
  await updateDoc(doc(db, 'users', data.authorId), { postsCount: increment(1) });
  return postRef.id;
}

export async function getPosts(
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  limitCount = 10
) {
  const postsRef = collection(db, 'posts');
  let q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  
  if (lastDoc) {
    q = query(postsRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(limitCount));
  }
  
  const snap = await getDocs(q);
  return {
    posts: snap.docs.map(d => ({ ...d.data(), id: d.id })),
    lastDoc: snap.docs[snap.docs.length - 1],
    hasMore: snap.docs.length === limitCount,
  };
}

export async function getUserPosts(userId: string, limitCount = 20) {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('authorId', '==', userId), 
    orderBy('createdAt', 'desc'), 
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

// Likes
export async function likePost(postId: string, userId: string) {
  const likeRef = doc(db, 'likes', `${postId}_${userId}`);
  await setDoc(likeRef, {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { likes: increment(1) });
}

export async function unlikePost(postId: string, userId: string) {
  const likeRef = doc(db, 'likes', `${postId}_${userId}`);
  await deleteDoc(likeRef);
  await updateDoc(doc(db, 'posts', postId), { likes: increment(-1) });
}

export async function hasLiked(postId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, 'likes', `${postId}_${userId}`);
  const snap = await getDoc(likeRef);
  return snap.exists();
}

// Comments
export async function addComment(postId: string, authorId: string, content: string) {
  const commentRef = doc(collection(db, 'comments'));
  await setDoc(commentRef, {
    id: commentRef.id,
    postId,
    authorId,
    content,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { comments: increment(1) });
  return commentRef.id;
}

export async function getComments(postId: string, limitCount = 20) {
  const commentsRef = collection(db, 'comments');
  const q = query(
    commentsRef, 
    where('postId', '==', postId), 
    orderBy('createdAt', 'desc'), 
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// Stories
export async function createStory(authorId: string, mediaUrl: string, type: 'image' | 'video') {
  const storyRef = doc(collection(db, 'stories'));
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  await setDoc(storyRef, {
    id: storyRef.id,
    authorId,
    mediaUrl,
    type,
    views: [],
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  return storyRef.id;
}

export async function getActiveStories() {
  const storiesRef = collection(db, 'stories');
  const now = Timestamp.now();
  const q = query(
    storiesRef, 
    where('expiresAt', '>', now), 
    orderBy('expiresAt'), 
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function markStoryViewed(storyId: string, userId: string) {
  const storyRef = doc(db, 'stories', storyId);
  await updateDoc(storyRef, { views: arrayUnion(userId) });
}

// Messages
export async function sendMessage(
  senderId: string, 
  receiverId: string, 
  content: string,
  mediaUrl?: string
) {
  const conversationId = [senderId, receiverId].sort().join('_');
  const messageRef = doc(collection(db, 'messages'));
  
  await setDoc(messageRef, {
    id: messageRef.id,
    conversationId,
    senderId,
    receiverId,
    content,
    mediaUrl: mediaUrl || null,
    read: false,
    createdAt: serverTimestamp(),
  });
  
  // Update conversation
  const convRef = doc(db, 'conversations', conversationId);
  await setDoc(convRef, {
    participants: [senderId, receiverId],
    lastMessage: content,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  
  return messageRef.id;
}

export function subscribeToMessages(
  conversationId: string, 
  callback: (messages: DocumentData[]) => void
) {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef, 
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => d.data()));
  });
}

export async function getConversations(userId: string) {
  const convRef = collection(db, 'conversations');
  const q = query(
    convRef, 
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Notifications
export async function createNotification(data: {
  userId: string;
  actorId: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  postId?: string;
}) {
  const notifRef = doc(collection(db, 'notifications'));
  await setDoc(notifRef, {
    id: notifRef.id,
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getNotifications(userId: string, limitCount = 30) {
  const notifRef = collection(db, 'notifications');
  const q = query(
    notifRef, 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc'), 
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function markNotificationsRead(userId: string) {
  const notifRef = collection(db, 'notifications');
  const q = query(notifRef, where('userId', '==', userId), where('read', '==', false));
  const snap = await getDocs(q);
  
  const updates = snap.docs.map(d => updateDoc(d.ref, { read: true }));
  await Promise.all(updates);
}

// Storage
export async function uploadMedia(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Reels
export async function createReel(authorId: string, videoUrl: string, caption: string) {
  const reelRef = doc(collection(db, 'reels'));
  await setDoc(reelRef, {
    id: reelRef.id,
    authorId,
    videoUrl,
    caption,
    likes: 0,
    comments: 0,
    views: 0,
    createdAt: serverTimestamp(),
  });
  return reelRef.id;
}

export async function getReels(
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  limitCount = 5
) {
  const reelsRef = collection(db, 'reels');
  let q = query(reelsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  
  if (lastDoc) {
    q = query(reelsRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(limitCount));
  }
  
  const snap = await getDocs(q);
  return {
    reels: snap.docs.map(d => ({ ...d.data(), id: d.id })),
    lastDoc: snap.docs[snap.docs.length - 1],
    hasMore: snap.docs.length === limitCount,
  };
}

export async function incrementReelViews(reelId: string) {
  await updateDoc(doc(db, 'reels', reelId), { views: increment(1) });
}
