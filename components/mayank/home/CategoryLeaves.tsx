import type { CSSProperties } from "react";
import { TransitionLink } from "../PageTransition";
import { Drawing } from "../visuals/Drawings";
import { assets, categories } from "@/lib/assets";

// The loader's six archive leaves, reused as the category index. Each tonal
// leaf names a category, what qualifies for it and how many records exist.
export function CategoryLeaves() {
  return (
    <div className="leaves">
      {categories.map((category, index) => {
        const count = assets.filter((asset) => asset.category === category.key).length;
        return (
          <TransitionLink key={category.key} href={`/market?category=${category.key}`} className={`leaf leaf-${index + 1}`} style={{ "--cat": category.ink } as CSSProperties} label={`Market / ${category.plural}`}>
            <span className="leaf-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{count} {count === 1 ? "record" : "records"}</span></span>
            <Drawing name={category.key} className="leaf-drawing" />
            <strong className="leaf-title">{category.plural}</strong>
            <span className="leaf-note">{category.note}</span>
            <em className="leaf-link">Browse</em>
          </TransitionLink>
        );
      })}
    </div>
  );
}
