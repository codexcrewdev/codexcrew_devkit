
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Command,
  Search,
  X,
  Menu,
  ArrowUpRight,
  Code2,
  ChevronRight,
} from "lucide-react";

import { categories, tools } from "@/lib/tools";
import styles from "./AppShell.module.css";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return tools;

    return tools.filter((tool) =>
      [
        tool.name,
        tool.description,
        tool.category,
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCommandOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (commandOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [commandOpen]);

  function openSearch() {
    setQuery("");
    setCommandOpen(true);
  }

  return (
    <div className={styles.app}>
      {mobileOpen && (
        <button
          className={styles.mobileBackdrop}
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          mobileOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <div className={styles.brandIcon}>
              <Code2 size={21} />
            </div>

            <div>
              <span className={styles.brandName}>CodeXcrew</span>
              <span className={styles.brandProduct}>DEVKIT</span>
            </div>
          </Link>

          <button
            className={styles.closeMobile}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <Link
            href="/"
            className={`${styles.overviewLink} ${
              pathname === "/" ? styles.activeLink : ""
            }`}
          >
            <Code2 size={17} />
            <span>Overview</span>
          </Link>

          <div className={styles.sidebarLabel}>WORKSPACE</div>

          {categories.map((category) => {
            const categoryTools = tools.filter(
              (tool) => tool.category === category.id
            );

            if (!categoryTools.length) return null;

            return (
              <div className={styles.categoryGroup} key={category.id}>
                <div className={styles.categoryTitle}>
                  {category.name}
                </div>

                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  const active = pathname === tool.href;

                  return (
                    <Link
                      href={tool.href}
                      key={tool.id}
                      className={`${styles.toolLink} ${
                        active ? styles.activeLink : ""
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tool.name}</span>
                      {active && <span className={styles.activeDot} />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.freeCard}>
            <div className={styles.freeCardTop}>
              <span className={styles.freeDot} />
              <span>FREE DEVELOPER TOOLKIT</span>
            </div>
            <p>Useful tools. Zero friction.</p>
            <span className={styles.freeVersion}>DEVKIT / V1.0</span>
          </div>

          <div className={styles.sidebarCopyright}>
            © 2026 CodeXcrew
          </div>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuButton}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className={styles.breadcrumb}>
              <span>DevKit</span>
              <ChevronRight size={14} />
              <strong>
                {pathname === "/"
                  ? "Overview"
                  : tools.find((tool) => tool.href === pathname)?.name ??
                    "Workspace"}
              </strong>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.searchButton}
              onClick={openSearch}
            >
              <Search size={16} />
              <span>Search tools...</span>
              <kbd>
                <Command size={11} /> K
              </kbd>
            </button>

            <div className={styles.headerStatus}>
              <span className={styles.statusDot} />
              All systems ready
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>

      {commandOpen && (
        <div
          className={styles.commandOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCommandOpen(false);
            }
          }}
        >
          <div className={styles.commandPanel}>
            <div className={styles.commandSearch}>
              <Search size={19} />
              <input
                autoFocus
                placeholder="Search developer tools..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                onClick={() => setCommandOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.commandResults}>
              <div className={styles.commandLabel}>
                {query ? "SEARCH RESULTS" : "AVAILABLE TOOLS"}
              </div>

              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <Link
                      href={tool.href}
                      key={tool.id}
                      className={styles.commandItem}
                    >
                      <div className={styles.commandIcon}>
                        <Icon size={17} />
                      </div>

                      <div className={styles.commandText}>
                        <strong>{tool.name}</strong>
                        <span>{tool.description}</span>
                      </div>

                      <ArrowUpRight size={15} />
                    </Link>
                  );
                })
              ) : (
                <div className={styles.noResults}>
                  No tools found for &quot;{query}&quot;
                </div>
              )}
            </div>

            <div className={styles.commandFooter}>
              <span>Navigate to a tool</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
