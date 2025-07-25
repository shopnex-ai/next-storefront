import type { IconProps } from "@/types/icon";
import type React from "react";

const Ideal: React.FC<IconProps> = ({
    color = "currentColor",
    size = "20",
    ...attributes
}) => {
    return (
        <svg
            fill={color}
            height="24px"
            role="img"
            viewBox="0 0 24 24"
            width="24px"
            xmlns="http://www.w3.org/2000/svg"
            {...attributes}
        >
            <title>Bancontact icon</title>
            <path d="M21.385 9.768h-7.074l-4.293 5.022H1.557L3.84 12.1H1.122C.505 12.1 0 12.616 0 13.25v2.428c0 .633.505 1.15 1.122 1.15h12.933c.617 0 1.46-.384 1.874-.854l1.956-2.225 3.469-3.946.031-.035zm-1.123 1.279l-.751.855.75-.855zm2.616-3.875H9.982c-.617 0-1.462.384-1.876.853l-5.49 6.208h7.047l4.368-5.02h8.424l-2.263 2.689h2.686c.617 0 1.122-.518 1.122-1.151V8.323c0-.633-.505-1.15-1.122-1.15zm-1.87 3.024l-.374.427-.1.114.474-.54z" />
        </svg>
    );
};

export default Ideal;
