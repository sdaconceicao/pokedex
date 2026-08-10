"use client";

import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Applies a class to a lago `Button`.
 *
 * `Button` is the one component in lago 0.4.0 that sets its own `className`
 * *after* spreading incoming props, so `<Button className="x">` silently
 * discards `x` — `Link`, `Heading`, `Skeleton`, `Avatar`, `Pagination` and
 * `TagGroup` all merge it correctly. Nothing warns you: the prop is typed as
 * accepted, and the button still renders, just without your styles. Any
 * bespoke button shape therefore has to go through `render`, which hands back
 * the fully computed DOM props for us to merge into.
 *
 *     <Button render={withButtonClass(styles.trigger)}>…</Button>
 *
 * `type` is set before the spread so react-aria's own value still wins; it is
 * only there because a bare `<button>` trips biome's `useButtonType` rule.
 *
 * Delete this once lago's Button merges `props.className`.
 */
export const withButtonClass =
  (className: string | undefined, extra?: ComponentPropsWithoutRef<"button">) =>
  (props: ComponentPropsWithoutRef<"button">) => (
    // `extra` is spread first so react-aria's own props always win a collision;
    // it is for plain DOM attributes lago's ButtonProps doesn't model, such as
    // `title`.
    // biome-ignore lint/a11y/useButtonType: type comes through `props` from react-aria
    <button type="button" {...extra} {...props} className={clsx(props.className, className)} />
  );
