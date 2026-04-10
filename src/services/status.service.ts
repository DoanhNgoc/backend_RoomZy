import { adminDb } from "../config/firebase.config";

const COLLECTION = "status";

// CREATE
export const createStatus = async (data: {
    id: string;
    key: string;
    name: string;
    type: string;
}) => {
    await adminDb.collection(COLLECTION).doc(data.id).set(data);
    return data;
};

// GET ALL

// GET ALL
export const getAllStatus = async () => {
    const snapshot = await adminDb.collection(COLLECTION).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
//` BY ID
export const getStatusById = async (id: string) => {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
};

// UPDATE
export const updateStatus = async (id: string, data: any) => {
    await adminDb.collection(COLLECTION).doc(id).update(data);
    return { id, ...data };
};

// DELETE
export const deleteStatus = async (id: string) => {
    await adminDb.collection(COLLECTION).doc(id).delete();
    return { success: true };
};