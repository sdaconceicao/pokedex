import { Suspense } from "react";
import VerifyEmailForm from "./components/VerifyEmailForm";
import styles from "./page.module.css";

export const metadata = { title: "Verify Email" };

export default function Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Verifying your account</h1>
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
