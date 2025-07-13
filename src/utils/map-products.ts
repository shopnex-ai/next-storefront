import type { Product } from "@shopnex/types";

export const mapProducts = (products: Product[]) => {
    return products
        .map((product) => {
            return {
                ...product,
                variants: product.variants?.map((variant) => {
                    let imageUrl =
                        variant.imageUrl ||
                        (typeof variant.gallery?.[0] === "object"
                            ? variant.gallery[0].url
                            : undefined);

                    if (!imageUrl?.includes("http")) {
                        imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`;
                    }

                    return {
                        ...variant,
                        imageUrl,
                    };
                }),
            };
        })
        .filter((product) => product.visible);
};
