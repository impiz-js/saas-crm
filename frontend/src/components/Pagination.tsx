interface Props {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7);

  return (
    <div className="flex items-center gap-2">
      <button className="btn-secondary" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Назад
      </button>
      {pages.map((item) => (
        <button
          key={item}
          className={
            item === page ? "btn-primary" : "btn-secondary"
          }
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
      <button
        className="btn-secondary"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Далее
      </button>
    </div>
  );
}
