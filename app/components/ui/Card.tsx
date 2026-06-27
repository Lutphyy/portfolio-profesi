import { cn } from "~/utils/helpers";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export function Card({
  children,
  className,
  hover = false,
  as: Component = "div",
  ...props
}: CardProps & Record<string, unknown>) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        hover &&
          "hover:border-indigo-500/30 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-2", className)}>{children}</div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn("px-6 py-4", className)}>{children}</div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "px-6 pb-6 pt-2 flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
