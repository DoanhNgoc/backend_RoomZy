import { adminDb } from "../config/firebase.config";
export async function getAllRoles() {
    const snapshot = await adminDb
        .collection("roles")
        .get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }))
}