import { getOrders } from "@/services/orders";

import Overview from "@/components/overview";

export default async function AccountPage() {
    const orders = await getOrders();
    return <Overview orders={orders} />;
}
