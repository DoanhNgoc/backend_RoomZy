import { adminDb, adminAuth } from "../config/firebase.config";
import admin from "firebase-admin"

import * as bcrypt from "bcryptjs";
const COLLECTION = "users";

// Signup


export const signup = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role_id: string; // vẫn truyền id của role từ client
    dob?: string | null;
}) => {
    // tạo user với Firebase Auth
    const userRecord = await adminAuth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
        phoneNumber: data.phone,
    });

    // tham chiếu role_id dưới dạng DocumentReference
    const roleRef = adminDb.collection("roles").doc(data.role_id);

    // lưu profile vào Firestore
    const userData = {
        role_id: roleRef, // 🔹 reference
        name: data.name,
        phone: data.phone,
        dob: data.dob ? new Date(data.dob) : null,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userData);

    return { id: userRecord.uid, ...userData };
};
// Login
export const login = async (email: string, password: string) => {
    const snapshot = await adminDb
        .collection(COLLECTION)
        .where("email", "==", email)
        .get();
    if (snapshot == null) {
        return {
            message: "no email"
        }
    }

    if (snapshot.empty) throw new Error("User not found");

    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as any;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    // Remove password before returning
    return { id: userDoc.id, ...user, password: undefined };
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