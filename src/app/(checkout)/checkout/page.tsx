import type { Metadata } from "next";

import React from "react";

import CheckoutPage from "@/templates/checkout/checkout-page";

export const metadata: Metadata = {
    title: "Checkout",
};

export const dynamic = "force-dynamic";

export default function Checkout() {
    return (
        <div>
            <CheckoutPage />
        </div>
    );
}
