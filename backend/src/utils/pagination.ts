export function getPagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(50, Math.max(5, Number(query.pageSize || 10)));
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip, take: pageSize };
}
