import {
  LinkLookupForm,
  type LinkLookupFormProps,
  type LinkLookupOption,
  type LinkLookupRoleOption,
} from "./LinkLookupForm";

export interface LinkContactFormProps {
  roles: readonly LinkLookupRoleOption[];
  onSubmit: (contactId: string, role: string) => Promise<void>;
  onLinked?: () => void;
  onError?: (error: unknown) => void;
  loadOptions: (query: string) => Promise<LinkLookupOption[]>;
}

export function LinkContactButton({
  roles,
  onSubmit,
  onLinked,
  onError,
  loadOptions,
}: LinkContactFormProps) {
  const props: LinkLookupFormProps = {
    triggerLabel: "Link Contact",
    searchPlaceholder: "Search contacts...",
    rolePlaceholder: "Role",
    roleMode: "select",
    roleOptions: roles,
    initialRole: roles[0]?.value ?? "",
    onSubmit,
    onLinked,
    onError,
    loadOptions,
  };
  return <LinkLookupForm {...props} />;
}
