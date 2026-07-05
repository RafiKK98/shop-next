import { FilterSection } from "./filter-section";
import { FilterCheckboxGroup } from "./filter-checkbox-group";
import { FilterPriceRange } from "./filter-price-range";
import type { FilterState } from "@/lib/filters";
import { catalogCategories, catalogBrands, priceRange, ratingOptions, discountOptions } from "@/data/catalog";

interface FilterSidebarProps {
  filters: FilterState;
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onToggleRating: (rating: number) => void;
  onToggleAvailability: (value: string) => void;
  onToggleDiscount: (value: number) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
}

const availabilityOptions = [
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

export function FilterSidebar({
  filters,
  onToggleCategory,
  onToggleBrand,
  onToggleRating,
  onToggleAvailability,
  onToggleDiscount,
  onPriceChange,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-1">
      <h2 className="sr-only">Filters</h2>

      <FilterSection title="Category">
        <FilterCheckboxGroup
          name="category"
          options={catalogCategories.map((c) => ({ label: c.name, value: c.slug, count: c.count }))}
          selectedValues={filters.categories}
          onToggle={onToggleCategory}
        />
      </FilterSection>

      <FilterSection title="Brand">
        <FilterCheckboxGroup
          name="brand"
          options={catalogBrands.map((b) => ({ label: b.name, value: b.name.toLowerCase(), count: b.count }))}
          selectedValues={filters.brands}
          onToggle={onToggleBrand}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <FilterPriceRange
          min={priceRange.min}
          max={priceRange.max}
          value={{ min: filters.minPrice, max: filters.maxPrice }}
          onChange={onPriceChange}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <FilterCheckboxGroup
          name="rating"
          options={ratingOptions.map((r) => ({ label: `${r} ★ & up`, value: String(r) }))}
          selectedValues={filters.minRating != null ? [String(filters.minRating)] : []}
          onToggle={(v) => onToggleRating(Number(v))}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <FilterCheckboxGroup
          name="availability"
          options={availabilityOptions}
          selectedValues={filters.availability}
          onToggle={onToggleAvailability}
        />
      </FilterSection>

      <FilterSection title="Discount">
        <FilterCheckboxGroup
          name="discount"
          options={discountOptions.map((d) => ({ label: d.label, value: d.value }))}
          selectedValues={filters.minDiscount != null ? [String(filters.minDiscount)] : []}
          onToggle={(v) => onToggleDiscount(Number(v))}
        />
      </FilterSection>
    </aside>
  );
}
