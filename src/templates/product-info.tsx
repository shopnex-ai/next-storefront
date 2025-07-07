import { Heading, Text } from "@medusajs/ui";
import { RichText } from "@payloadcms/richtext-lexical/react";
import _ from "lodash";
import Link from "next/link";

type ProductInfoProps = {
    product: any;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
    return (
        <div id="product-info">
            <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
                {product.collections[0] && (
                    <Link
                        className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
                        href={`/collections/${product.collections[0].handle}`}
                    >
                        {product.collections[0].title}
                    </Link>
                )}
                <Heading
                    className="text-3xl leading-10 text-ui-fg-base"
                    data-testid="product-title"
                    level="h2"
                >
                    {product.title}
                </Heading>

                <RichText data={product.description} />
                {/* <Text
                    className="text-medium text-ui-fg-subtle whitespace-pre-line"
                    data-testid="product-description"
                >
                    {_.get(
                        product,
                        "description.root.children[0].children[0].text",
                        ""
                    )}
                </Text> */}
            </div>
        </div>
    );
};

export default ProductInfo;
