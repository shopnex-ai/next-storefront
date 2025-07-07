import { Suspense } from "react";

import type { SortOptions } from "../../utils/sort-options";

import RefinementList from "@/components/refinement-list";
import SkeletonProductGrid from "@/components/skeleton-product-grid";
import PaginatedProducts from "./paginated-product";

export default function CollectionTemplate({
    collection,
    page,
    sortBy,
}: {
    collection: any;
    page?: string;
    sortBy?: SortOptions;
}) {
    const pageNumber = page ? Number.parseInt(page) : 1;
    const sort = sortBy || "created_at";

    return (
        <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
            <RefinementList sortBy={sort} />
            <div className="w-full">
                <div className="mb-8 text-2xl-semi">
                    <h1>{collection.title}</h1>
                </div>
                <Suspense
                    fallback={
                        <SkeletonProductGrid
                            numberOfProducts={collection.products?.length}
                        />
                    }
                >
                    <PaginatedProducts
                        collectionId={collection.id}
                        page={pageNumber}
                        products={collection.products}
                        sortBy={sort}
                    />
                </Suspense>
            </div>
        </div>
    );
}
