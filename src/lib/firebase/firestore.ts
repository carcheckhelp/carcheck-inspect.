import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./config";

const ORDERS_COLLECTION = "orders";

/**
 * Fetches a single order document from Firestore by its ID.
 * @param orderId The ID of the order to fetch.
 * @returns The order data or null if not found.
 */
export async function getOrderById(orderId: string): Promise<any | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw new Error("Could not fetch order.");
  }
}

/**
 * Updates an order in Firestore with the generated inspection report.
 * @param orderId The ID of the order to update.
 * @param reportMarkdown The inspection report content in Markdown format.
 * @param status The new status for the order, typically "Completado".
 */
export async function updateOrderWithReport(orderId: string, reportMarkdown: string, status: string): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      report: reportMarkdown,
      status: status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Could not update order.");
  }
}

/**
 * Fetches all orders for a given client email.
 * @param email The email of the client.
 * @returns An array of order data.
 */
export async function getOrdersByClient(email: string): Promise<any[]> {
    try {
        const q = query(collection(db, ORDERS_COLLECTION), where("client.email", "==", email));
        const querySnapshot = await getDocs(q);
        const orders: any[] = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error("Error getting client orders:", error);
        throw new Error("Could not fetch client orders.");
    }
}
