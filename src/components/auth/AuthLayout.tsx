import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  // Check if we're in browser and read config from data attributes
  const isEnabled = typeof document !== 'undefined';
  const flipEnabled = isEnabled && document.body.getAttribute('data-vt-auth-flip') === '1';
  const bounceEnabled = isEnabled && document.body.getAttribute('data-vt-auth-bounce') === '1';
  const fadeEnabled = isEnabled && document.body.getAttribute('data-vt-auth-fade') === '1';

  return (
    <div className="container mx-auto mt-12 px-4 py-8 max-w-md">
      <div
        className="bg-white border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 max-w-[32rem] mx-auto"
        style={{ viewTransitionName: flipEnabled ? "auth-card" : undefined }}
      >
        <h1 
          className="text-6xl font-bold mb-4" 
          style={{ viewTransitionName: bounceEnabled ? "auth-title" : undefined }}
        >
          {title}
        </h1>
        <p className="text-gray-800 mb-8">{description}</p>
        <div style={{ viewTransitionName: fadeEnabled ? "auth-form" : undefined }}>
          {children}
        </div>
      </div>
    </div>
  );
}
