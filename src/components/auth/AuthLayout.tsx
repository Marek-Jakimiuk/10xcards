import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="container mx-auto mt-12 px-4 py-8 max-w-md">
      <div className="bg-white border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 max-w-[32rem] mx-auto">
        <h1 className="text-6xl font-bold mb-4">{title}</h1>
        <p className="text-gray-800 mb-8">{description}</p>
        {children}
      </div>
    </div>
  );
}
