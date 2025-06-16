import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        {children}
      </div>
    </div>
  );
}
