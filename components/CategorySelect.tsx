import { getAllCategories, getCategoryLabel } from "@/utils/categoryMapping";
import { getCategoryColor } from "@/services/duneService";
import { Category } from "@/types/registry";

interface CategorySelectProps {
  value: Category[] | [];
  onChange: (category: Category[] | []) => void;
  categories: Category[];
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const categories = getAllCategories();

  return (
    <div className="space-y-2">
      <div className="w-60">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Category
        </label>
        <div className="relative">
          <select
            className="w-full h-10 bg-transparent border border-gray-700 rounded-lg pl-8 pr-3 text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            value={value[0] || ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              onChange(selectedValue ? [selectedValue as Category] : []);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
          {/* Color indicator for selected category */}
          {value[0] && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm"
              style={{ backgroundColor: getCategoryColor(value[0]) }}
            />
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
