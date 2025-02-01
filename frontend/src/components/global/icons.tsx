import { LucideProps } from "lucide-react";
import Image from "next/image";

const Icons = {
    icon: () => (
        <Image src="/icons/logo.svg" alt="Axion" height={"20"} width={"20"} />
    ),
    circle1: (props: LucideProps) => (
        <svg {...props} width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21ZM1.00838 21C1.00838 32.0411 9.95893 40.9916 21 40.9916C32.0411 40.9916 40.9916 32.0411 40.9916 21C40.9916 9.95893 32.0411 1.00838 21 1.00838C9.95893 1.00838 1.00838 9.95893 1.00838 21Z" fill="currentColor" />
            <circle cx="21" cy="21" r="10" fill="currentColor" />
        </svg>
    ),
    circle2: (props: LucideProps) => (
        <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
        </svg>
    ),
};

export default Icons;
