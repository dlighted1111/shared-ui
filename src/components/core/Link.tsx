import { forwardRef, type AnchorHTMLAttributes, type CSSProperties } from "react";
import { cx } from "../../lib/cx";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  muted?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { muted = false, className, style, ...props },
  ref,
) {
  const linkStyle: CSSProperties = {
    color: muted ? "var(--lt-color-text-muted)" : "var(--lt-color-primary)",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    fontSize: "var(--lt-font-size-sm)",
    ...style,
  };

  return <a {...props} ref={ref} className={cx(className)} style={linkStyle} />;
});
