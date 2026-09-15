export type CharityIcon = "droplets" | "code" | "heart" | "bug" | "book";

export interface Charity {
  id: string;
  name: string;
  mission: string;
  icon: CharityIcon;
  accent: "blue" | "purple";
}

export interface CharityAllocation {
  charityId: string;
  percent: number;
}

export const CHARITY_CATALOG: Charity[] = [
  {
    id: "water-org",
    name: "Water.org",
    mission: "Clean water access",
    icon: "droplets",
    accent: "blue",
  },
  {
    id: "girls-who-code",
    name: "Girls Who Code",
    mission: "Education and opportunity",
    icon: "code",
    accent: "purple",
  },
  {
    id: "givedirectly",
    name: "GiveDirectly",
    mission: "Direct cash transfers",
    icon: "heart",
    accent: "blue",
  },
  {
    id: "amf",
    name: "Against Malaria Foundation",
    mission: "Malaria prevention",
    icon: "bug",
    accent: "purple",
  },
  {
    id: "wikipedia",
    name: "Wikimedia Foundation",
    mission: "Free knowledge for everyone",
    icon: "book",
    accent: "blue",
  },
];

export const DEFAULT_ALLOCATIONS: CharityAllocation[] = [
  { charityId: "water-org", percent: 60 },
  { charityId: "girls-who-code", percent: 40 },
];

export function getCharity(id: string): Charity | undefined {
  return CHARITY_CATALOG.find((charity) => charity.id === id);
}

export function allocationTotal(allocations: CharityAllocation[]): number {
  return allocations.reduce((sum, item) => sum + item.percent, 0);
}

export function setAllocationPercent(
  allocations: CharityAllocation[],
  charityId: string,
  nextPercent: number,
): CharityAllocation[] {
  const target = allocations.find((item) => item.charityId === charityId);
  if (!target || allocations.length === 1) {
    return allocations.map((item) =>
      item.charityId === charityId ? { ...item, percent: 100 } : item,
    );
  }

  const clamped = Math.max(0, Math.min(100, Math.round(nextPercent)));
  const others = allocations.filter((item) => item.charityId !== charityId);
  const othersTotal = others.reduce((sum, item) => sum + item.percent, 0);
  const remainder = 100 - clamped;

  const redistributed = others.map((item) => {
    if (othersTotal === 0) {
      return {
        ...item,
        percent: Math.floor(remainder / others.length),
      };
    }
    return {
      ...item,
      percent: Math.round((item.percent / othersTotal) * remainder),
    };
  });

  const distributed = redistributed.reduce(
    (sum, item) => sum + item.percent,
    0,
  );
  if (redistributed[0] && distributed !== remainder) {
    redistributed[0] = {
      ...redistributed[0],
      percent: redistributed[0].percent + (remainder - distributed),
    };
  }

  return allocations.map((item) => {
    if (item.charityId === charityId) {
      return { ...item, percent: clamped };
    }
    return (
      redistributed.find((other) => other.charityId === item.charityId) ?? item
    );
  });
}

export function addCharity(
  allocations: CharityAllocation[],
  charityId: string,
): CharityAllocation[] {
  if (allocations.some((item) => item.charityId === charityId)) {
    return allocations;
  }

  const nextCount = allocations.length + 1;
  const equal = Math.floor(100 / nextCount);
  const leftover = 100 - equal * nextCount;
  return [
    ...allocations.map((item) => ({ ...item, percent: equal })),
    { charityId, percent: equal + leftover },
  ];
}

export function removeCharity(
  allocations: CharityAllocation[],
  charityId: string,
): CharityAllocation[] {
  if (allocations.length <= 1) {
    return allocations;
  }

  const remaining = allocations.filter((item) => item.charityId !== charityId);
  const first = remaining[0];
  if (!first) {
    return remaining;
  }
  return setAllocationPercent(remaining, first.charityId, first.percent);
}

export function charitySummaryLabel(allocations: CharityAllocation[]): string {
  const first = getCharity(allocations[0]?.charityId ?? "");
  if (!first) {
    return "Your selected charities";
  }
  if (allocations.length === 1) {
    return first.name;
  }
  return `${first.name} +${allocations.length - 1}`;
}
