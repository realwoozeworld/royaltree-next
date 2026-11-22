export interface SaplingProductInput {
  id: string;
  nameKa: string;
  nameEn: string;
  price: number;
  stockCount: number;
  heightKa?: string;
  heightEn?: string;
}

export interface RoiParametersInput {
  spacingMeters: number;
  treesPerHectare: number;
  timberM3PerTree: number;
  annualCo2TonsPerTree: number;
  harvestCycleYears: number;
}

export interface OrderRecord {
  id: string;
  created_at: string;
  fullName: string;
  phone: string;
  region?: string;
  notes?: string;
  tier1: number;
  tier2: number;
  tier3: number;
  totalTrees: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const DEFAULT_SAPLING_PRODUCTS: SaplingProductInput[] = [
  {
    id: "tier1",
    nameKa: "1-წლიანი ნერგი",
    nameEn: "1-Year Seedling",
    price: 10,
    stockCount: 5000,
    heightKa: "1.0 – 1.5 მეტრი",
    heightEn: "1.0 – 1.5 meters",
  },
  {
    id: "tier2",
    nameKa: "ელიტარული ნერგი",
    nameEn: "Elite Seedling",
    price: 20,
    stockCount: 3200,
    heightKa: "2.0 – 2.5 მეტრი",
    heightEn: "2.0 – 2.5 meters",
  },
  {
    id: "tier3",
    nameKa: "სამეფო ეგზემპლარი",
    nameEn: "Royal Specimen",
    price: 50,
    stockCount: 850,
    heightKa: "3.0 – 4.0 მეტრი",
    heightEn: "3.0 – 4.0 meters",
  },
];
