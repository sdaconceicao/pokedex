import { Suspense } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";
import styles from "./page.module.css";

export const metadata = { title: "Reset Password" };

export default function Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Choose a new password</h1>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
