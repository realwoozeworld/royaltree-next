import { cookies } from "next/headers";
import AdminClient from "./AdminClient";
import {
  fetchAdminDataAction,
  getAdminSessionAction,
  getDatabaseStatusAction,
} from "@/lib/adminActions";
import { DEFAULT_SAPLING_PRODUCTS, OrderRecord } from "@/types/admin";
import { DEFAULT_SITE_CONTENT } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Read cookies to ensure this route is executed dynamically per request on server
  await cookies();

  const [session, dbStatus] = await Promise.all([
    getAdminSessionAction(),
    getDatabaseStatusAction(),
  ]);

  let orders: OrderRecord[] = [];
  let products = DEFAULT_SAPLING_PRODUCTS;
  let content = DEFAULT_SITE_CONTENT;

  if (session.authenticated) {
    const data = await fetchAdminDataAction();
    if (data.ok) {
      orders = data.orders;
      products = data.products;
      content = data.content;
    }
  }

  return (
    <AdminClient
      initialSessionEmail={session.email ?? null}
      initialDbConnected={dbStatus.connected}
      initialOrders={orders}
      initialProducts={products}
      initialContent={content}
    />
  );
}
