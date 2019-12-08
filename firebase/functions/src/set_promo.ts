import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ProductTb, ProductPromoted, Promotion } from "./models";

const mobile = async (db: admin.firestore.Firestore) => {
    const snapshot = await db.collection("products")
        .where("cat", "==", "mp").get();
    const ans: ProductTb[] = [];
    snapshot.forEach(doc => {
        ans.push(doc.data() as ProductTb);
    });
    return ans;
}


const promo = async (db: admin.firestore.Firestore) => {
    const snapshot = await db.collection("promotion")
        .where("categoryID", "==", 1).get();

    const ans: Promotion[] = [];
    snapshot.forEach(doc => {
        ans.push(doc.data() as Promotion);
    });
    return ans;
}
// const gift = (db: admin.firestore.Firestore) => db.collection("products").where("cat","==","gift").get().then(async snapshot => {
//   if (snapshot.empty) {
//     console.log('No matching documents.');
//     return;
//   }  
//   const ans=[];
//   snapshot.forEach(doc => {
//     ans.push(doc.data());
//   });
//   return ans;

// })
// .catch(err => {
//   console.log('Error getting documents', err);
// });

export const setPromo = (db: admin.firestore.Firestore) => functions.https.onRequest(async (req, res) => {
    const mobilePro = await mobile(db);
    const promotion = await promo(db);

    const ans = [];
    for (const it of mobilePro) {
        let xyz: any = {};
        let dis = 0;
        for (const prom of promotion) {
            if (it.price >= prom.srange && it.price <= prom.erange) {
                xyz[prom.name] = 1;
                dis += prom.discount;
            }
            else {
                xyz[prom.name] = 0;
            }
        }
        const app: ProductPromoted = {
            id: it.id,
            price: it.price,
            cat: it.cat,
            discount: dis,
            newPrice: it.price * ((100 - dis) * 0.01),
            promoID: xyz
        }
        ans.push(app);
    }
    for (const it of ans) {
        await db.collection("applied").doc(it.id.toString()).set(it);
    }
    res.send(ans);
});

// Promise.all([mobile, promo]).then(val => {
//     const mob = val[0];
//     const pro = val[1];
//     const apply = [];

//     for (const it of mob) {
//         var app = it;
//         var id = {};
//         var discount = 0;
//         for (const prom of pro) {
//             if (it.price >= prom.srange && it.price <= prom.erange) {
//                 id[prom.name] = 1;
//                 discount += prom.discount;
//             }
//             else {
//                 id[prom.name] = 0;
//             }
//         }
//         app["promoID"] = id;
//         app["discount"] = discount;
//         app["newPrice"] = app.price * ((100 - discount) * 0.01)
//         apply.push(app);
//     }
//     for (const it of apply) {
//         db.collection("applied").doc(it.id.toString()).set(it);
//     }
//     console.log(apply);
// })