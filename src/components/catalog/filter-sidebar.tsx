import { FilterSection } from "./filter-section";
import { FilterCheckboxGroup } from "./filter-checkbox-group";
import { FilterPriceRange } from "./filter-price-range";
import { catalogCategories, catalogBrands, priceRange, ratingOptions, discountOptions } from "@/data/catalog";

const stockFilterOptions = [
  { label: "In Stock", value: "in-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
];

export function FilterSidebar() {
  return (
    <aside className="space-y-1">
      <h2 className="sr-only">Filters</h2>

      <FilterSection title="Category">
        <FilterCheckboxGroup
          name="category"
          options={catalogCategories.map((c) => ({ label: c.name, value: c.slug, count: c.count }))}
        />
      </FilterSection>

      <FilterSection title="Brand">
        <FilterCheckboxGroup
          name="brand"
          options={catalogBrands.map((b) => ({ label: b.name, value: b.name.toLowerCase(), count: b.count }))}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <FilterPriceRange min={priceRange.min} max={priceRange.max} />
      </FilterSection>

      <FilterSection title="Rating">
        <FilterCheckboxGroup
          name="rating"
          options={ratingOptions.map((r) => ({ label: `${r} ★ & up`, value: String(r) }))}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <FilterCheckboxGroup
          name="availability"
          options={stockFilterOptions}
        />
      </FilterSection>

      <FilterSection title="Discount">
        <FilterCheckboxGroup
          name="discount"
          options={discountOptions.map((d) => ({ label: d.label, value: d.value }))}
        />
      </FilterSection>
    </aside>
  );
}
