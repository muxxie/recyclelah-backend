import { type InsertFacility, type InsertMarketPrice } from "../shared/schema";

// ✅ Facilities seed data
export const facilitySeed: InsertFacility[] = [
  {
    name: "Facility A",
    address: "123 Green Street",
    latitude: "3.1415927",
    longitude: "101.1234567",
    acceptedMaterials: ["plastic", "paper", "metal"], // ✅ plain array for JSONB
    phone: "012-3456789",
    operatingHours: "Mon-Fri 9am-5pm",
  },
  {
    name: "Facility B",
    address: "456 Eco Avenue",
    latitude: "3.1514927",
    longitude: "101.1334567",
    acceptedMaterials: ["glass", "electronics"], // ✅ plain array for JSONB
    phone: "012-9876543",
    operatingHours: "Daily 10am-8pm",
  },
  {
    name: "Facility C",
    address: "789 Recycle Road",
    latitude: "3.1614927",
    longitude: "101.1434567",
    acceptedMaterials: ["plastic", "paper", "glass", "metal"], // ✅ plain array for JSONB
    phone: "012-5551234",
    operatingHours: "Mon-Sat 8am-6pm",
  },
];

// ✅ Market prices seed data
export const marketPriceSeed: InsertMarketPrice[] = [
  { materialType: "plastic", pricePerKg: "0.50" },
  { materialType: "paper", pricePerKg: "0.30" },
  { materialType: "metal", pricePerKg: "1.20" },
  { materialType: "glass", pricePerKg: "0.40" },
  { materialType: "electronics", pricePerKg: "2.50" },
];
