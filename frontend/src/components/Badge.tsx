interface Props {
  label: string;
  variant?: "primary" | "success" | "warning" | "neutral";
}

const styles: Record<string, string> = {
  primary: "bg-brand-100 text-brand-900",
  success: "bg-mint-100 text-mint-600",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-ink-100 text-ink-600"
};

export default function Badge({ label, variant = "neutral" }: Props) {
  return <span className={`badge ${styles[variant]}`}>{label}</span>;
}
