import type { SortOptions } from "@/utils/sort-options";

import CollectionTemplate from "@/templates/collections";
import { notFound } from "next/navigation";
import { mapProducts } from "@/utils/map-products";
import { payloadSdk } from "@/utils/payload-sdk";

type Props = {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{
        page?: string;
        sortBy?: SortOptions;
    }>;
};

export default async function CollectionPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { page, sortBy } = searchParams;

    const collectionData = await payloadSdk.find({
        collection: "collections",
        sort: "createdAt",
        where: {
            handle: {
                equals: params.handle,
            },
        },
    });

    const collection = collectionData.docs[0];

    const products = await payloadSdk.find({
        collection: "products",
        sort: "createdAt",
        where: {
            collections: {
                equals: collection.id,
            },
        },
    });

    collection.products = mapProducts(products.docs) as any;

    if (!collection) {
        notFound();
    }

    return (
        <CollectionTemplate
            collection={collection}
            page={page}
            sortBy={sortBy}
        />
    );
}
