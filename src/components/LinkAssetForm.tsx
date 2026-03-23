import {
  LinkLookupForm,
  type LinkLookupFormProps,
  type LinkLookupOption,
} from "./LinkLookupForm";

export interface LinkAssetFormProps {
  onSubmit: (assetId: string, role: string) => Promise<void>;
  onLinked?: () => void;
  onError?: (error: unknown) => void;
  loadOptions: (query: string) => Promise<LinkLookupOption[]>;
  initialRole?: string;
}

export function LinkAssetButton({
  onSubmit,
  onLinked,
  onError,
  loadOptions,
  initialRole = "subject_property",
}: LinkAssetFormProps) {
  const props: LinkLookupFormProps = {
    triggerLabel: "Link Property",
    searchPlaceholder: "Search properties...",
    rolePlaceholder: "Role (e.g. subject_property)",
    roleMode: "text",
    initialRole,
    onSubmit,
    onLinked,
    onError,
    loadOptions,
  };
  return <LinkLookupForm {...props} />;
}
