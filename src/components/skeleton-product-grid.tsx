import repeat from "@/utils/repeat";
import SkeletonProductPreview from "./skeletion-product-preview";

const SkeletonProductGrid = ({
    numberOfProducts = 8,
}: {
    numberOfProducts?: number;
}) => {
    return (
        <ul
            className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 flex-1"
            data-testid="products-list-loader"
        >
            {repeat(numberOfProducts).map((index) => (
                <li key={index}>
                    <SkeletonProductPreview />
                </li>
            ))}
        </ul>
    );
};

export default SkeletonProductGrid;
