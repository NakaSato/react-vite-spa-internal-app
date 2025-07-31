/**
 * Component Templates Export
 *
 * Centralized export for all reusable template components
 */

export { ActionCard, CardTemplate, InfoCard } from "./CardTemplate";
export { ConfirmModal, FormModal, ModalTemplate } from "./ModalTemplate";

// Re-export types for external usage
export type { default as CardTemplateProps } from "./CardTemplate";
export type { default as ModalTemplateProps } from "./ModalTemplate";
