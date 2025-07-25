import type { SortOptions } from "./sort-options";

/**
 * Helper function to sort products by price until the store API supports sorting by price
 * @param products
 * @param sortBy
 * @returns products sorted by price
 */
export function sortProducts(products: any[], sortBy: SortOptions): any[] {
    const sortedProducts = products;

    if (["price_asc", "price_desc"].includes(sortBy)) {
        // Precompute the minimum price for each product
        sortedProducts.forEach((product) => {
            if (product.variants && product.variants.length > 0) {
                product._minPrice = Math.min(
                    ...product.variants.map(
                        (variant: any) =>
                            variant?.calculated_price?.calculated_amount || 0
                    )
                );
            } else {
                product._minPrice = Infinity;
            }
        });

        // Sort products based on the precomputed minimum prices
        sortedProducts.sort((a, b) => {
            const diff = a._minPrice! - b._minPrice!;
            return sortBy === "price_asc" ? diff : -diff;
        });
    }

    if (sortBy === "created_at") {
        sortedProducts.sort((a, b) => {
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        });
    }

    return sortedProducts;
}
