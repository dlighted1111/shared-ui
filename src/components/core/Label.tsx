import { forwardRef, type CSSProperties, type LabelHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { fieldLabelStyle } from "./controlStyles";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, style, ...props },
  ref,
) {
  const labelStyle: CSSProperties = {
    ...fieldLabelStyle,
    ...style,
  };

  return <label {...props} ref={ref} className={cx(className)} style={labelStyle} />;
});
