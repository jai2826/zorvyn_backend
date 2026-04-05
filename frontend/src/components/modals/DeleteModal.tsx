import { ResponsiveModal } from "./ActionModal";

export const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    variant,
    loading,
    confirmText={
        confirm: "Delete",
        confirming: "Deleting..."
    }

}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    variant?: "default" | "destructive";
    confirmText?: {
        confirm?: string;
        confirming?: string;
    };
    loading?: boolean;

}) => {
    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            loading={loading}
            variant={variant}
            title={title}
            description={description}
            confirmText={confirmText}
        />
    );
};
