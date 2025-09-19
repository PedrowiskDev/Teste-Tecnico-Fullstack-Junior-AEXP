"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  inscriptionService,
  getErrorMessage,
} from "../../services/inscriptionService";
import { inscriptionSchema } from "../../app/schemas/validationSchemas";

interface DeleteInscriptionButtonProps {
  eventId: string;
  phone: string;
  onDeleteSuccess: () => void;
  onCloseModal?: () => void;
}

const applyPhoneMask = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) return "";

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  }
};

export function DeleteInscriptionButton({
  eventId,
  phone,
  onDeleteSuccess,
  onCloseModal,
}: DeleteInscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [validationStatus, setValidationStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });

  const validatePhone = (inputPhone: string): boolean => {
    try {
      inscriptionSchema.shape.phone.parse(inputPhone);

      const cleanInput = inputPhone.replace(/\D/g, "");
      const cleanOriginal = phone.replace(/\D/g, "");

      const normalizedOriginal = cleanOriginal.startsWith("55")
        ? cleanOriginal.slice(2)
        : cleanOriginal;

      return cleanInput === normalizedOriginal;
    } catch {
      return false;
    }
  };

  const handleConfirmationChange = (value: string) => {
    const maskedValue = applyPhoneMask(value);
    setConfirmation(maskedValue);

    if (maskedValue.length === 0) {
      setValidationStatus({ type: "idle", message: "" });
    } else if (validatePhone(maskedValue)) {
      setValidationStatus({
        type: "success",
        message: "Número confirmado!",
      });
    } else {
      setValidationStatus({
        type: "error",
        message: "Número não confere com o inscrito",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validatePhone(confirmation)) {
      setValidationStatus({
        type: "error",
        message: "Digite o número correto para confirmar a remoção",
      });
      return;
    }

    try {
      setIsDeleting(true);
      setValidationStatus({ type: "idle", message: "" });

      await inscriptionService.removeInscription(eventId, phone);

      setValidationStatus({
        type: "success",
        message: "Inscrição removida com sucesso!",
      });

      setTimeout(() => {
        setIsOpen(false);
        resetDialog();
        onDeleteSuccess();
        if (onCloseModal) {
          onCloseModal();
        }
      }, 1000);
    } catch (error) {
      let errorMessage = "Erro inesperado ao remover inscrição";

      if (error instanceof Error) {
        errorMessage = getErrorMessage(error.message);
      }

      setValidationStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetDialog = () => {
    setConfirmation("");
    setValidationStatus({ type: "idle", message: "" });
    setIsDeleting(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetDialog();
    }
  };

  const isConfirmEnabled = validatePhone(confirmation) && !isDeleting;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          title="Remover inscrição"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Remover Inscrição
          </AlertDialogTitle>
          <AlertDialogDescription>
            Para confirmar a remoção, digite o número de telefone do inscrito.
            <br />
            <span className="text-sm text-muted-foreground mt-1 block">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {validationStatus.type !== "idle" && (
            <Alert
              variant={
                validationStatus.type === "error" ? "destructive" : "default"
              }
            >
              {validationStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription className="text-blue-500 border-blue-500">
                {validationStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              placeholder="(99) 99999-9999"
              value={confirmation}
              onChange={(e) => handleConfirmationChange(e.target.value)}
              disabled={isDeleting}
              className={`
                ${
                  validationStatus.type === "success"
                    ? "border-green-500 focus:border-green-500"
                    : ""
                }
                ${
                  validationStatus.type === "error"
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              `}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Digite o número completo com DDD
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmEnabled}
            className={`
              ${
                isConfirmEnabled
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Removendo...
              </>
            ) : (
              "Confirmar Remoção"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
