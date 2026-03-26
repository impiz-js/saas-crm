interface Props {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="card p-6 text-center text-ink-600">
      <div className="font-semibold text-ink-800">{title}</div>
      {description && <p className="mt-2 text-sm">{description}</p>}
    </div>
  );
}
