import type { ProductDetailData } from "@/data/product-detail";

interface DescriptionSectionProps {
  detail: ProductDetailData;
}

export function DescriptionSection({ detail }: DescriptionSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-bold">Description</h2>
        <p className="leading-relaxed text-base-content/80">{detail.description}</p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Features</h2>
        <ul className="space-y-2">
          {detail.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-base-content/80">
              <svg className="mt-1 size-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Specifications</h2>
        <div className="overflow-x-auto rounded-xl border border-base-200">
          <table className="table">
            <tbody>
              {Object.entries(detail.specifications).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-base-200/50" : ""}>
                  <td className="w-1/3 font-medium">{key}</td>
                  <td className="text-base-content/70">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
