import { Popover, PopoverContent, PopoverTrigger } from "./core";

export interface ProcessInfoPopoverProps {
  title: string;
  content: string;
}

function InfoGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function ProcessInfoPopover({ title, content }: ProcessInfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md"
          style={{ color: "#9CA3AF", cursor: "pointer" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#6B7280";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#9CA3AF";
          }}
          aria-label="Page info"
        >
          <InfoGlyph />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="border border-border bg-popover text-popover-foreground"
        style={{ maxWidth: 480, padding: 16, fontSize: 13, lineHeight: 1.6 }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }} className="text-foreground">
          {title}
        </p>
        <p style={{ color: "#374151" }}>{content}</p>
      </PopoverContent>
    </Popover>
  );
}
