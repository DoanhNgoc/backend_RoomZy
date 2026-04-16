import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../config/firebase.config";

export async function createdBoardingHouse(
    data: {
        owner_id: string,
        address: string,
        description: string,
        name: string
    }
) {


    //chuyen owner ve reference
    const ownerRef = adminDb.doc(`users/${data.owner_id}`)
    const createdbh = await adminDb.collection("boardingHouse").add({
        address: data.address,
        description: data.description,
        name: data.name,
        owner_id: ownerRef,
        created_at: FieldValue.serverTimestamp()

    })
    return {
        id: createdbh.id,
        message: "Successfully created a row of rental rooms."
    }
}

//update
export const updateBoardingHouse = async (
    id: string,
    data: {
        address: string,
        description: string,
        name: string
    }
) => {
    const updatedh = await adminDb.collection("boardingHouse").doc(id).update(
        {
            address: data.address,
            description: data.description,
            name: data.name,
            created_at: FieldValue.serverTimestamp()

        }
    )
    return {
        id: id,
        submit: updatedh
    }
}