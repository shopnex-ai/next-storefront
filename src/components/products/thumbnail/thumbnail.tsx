import { clx, Container } from "@medusajs/ui";
import Image from "next/image";
import React from "react";

import PlaceholderImage from "../../placeholder-image";

type ThumbnailProps = {
    className?: string;
    "data-testid"?: string;
    // TODO: Fix image typings
    images?: any[] | null;
    isFeatured?: boolean;
    size?: "full" | "large" | "medium" | "small" | "square";
    thumbnail?: null | string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
    className,
    "data-testid": dataTestid,
    images,
    isFeatured,
    size = "small",
    thumbnail,
}) => {
    const initialImage = thumbnail || images?.[0]?.url;

    return (
        <Container
            className={clx(
                "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
                className,
                {
                    "aspect-[1/1]": size === "square",
                    "aspect-[9/16]": !isFeatured && size !== "square",
                    "aspect-[11/14]": isFeatured,
                    "w-[180px]": size === "small",
                    "w-[290px]": size === "medium",
                    "w-[440px]": size === "large",
                    "w-full": size === "full",
                }
            )}
            data-testid={dataTestid}
        >
            <ImageOrPlaceholder image={initialImage} size={size} />
        </Container>
    );
};

const ImageOrPlaceholder = ({
    image,
    size,
}: { image?: string } & Pick<ThumbnailProps, "size">) => {
    return image ? (
        <Image
            alt="Thumbnail"
            className="absolute inset-0 object-cover object-center"
            draggable={false}
            fill
            quality={50}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            src={image}
        />
    ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
            <PlaceholderImage size={size === "small" ? 16 : 24} />
        </div>
    );
};

export default Thumbnail;
