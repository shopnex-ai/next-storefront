import { Text } from "@medusajs/ui";

import InteractiveLink from "./interactive-link";
import { payloadSdk } from "@/utils/payload-sdk";
import { mapProducts } from "@/utils/map-products";
import ProductPreview from "./product-preview";

export default async function ProductRail({ collection }: { collection: any }) {
    const products = await payloadSdk.find({
        collection: "products",
        limit: 3,
        sort: "createdAt",
        where: {
            collections: {
                equals: collection.id,
            },
        },
    });

    const pricedProducts = mapProducts(products.docs);

    return (
        <div className="content-container py-12 small:py-24">
            <div className="flex justify-between mb-8">
                <Text className="txt-xlarge">{collection.title}</Text>
                <InteractiveLink href={`/collections/${collection.handle}`}>
                    View all
                </InteractiveLink>
            </div>
            <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
                {pricedProducts.map((product) => (
                    <li key={product.id}>
                        <ProductPreview isFeatured product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
