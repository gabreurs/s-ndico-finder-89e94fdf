import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface PageBreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
  variant?: "light" | "dark";
}

export function PageBreadcrumb({ items, className, variant = "light" }: PageBreadcrumbProps) {
  return (
    <Breadcrumb className={cn("text-[12px]", className)}>
      <BreadcrumbList
        className={cn(
          variant === "dark" && "[&_a]:text-white/40 [&_a:hover]:text-white/70 [&_span]:text-white/60 [&_svg]:text-white/20"
        )}
      >
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" style={{ fontWeight: 400 }}>Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, i) => (
          <Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href} style={{ fontWeight: 400 }}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage style={{ fontWeight: 440 }}>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
