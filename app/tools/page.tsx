
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import { categories, tools } from "@/lib/tools";
import styles from "./tools.module.css";

export const metadata = {
  title: "All Developer Tools",
  description:
    "Explore free developer tools for formatting, API testing, security, encoding and data conversion.",
};

export default function ToolsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.eyebrow}>DEVKIT DIRECTORY</div>
        <h1>All developer tools</h1>
        <p>
          Your everyday development utilities, organized in one place.
        </p>
      </div>

      <div className={styles.searchHint}>
        <Search size={16} />
        <span>Looking for something specific?</span>
        <span className={styles.shortcut}>Ctrl + K</span>
        <span>to search tools</span>
      </div>

      <div className={styles.toolCount}>
        Showing <strong>{tools.length} tools</strong> across{" "}
        <strong>{categories.length} categories</strong>
      </div>

      {categories.map((category) => {
        const categoryTools = tools.filter(
          (tool) => tool.category === category.id
        );

        if (!categoryTools.length) return null;

        return (
          <section className={styles.category} key={category.id}>
            <div className={styles.categoryHeading}>
              <div>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>

              <span>
                {String(categoryTools.length).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.grid}>
              {categoryTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <Link
                    href={tool.href}
                    className={styles.card}
                    key={tool.id}
                  >
                    <div className={styles.cardIcon}>
                      <Icon size={20} />
                    </div>

                    <div className={styles.cardContent}>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className={styles.cardArrow}
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
