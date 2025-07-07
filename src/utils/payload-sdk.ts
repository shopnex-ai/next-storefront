import type { Config } from "@shopnex/types";

import { PayloadSDK } from "@shopnex/payload-sdk";

const isBrowser = typeof window !== "undefined";

export const payloadSdk = new PayloadSDK<Config>({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
    baseInit: {
        headers: {
            "x-shop-handle": process.env.NEXT_PUBLIC_SHOP_HANDLE,
        },
    },
    fetch: isBrowser ? (...args) => window.fetch(...args) : undefined,
});
