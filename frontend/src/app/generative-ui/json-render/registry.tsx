// Verbatim from the page's registry.tsx block.
import { z } from "zod";
import { MetricCard } from "./metric-card";
import { BarChart } from "./charts/bar-chart";
import { PieChart } from "./charts/pie-chart";

export const catalog = {
  MetricCard: {
    component: MetricCard,
    propsSchema: z.object({
      title: z.string(),
      value: z.number(),
      delta: z.number().optional(),
    }),
  },
  BarChart: {
    component: BarChart,
    propsSchema: z.object({
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
  PieChart: {
    component: PieChart,
    propsSchema: z.object({
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
};
