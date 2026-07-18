import React from 'react';

// Using clsx/tailwind-merge is a best practice, but we'll use a simple fallback until installed
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * PageContainer: The outermost wrapper for a page route.
 * Handles top-level margins and responsive structure.
 */
export function PageContainer({ children, className, ...props }: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col mx-auto animate-fade-in",
        "px-4 sm:px-6 lg:px-8", // space-4, space-6, space-8
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * SectionContainer: Groups related content vertically.
 * Handles spacing between major page sections.
 */
export function SectionContainer({ children, className, ...props }: LayoutProps) {
  return (
    <section
      className={cn(
        "py-6 md:py-8 lg:py-10", // space-6, space-8, space-10
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContentWrapperProps extends LayoutProps {
  size?: ContainerSize;
}

/**
 * ContentWrapper: Constrains content width horizontally.
 * Useful for centering reading columns or grid setups.
 */
export function ContentWrapper({ children, size = 'md', className, ...props }: ContentWrapperProps) {
  const sizeClasses: Record<ContainerSize, string> = {
    sm: "max-w-[var(--container-sm)]",
    md: "max-w-[var(--container-md)]",
    lg: "max-w-[var(--container-lg)]",
    xl: "max-w-[var(--container-xl)]",
    full: "w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
