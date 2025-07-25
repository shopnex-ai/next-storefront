import type { Order } from "@shopnex/types";

import { Text } from "@medusajs/ui";

type OrderDetailsProps = {
    order: Order;
    showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
    const formatStatus = (str: string) => {
        const formatted = str.split("_").join(" ");

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };

    return (
        <div>
            <Text>
                We have sent the order confirmation details to{" "}
                <span
                    className="text-ui-fg-medium-plus font-semibold"
                    data-testid="order-email"
                >
                    {typeof order.user !== "number" && order.user?.email}
                </span>
                .
            </Text>
            <Text className="mt-2">
                Order date:{" "}
                <span data-testid="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                </span>
            </Text>
            <Text className="mt-2 text-ui-fg-interactive">
                Order number:{" "}
                <span data-testid="order-id">{order.orderId}</span>
            </Text>

            <div className="flex items-center text-compact-small gap-x-4 mt-4">
                {showStatus && (
                    <>
                        <Text>
                            Order status:{" "}
                            <span
                                className="text-ui-fg-subtle "
                                data-testid="order-status"
                            >
                                {formatStatus(order.orderStatus)}
                            </span>
                        </Text>
                        <Text>
                            Payment status:{" "}
                            <span
                                className="text-ui-fg-subtle "
                                sata-testid="order-payment-status"
                            >
                                {formatStatus(order.paymentStatus)}
                            </span>
                        </Text>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
