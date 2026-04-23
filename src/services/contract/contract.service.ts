import { adminDb } from "../../config/firebase.config"
import admin from "firebase-admin"
import { FieldValue } from "firebase-admin/firestore";
//models tenant
interface TenantData {
    name: string;
    phone: string;
    id_card: string;
    join_date: string; // dd/mm/yyyy
    leave_date?: string | null;
}
//contract
interface CreateContractData {
    deposit: number
    end_date: string; // dd/mm/yyyy
    start_date: string; // dd/mm/yyyy
    image_contract_url: string;
    card_id_renter: string
    owner_id: string;
    renter_id: string;
    room_id: string;
    agreed_price: number;
    status_id: string;
    tenants: TenantData[];
}

const ConvertDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return admin.firestore.Timestamp.fromDate(
        new Date(year, month - 1, day)
    );
};
//tao hop dong thue phong
export const createContract = async (data: CreateContractData) => {
    try {
        await adminDb.runTransaction(async (transaction) => {
            transaction.set(contractRef, {
                room_name: roomData?.name
            });

            for (const tenant of data.tenants) {
                const tenantRef = contractRef.collection("tenants").doc();

                transaction.set(tenantRef, {
                    name: tenant.name
                });
            }
        });
        const contractRef = adminDb.collection("contract").doc();

        const ownerRef = adminDb.doc(`users/${data.owner_id}`);
        const renterRef = adminDb.doc(`users/${data.renter_id}`);
        const roomRef = adminDb.doc(`room/${data.room_id}`);

        const roomSnap = await roomRef.get();

        //check ngay bat dau va ngay ket thuc
        const start = ConvertDate(data.start_date).toDate();
        const end = ConvertDate(data.end_date).toDate();

        if (start >= end) {
            throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
        if (!roomSnap.exists) {
            throw new Error("Phòng không tồn tại");
        }

        const roomData = roomSnap.data();
        await contractRef.set({
            deposit: data.deposit, //tien coc
            created_at: FieldValue.serverTimestamp(),// ngay tao
            start_date: ConvertDate(data.start_date), //ngay bat dau
            end_date: ConvertDate(data.end_date), // ngay ket thuc
            image_contract_URL: data.image_contract_url, //anh hop dong
            owner_id: ownerRef, //chu tro
            renter_id: renterRef, //nguoi thue 
            card_id_renter: data.card_id_renter, //so cccd 
            room_id: roomRef, //lien ket giua phong tro va hop dong
            agreed_price: data.agreed_price, // gia phong sau dam phan
            room_name: roomData?.name, //ten phong
            room_price: roomData?.price, //gia phong chu tro dinh gia
            status_id: data.status_id // trang thai hop dong
        });

        for (const tenant of data.tenants) {
            await contractRef.collection("tenants").add({
                name: tenant.name,
                phone: tenant.phone,
                id_card: tenant.id_card,
                join_date: ConvertDate(tenant.join_date),
                leave_date: tenant.leave_date
                    ? ConvertDate(tenant.leave_date)
                    : null
            });
        }

        return {
            success: true,
            contract_id: contractRef.id,
            message: "Tạo hợp đồng thành công"
        };
    } catch (error) {
        console.error("Create contract error:", error);
        throw error;
    }
};
//gia han hop dong

export const renewContract = async (
    oldContractId: string,
    data: CreateContractData
) => {
    const oldRef = adminDb.doc(`contract/${oldContractId}`);
    const oldSnap = await oldRef.get();

    if (!oldSnap.exists) {
        throw new Error("Hợp đồng cũ không tồn tại");
    }

    const result = await createContract(data);
    const statusref = adminDb.collection("status").doc("renew")
    await oldRef.update({
        status_id: statusref
    });

    await adminDb.doc(`contract/${result.contract_id}`).update({
        previous_contract_id: oldContractId
    });

    return result;
}