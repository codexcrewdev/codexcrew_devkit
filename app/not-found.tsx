
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Terminal } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} />

      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}>CX</span>
          <span>CodeXcrew <span className={styles.brandMuted}>DevKit</span></span>
        </Link>
        <span className={styles.status}>
          <span className={styles.statusDot} />
          All systems operational
        </span>
      </nav>

      <section className={styles.content}>
        <div className={styles.terminal}>
          <div className={styles.terminalTop}>
            <div className={styles.windowDots}>
              <span />
              <span />
              <span />
            </div>
            <span>terminal — codexcrew</span>
            <Terminal size={15} />
          </div>

          <div className={styles.terminalBody}>
            <p><span className={styles.prompt}>$</span> navigating to requested route...</p>
            <p className={styles.error}>Error 404: ROUTE_NOT_FOUND</p>
            <p><span className={styles.prompt}>$</span> searching for page...</p>
            <p className={styles.muted}>No matching resource found.</p>
            <p className={styles.cursorLine}>
              <span className={styles.prompt}>$</span> <span className={styles.cursor} />
            </p>
          </div>
        </div>

        <div className={styles.errorCode}>
          <span>4</span>
          <span className={styles.zero}>0</span>
          <span>4</span>
        </div>

        <span className={styles.eyebrow}>PAGE NOT FOUND</span>
        <h1>
          Lost in the <span>code?</span>
        </h1>
        <p className={styles.description}>
          Looks like this route doesn't exist or may have been moved.
          Don't worry — let's get you back on track.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link href="/tools" className={styles.secondaryButton}>
            Explore DevKit
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className={styles.footerNote}>
          <span>404</span>
          <span className={styles.footerDivider}>/</span>
          <span>Nothing to debug here. Just a missing page.</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>CodeXcrew</span>
        <span>Think Beyond. Build What's Next.</span>
      </footer>
    </main>
  );
}
