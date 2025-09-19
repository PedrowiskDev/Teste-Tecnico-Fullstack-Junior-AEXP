import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { eventService } from "../../services/eventService";

interface DeleteEventProps {
  eventId: string;
  onDeleteSuccess: () => void;
}

export function DeleteEvent({ eventId, onDeleteSuccess }: DeleteEventProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    setError(null);
    setSubmitStatus({ type: null, message: "" });

    try {
      await eventService.deleteEvent(eventId);

      setSubmitStatus({
        type: "success",
        message: "Evento deletado com sucesso!",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        onDeleteSuccess();
      }, 2000);
    } catch (err) {
      let message = "Ocorreu um erro inesperado.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError("Erro ao deletar o evento: " + message);
      setSubmitStatus({ type: "error", message });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-xl">
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          {submitStatus.type && (
            <Alert
              variant={
                submitStatus.type === "error" ? "destructive" : "default"
              }
              className="mb-2"
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              <AlertDescription>{submitStatus.message}</AlertDescription>
            </Alert>
          )}

          {!submitStatus.type && (
            <>
              <AlertDialogTitle>
                Você tem certeza que deseja deletar esse evento?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita e removerá o evento
                permanentemente.
              </AlertDialogDescription>
            </>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Continuar"}
            </Button>
          </>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
