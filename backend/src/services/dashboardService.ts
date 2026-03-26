import { prisma } from "../prisma.js";
import { LeadStatus } from "@prisma/client";

export async function getDashboardOverview() {
  const [totalLeads, totalDeals, closedDeals] = await Promise.all([
    prisma.lead.count(),
    prisma.deal.count(),
    prisma.deal.count({ where: { stage: "CLOSED" } })
  ]);

  const conversionRate = totalLeads === 0 ? 0 : Math.round((closedDeals / totalLeads) * 1000) / 10;

  const leadsByStatus = await prisma.lead.groupBy({
    by: ["status"],
    _count: { status: true }
  });

  const lastDays = 14;
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * lastDays);
  const recentLeads = await prisma.lead.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true }
  });

  const series: { date: string; leads: number }[] = [];
  for (let i = lastDays - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * i);
    const key = date.toISOString().slice(0, 10);
    series.push({ date: key, leads: 0 });
  }

  for (const lead of recentLeads) {
    const key = lead.createdAt.toISOString().slice(0, 10);
    const bucket = series.find((item) => item.date === key);
    if (bucket) bucket.leads += 1;
  }

  const recentActivities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: { select: { name: true, role: true } } }
  });

  const statusMap: Record<LeadStatus, number> = {
    NEW: 0,
    IN_PROGRESS: 0,
    CLOSED: 0
  };

  for (const item of leadsByStatus) {
    statusMap[item.status] = item._count.status;
  }

  return {
    totalLeads,
    totalDeals,
    closedDeals,
    conversionRate,
    leadsByStatus: statusMap,
    leadsSeries: series,
    recentActivities
  };
}
