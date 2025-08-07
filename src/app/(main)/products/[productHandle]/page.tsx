import type { Metadata } from "next";

import ProductTemplate from "@/templates/product";
import { notFound } from "next/navigation";
import { payloadSdk } from "@/utils/payload-sdk";

type ProductPageProps = {
    params: Promise<{ productHandle: string }>;
};

export async function generateMetadata(
    props: ProductPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { productHandle } = params;

    const product = {
        handle: productHandle,
        thumbnail:
            "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
        title: "Product 1",
    };

    if (!product) {
        notFound();
    }

    return {
        description: `${product.title}`,
        openGraph: {
            description: `${product.title}`,
            images: product.thumbnail ? [product.thumbnail] : [],
            title: `${product.title} | Medusa Store`,
        },
        title: `${product.title} | Medusa Store`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;

    const product = await payloadSdk.find({
        collection: "products",
        limit: 1,
        where: {
            handle: {
                equals: params.productHandle,
            },
        },
    });

    if (!product.docs.length) {
        notFound();
    }

    return <ProductTemplate product={product.docs[0]} />;
}
