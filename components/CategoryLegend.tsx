import { Category } from "@/types/registry";
import { getCategoryColor } from "../services/duneService";

export const CategoryLegend = () => {
  const categories: Category[] = [
    "DeFi",
    "Infrastructure",
    "NFTs",
    "Games",
    "Social",
    "Other",
  ];

  return (
    <div className="flex mt-6 gap-4">
      {categories.map((category) => (
        <div key={category} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getCategoryColor(category) }}
          />
          <span className="text-sm text-gray-400">{category}</span>
        </div>
      ))}
    </div>
  );
};
