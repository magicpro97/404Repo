import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { ProductTb, Body } from "./models";

const url = "https://apis.haravan.com/com/products.json";

export const loadProduct = (db: admin.firestore.Firestore) => functions.https.onRequest(async (req, res) => {
    const access_token = req.query['access_tk'];
    if (access_token) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': "application/json"
            },
            method: 'GET',
        });
        if (response.status === 200) {
            const obj = JSON.parse(await response.text()) as Body;
            const pro = obj.products;
            const ans = [];
            for (const it of pro) {
                const test: ProductTb = {
                    id: it.id,
                    cat: it.product_type,
                    price: it.variants[0].price
                };
                ans.push(test);
            }
            for (const ele of ans) {
                await db.collection("products").doc(ele.id.toString()).set(ele);
            }
            res.send(obj);
        } else {
            res.send(response)
        }
    } else {
        res.send("Invalid request!");
    }
});
