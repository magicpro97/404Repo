import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ProductPromoted, } from "./models";

const getproduct = async (db: admin.firestore.Firestore, id: string) => {
    const snapshot = await db.collection("applied")
        .where("id", "==", id).get();
    const ans: ProductPromoted[] = [];
    snapshot.forEach(doc => {
        ans.push(doc.data() as ProductPromoted);
    });
    return ans;
}
export const editPromo = (db: admin.firestore.Firestore) => functions.https.onRequest(async (req, res) => {
    const product_id = req.body.id;
    const promo_name = req.body.name;
    const newval = req.body.newval;
    const product = await getproduct(db, product_id);
    let ans: ProductPromoted = product[0];
    let dis = ans.discount;
    switch (promo_name) {
        case "birthdayPromo":
            dis += 10;
            ans.promoID.birthdayPromo = newval;
            break;
        case "directPromo":
            dis += 20;
            ans.promoID.directPromo = newval;
            break;
        case "giftPromo":
            ans.promoID.giftPromo = newval;
            dis += 0;
            break;
        case "voucherPromo":
            ans.promoID.voucherPromo = newval;
            dis += 5;
            break;
        default:
            break;
    }
    ans.discount = dis;
    ans.newPrice = ans.price * ((100 - dis) * 0.01);
    await db.collection("applied").doc(ans.id.toString()).set(ans);
    res.send(ans);
});
