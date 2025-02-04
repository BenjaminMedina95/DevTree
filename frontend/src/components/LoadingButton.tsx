import { FiLoader } from "react-icons/fi";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean;
    text: string;
}
export const LoadingButton = ({ loading, text, ...props }: LoadingButtonProps) => {
    return (
        <button
            {...props}
            className={` text-lg uppercase font-bold rounded-lg flex items-center justify-center 
      ${loading ? "cursor-not-allowed" : " cursor-pointer"} `}
            disabled={loading || props.disabled}
        >
            {loading ? <FiLoader className="animate-spin" size={22} /> : text}
        </button>
    );
};
