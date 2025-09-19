"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, CheckCircle, XCircle } from "lucide-react";
import {
  inscriptionService,
  Inscription,
} from "../../services/inscriptionService";
import { DeleteInscriptionButton } from "@/components/Alert/DeleteInscriptionAlert";

interface InscriptionsListFormProps {
  eventId: string;
  eventTitle: string;
  onInscriptionDeleted?: () => void;
}

export function InscriptionsListView({
  eventId,
  eventTitle,
  onInscriptionDeleted,
}: InscriptionsListFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await inscriptionService.getInscriptionsByEvent(eventId);
      setInscriptions(data);
    } catch (err) {
      let errorMessage = "Erro ao carregar inscritos.";
      if (err instanceof Error) {
        switch (err.message) {
          case "EVENT_NOT_FOUND":
            errorMessage = "Evento não encontrado.";
            break;
          default:
            errorMessage = "Erro de rede. Tente novamente.";
            break;
        }
      }
      setError(errorMessage);
      setInscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (isOpen) {
      fetchInscriptions();
    }
  }, [isOpen, fetchInscriptions]);

  const handleDeleteSuccess = () => {
    fetchInscriptions();
    if (onInscriptionDeleted) {
      onInscriptionDeleted();
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inscritos em: {eventTitle}</DialogTitle>
          <DialogDescription>
            Lista de todas as pessoas inscritas neste evento.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando inscritos...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && inscriptions.length === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Nenhum inscrito encontrado.</AlertDescription>
            </Alert>
          )}

          {!loading && !error && inscriptions.length > 0 && (
            <div className="space-y-4">
              {inscriptions.map((inscription) => (
                <div
                  key={inscription.id}
                  className="p-4 border rounded-lg shadow-sm flex items-center justify-between"
                >
                  <p className="font-semibold">{inscription.name}</p>
                  <DeleteInscriptionButton
                    eventId={eventId}
                    phone={inscription.phone}
                    onDeleteSuccess={handleDeleteSuccess}
                    onCloseModal={handleCloseModal}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
