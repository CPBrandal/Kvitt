import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    await sendEmailVerification(userCredential.user);

    return {
      success: true,
      user: userCredential.user,
      message: "Verification email sent! Please check your inbox.",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { success: false, error: "No user logged in" };
    }

    if (user.emailVerified) {
      return { success: false, error: "Email already verified" };
    }

    await sendEmailVerification(user);
    return {
      success: true,
      message: "Verification email sent!",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const isEmailVerified = (): boolean => {
  const user = auth.currentUser;
  return user?.emailVerified ?? false;
};

export const reloadUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      return { success: true, emailVerified: user.emailVerified };
    }
    return { success: false, error: "No user logged in" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user.emailVerified) {
      return {
        success: true,
        user: userCredential.user,
        emailVerified: false,
        message: "Please verify your email before continuing",
      };
    }

    return {
      success: true,
      user: userCredential.user,
      emailVerified: true,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
