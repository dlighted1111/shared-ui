import { forwardRef, type HTMLAttributes, type TableHTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}
export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ className, ...props }, ref) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        {...props}
        ref={ref}
        className={cx(className)}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          captionSide: "bottom",
          fontSize: "var(--lt-font-size-sm)",
        }}
      />
    </div>
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...props },
  ref,
) {
  return <thead {...props} ref={ref} className={cx(className)} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return <tbody {...props} ref={ref} className={cx(className)} />;
});

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { className, ...props },
  ref,
) {
  return <tfoot {...props} ref={ref} className={cx(className)} />;
});

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...props },
  ref,
) {
  return <tr {...props} ref={ref} className={cx(className)} style={{ borderBottom: "1px solid var(--lt-color-border)" }} />;
});

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, ...props },
  ref,
) {
  return (
    <th
      {...props}
      ref={ref}
      className={cx(className)}
      style={{
        textAlign: "left",
        fontWeight: 600,
        color: "var(--lt-color-text-muted)",
        padding: "10px 12px",
        verticalAlign: "middle",
      }}
    />
  );
});

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return (
    <td
      {...props}
      ref={ref}
      className={cx(className)}
      style={{
        padding: "10px 12px",
        verticalAlign: "middle",
      }}
    />
  );
});

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(
  { className, ...props },
  ref,
) {
  return (
    <caption
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ marginTop: "var(--lt-space-2)", color: "var(--lt-color-text-muted)" }}
    />
  );
});
