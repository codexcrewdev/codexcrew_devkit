
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Command,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

import { categories, tools } from "@/lib/tools";
import styles from "./page.module.css";

export default function DashboardPage() {
  const featuredTools = tools.filter((tool) => tool.featured);

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            YOUR DEVELOPER WORKSPACE
          </div>

          <h1>
            Build faster.
            <br />
            <span>Work smarter.</span>
          </h1>

          <p className={styles.heroDescription}>
            Everything you need to simplify everyday development.
            Powerful tools, one workspace, completely free.
          </p>

          <div className={styles.heroActions}>
            <Link href="/tools" className={styles.primaryButton}>
              Explore all tools
              <ArrowRight size={16} />
            </Link>

            <div className={styles.shortcutHint}>
              <Command size={13} />
              <span>+</span>
              <kbd>K</kbd>
              <span>Quick search</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.terminalWindow}>
            <div className={styles.terminalTop}>
              <div className={styles.terminalDots}>
                <span />
                <span />
                <span />
              </div>
              <span>devkit.workspace</span>
              <Terminal size={14} />
            </div>

            <div className={styles.terminalBody}>
              <div className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>$</span>
                <span>devkit --initialize</span>
              </div>

              <div className={styles.terminalSuccess}>
                <span>✓</span> Workspace ready
              </div>

              <div className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>$</span>
                <span>tools --list</span>
              </div>

              <div className={styles.terminalOutput}>
                <span>10 developer tools available</span>
                <span>100% free to use</span>
                <span>Processing locally where possible</span>
              </div>

              <div className={styles.terminalCursor}>
                <span>$</span>
                <i />
              </div>
            </div>
          </div>

          <div className={styles.floatingIcon}>
            <Code2 size={23} />
          </div>

          <div className={styles.floatingBadge}>
            <Zap size={13} />
            Built for developers
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Code2 size={17} />
          </div>
          <div>
            <strong>10</strong>
            <span>Developer tools</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <ShieldCheck size={17} />
          </div>
          <div>
            <strong>Free</strong>
            <span>Always accessible</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Sparkles size={17} />
          </div>
          <div>
            <strong>Simple</strong>
            <span>No account required</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <div className={styles.sectionEyebrow}>START HERE</div>
            <h2>Featured tools</h2>
            <p>Quick access to your everyday development essentials.</p>
          </div>

          <Link href="/tools" className={styles.textLink}>
            View all tools <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className={styles.featuredGrid}>
          {featuredTools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <Link
                href={tool.href}
                className={styles.featuredCard}
                key={tool.id}
              >
                <div className={styles.cardTop}>
                  <div className={styles.toolIcon}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.cardNumber}>
                    0{index + 1}
                  </span>
                </div>

                <h3>{tool.name}</h3>
                <p>{tool.description}</p>

                <div className={styles.cardBottom}>
                  <span>Open tool</span>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <div className={styles.sectionEyebrow}>THE TOOLBOX</div>
            <h2>Explore the workspace</h2>
            <p>Everything organized into focused categories.</p>
          </div>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const categoryTools = tools.filter(
              (tool) => tool.category === category.id
            );

            return (
              <div
                className={styles.categoryCard}
                key={category.id}
              >
                <div className={styles.categoryHeader}>
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>

                  <span className={styles.categoryCount}>
                    {String(categoryTools.length).padStart(2, "0")}
                  </span>
                </div>

                <div className={styles.categoryTools}>
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <Link
                        href={tool.href}
                        key={tool.id}
                        className={styles.categoryTool}
                      >
                        <span className={styles.categoryToolIcon}>
                          <Icon size={16} />
                        </span>

                        <span>{tool.name}</span>

                        <ArrowRight
                          size={14}
                          className={styles.categoryArrow}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomBanner}>
        <div className={styles.bannerIcon}>
          <Terminal size={20} />
        </div>

        <div className={styles.bannerText}>
          <h3>One workspace. Less friction.</h3>
          <p>
            Spend less time switching tools and more time building.
          </p>
        </div>

        <Link href="/tools" className={styles.bannerLink}>
          Explore DevKit <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
