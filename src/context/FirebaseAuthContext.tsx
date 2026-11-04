import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot 
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { UserSession, UserRole } from "../types";
import { GMAIL_SCOPES } from "../services/gmailAuth";

interface FirebaseAuthContextType {
  currentUser: User | null;
  firebaseSession: UserSession;
  session: UserSession;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<UserSession | null>;
  logout: () => Promise<void>;
  updateCustomTitleInFirebase: (newTitle: string) => Promise<{ success: boolean; error?: string }>;
  updateUserSession: (patch: Partial<UserSession>) => Promise<void>;
  refreshUserSession: () => Promise<void>;
}

const defaultVisitorSession: UserSession = {
  ign: "Visitor",
  role: "Visitor",
  coins: 0,
  battlePassXp: 0,
  battlePassLevel: 1,
  verified: false,
  isLoggedIn: false
};

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  currentUser: null,
  firebaseSession: defaultVisitorSession,
  session: defaultVisitorSession,
  loading: true,
  authError: null,
  signInWithGoogle: async () => null,
  logout: async () => {},
  updateCustomTitleInFirebase: async () => ({ success: false }),
  updateUserSession: async () => {},
  refreshUserSession: async () => {}
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

const googleProvider = new GoogleAuthProvider();
// Include the Google Workspace scopes so user can seamlessly authorize Gmail & Firestore together
GMAIL_SCOPES.forEach(scope => googleProvider.addScope(scope));

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem("cv_user_session");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultVisitorSession;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync session with Firestore profile
  const syncProfile = async (firebaseUser: User): Promise<UserSession> => {
    const isOwnerEmail = firebaseUser.email?.toLowerCase() === "muchecheprince4@gmail.com";
    const userDocRef = doc(db, "users", firebaseUser.uid);
    let profileData: any = null;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profileData = snap.data();
      } else {
        // First-time user profile registration in Firestore
        const defaultIgn = (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .substring(0, 20) || "Player";

        profileData = {
          uid: firebaseUser.uid,
          ign: defaultIgn,
          email: firebaseUser.email || "",
          role: isOwnerEmail ? "Owner" : "Member",
          customTitle: isOwnerEmail ? "Clan Founder & Owner" : "",
          coins: isOwnerEmail ? 2500 : 500,
          battlePassLevel: isOwnerEmail ? 10 : 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData);
      }
    } catch (err) {
      console.warn("[Firebase] Could not sync user profile document, using authenticated auth claims:", err);
    }

    const token = await firebaseUser.getIdToken();
    const finalRole: UserRole = isOwnerEmail 
      ? "Owner" 
      : (profileData?.role && ["Head Admin", "Admin", "Moderator", "Team Captain", "Member"].includes(profileData.role) ? profileData.role : "Member");

    const mappedSession: UserSession = {
      ign: profileData?.ign || firebaseUser.displayName || "Player",
      role: finalRole,
      email: firebaseUser.email || undefined,
      coins: profileData?.coins || (isOwnerEmail ? 2500 : 500),
      battlePassXp: 150,
      battlePassLevel: profileData?.battlePassLevel || 3,
      verified: Boolean(firebaseUser.emailVerified || isOwnerEmail),
      customTitle: profileData?.customTitle || (isOwnerEmail ? "Clan Founder & Owner" : undefined),
      authToken: token,
      isLoggedIn: true
    };

    localStorage.setItem("cv_auth_token", token);
    localStorage.setItem("cv_user_session", JSON.stringify(mappedSession));
    return mappedSession;
  };

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        try {
          setCurrentUser(user);
          const initialSession = await syncProfile(user);
          setSession(initialSession);
          setAuthError(null);

          // Real-time Firestore document listener for profile, role, coins, and battle pass
          const isOwnerEmail = user.email?.toLowerCase() === "muchecheprince4@gmail.com";
          const userDocRef = doc(db, "users", user.uid);
          unsubscribeSnapshot = onSnapshot(userDocRef, async (snap) => {
            if (snap.exists()) {
              const profileData = snap.data();
              const token = await user.getIdToken();
              const finalRole: UserRole = isOwnerEmail
                ? "Owner"
                : (profileData?.role && ["Head Admin", "Admin", "Moderator", "Team Captain", "Member"].includes(profileData.role) ? profileData.role : "Member");

              const liveSession: UserSession = {
                ign: profileData?.ign || user.displayName || "Player",
                role: finalRole,
                email: user.email || undefined,
                coins: typeof profileData?.coins === "number" ? profileData.coins : (isOwnerEmail ? 2500 : 500),
                battlePassXp: typeof profileData?.battlePassXp === "number" ? profileData.battlePassXp : 150,
                battlePassLevel: typeof profileData?.battlePassLevel === "number" ? profileData.battlePassLevel : (isOwnerEmail ? 10 : 3),
                verified: Boolean(user.emailVerified || isOwnerEmail),
                customTitle: profileData?.customTitle || (isOwnerEmail ? "Clan Founder & Owner" : undefined),
                authToken: token,
                isLoggedIn: true
              };

              setSession(liveSession);
              localStorage.setItem("cv_auth_token", token);
              localStorage.setItem("cv_user_session", JSON.stringify(liveSession));
            }
          }, (err) => {
            handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          });

        } catch (err: any) {
          console.error("[Firebase Auth Error]:", err);
          setAuthError(err.message || "Failed to load authenticated user profile.");
        }
      } else {
        setCurrentUser(null);
        setSession(defaultVisitorSession);
        localStorage.removeItem("cv_auth_token");
        localStorage.removeItem("cv_user_session");
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const signInWithGoogle = async (): Promise<UserSession | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userSession = await syncProfile(result.user);
        setCurrentUser(result.user);
        setSession(userSession);
        return userSession;
      }
      return null;
    } catch (err: any) {
      console.error("[Firebase Google Sign-in Error]:", err);
      const msg = err.message || "Failed to sign in with Google Firebase Auth.";
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setSession(defaultVisitorSession);
      localStorage.removeItem("cv_auth_token");
      localStorage.removeItem("cv_user_session");
    } catch (err: any) {
      console.error("[Firebase Logout Error]:", err);
    }
  };

  const updateUserSession = async (patch: Partial<UserSession>) => {
    setSession(prev => {
      const updated = { ...prev, ...patch };
      localStorage.setItem("cv_user_session", JSON.stringify(updated));
      return updated;
    });

    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docUpdates: any = { updatedAt: new Date().toISOString() };
        if (patch.ign !== undefined) docUpdates.ign = patch.ign;
        if (patch.customTitle !== undefined) docUpdates.customTitle = patch.customTitle;
        if (patch.coins !== undefined) docUpdates.coins = patch.coins;
        if (patch.battlePassLevel !== undefined) docUpdates.battlePassLevel = patch.battlePassLevel;
        if (patch.battlePassXp !== undefined) docUpdates.battlePassXp = patch.battlePassXp;
        await updateDoc(userDocRef, docUpdates);
      } catch (err) {
        console.warn("[Firestore] Session patch sync fallback:", err);
      }
    }
  };

  const updateCustomTitleInFirebase = async (newTitle: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Authentication required to update title." };
    }

    // Call server validation endpoint to strictly reject administrative keywords
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/user/custom-title", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ign: session.ign, customTitle: newTitle })
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        return { success: false, error: data.error || "Title rejected by security rules." };
      }

      // Update Firestore document
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          customTitle: data.customTitle,
          updatedAt: new Date().toISOString()
        });
      } catch (fsErr) {
        console.warn("[Firestore] Custom title updated on server; local sync fallback:", fsErr);
      }

      // Update local session
      setSession(prev => {
        const updated = { ...prev, customTitle: data.customTitle };
        localStorage.setItem("cv_user_session", JSON.stringify(updated));
        return updated;
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update custom title." };
    }
  };

  const refreshUserSession = async () => {
    if (auth.currentUser) {
      const updated = await syncProfile(auth.currentUser);
      setSession(updated);
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        currentUser,
        firebaseSession: session,
        session,
        loading,
        authError,
        signInWithGoogle,
        logout,
        updateCustomTitleInFirebase,
        updateUserSession,
        refreshUserSession
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};
