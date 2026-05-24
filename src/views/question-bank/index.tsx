import { lazy, Suspense, useEffect, useRef, useState } from "react"
import styles from "./index.module.less"

const BigComponent = lazy(() => import("@/components/BigComponent"))

export default function QuestionBank() {
  const bigComponentSectionRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return

    const section = bigComponentSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setVisible(true)
        observer.disconnect()
      },
      {
        rootMargin: "200px 0px",
        threshold: 0,
      },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [visible])

  return (
    <main>
      <section className={styles.section}>
        section1
      </section>

      <section className={styles.section}>
        section2
      </section>

      <section className={styles.section}>
        section3
      </section>

      <section className={styles.section}>
        section4
      </section>

      <section className={styles.section}>
        section5
      </section>

      <section ref={bigComponentSectionRef} className={styles.section}>
        {visible ? (
          <Suspense fallback={<div>Loading...</div>}>
            <BigComponent />
          </Suspense>
        ) : null}
      </section>
    </main>
  )
}
