import { adminDb, adminAuth } from "../config/firebase.config";
import admin from "firebase-admin"

import * as bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
const COLLECTION = "users";

// Signup



export const signup = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role_id: string;
}) => {
    // check email đã tồn tại trong auth
    try {
        await adminAuth.getUserByEmail(data.email);
        throw new Error("Email đã tồn tại");
    } catch (err: any) {
        if (err.code !== "auth/user-not-found") {
            throw err;
        }
    }

    // tạo account trên Firebase Auth
    const authUser = await adminAuth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
    });

    const roleRef = adminDb.doc(`roles${data.role_id}`);

    const userData = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role_id: roleRef,
        dob: null,
        created_at: FieldValue.serverTimestamp(),
    };

    // dùng uid làm document id
    await adminDb.collection("users").doc(authUser.uid).set(userData);

    return {
        id: authUser.uid,
        ...userData,
    };
};
// Login
export const login = async (email: string, password: string) => {

    if (!email || !password) {
        throw new Error("Thiếu email hoặc password");
    }

    const snapshot = await adminDb
        .collection("users")
        .where("email", "==", email)
        .get();

    if (snapshot.empty) {
        throw new Error("Email không tồn tại");
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as any;
    let roleData = null;
    if (user.role_id) {
        const roleSnap = await user.role_id.get();
        if (roleSnap.exists) {
            const u = roleSnap.data();
            roleData = {
                id: roleSnap.id,
                name: u?.name || null,
            };
        }
    }
    if (!user.password) {

        throw new Error("User chưa có password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Sai mật khẩu");
    }

    return {
        id: userDoc.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: roleData
    };
};

// Forgot password (demo: chỉ trả email đã tồn tại)
export const forgotPassword = async (email: string) => {
    const snapshot = await adminDb
        .collection(COLLECTION)
        .where("email", "==", email)
        .get();

    if (snapshot.empty) throw new Error("User not found");
    return { success: true, message: "Check your email to reset password" };
};

// Edit profile
export const editProfile = async (
    userId: string,
    data: { name?: string; phone?: string; dob?: string | null }
) => {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.dob) updateData.dob = new Date(data.dob);
    await adminDb.collection(COLLECTION).doc(userId).update(updateData);

    return { id: userId, ...updateData };
};