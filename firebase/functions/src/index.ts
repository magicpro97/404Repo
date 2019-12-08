import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { auth } from "./auth";
import { loadProduct } from "./load_product";
admin.initializeApp();

const db = admin.firestore();

exports.auth = functions.https.onRequest(auth);
exports.loadProduct = loadProduct(db);
