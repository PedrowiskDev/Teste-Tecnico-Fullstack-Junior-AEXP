"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { eventService } from "../../services/eventService";
import {
  eventSchema,
  type EventFormData,
} from "../../app/schemas/validationSchemas";
import { CheckCircle, XCircle, Plus } from "lucide-react";

interface CreateEventFormProps {
  onSuccess?: () => void;
}

const applyCapacityMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

export function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { control, handleSubmit, reset } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: "",
    },
  });

  const resetForm = () => {
    reset();
    setSubmitStatus({ type: null, message: "" });
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      const eventData = {
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        capacity: parseInt(data.capacity),
      };

      await eventService.createEvent(eventData);

      setSubmitStatus({
        type: "success",
        message: "Evento criado com sucesso!",
      });

      setTimeout(() => {
        setIsOpen(false);
        resetForm();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      let errorMessage = "Erro ao criar evento. Tente novamente.";

      if (error instanceof Error) {
        switch (error.message) {
          case "VALIDATION_ERROR":
            errorMessage =
              "Dados inválidos. Verifique os campos e tente novamente.";
            break;
          case "DUPLICATE_TITLE":
            errorMessage = "Já existe um evento com este título.";
            break;
          default:
            errorMessage = "Erro ao criar evento. Tente novamente.";
        }
      }

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Criar Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para criar um novo evento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {submitStatus.type && (
              <Alert
                variant={
                  submitStatus.type === "error" ? "destructive" : "default"
                }
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="title"
                      placeholder="Digite o título do evento"
                      className={fieldState.invalid ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Descreva o evento... (opcional)"
                      className={`min-h-[100px] ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidade (máximo de pessoas) *</Label>
              <Controller
                name="capacity"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="capacity"
                      placeholder="Ex: 100"
                      onChange={(e) =>
                        field.onChange(applyCapacityMask(e.target.value))
                      }
                      className={fieldState.invalid ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || submitStatus.type === "success"}
            >
              {isSubmitting
                ? "Criando..."
                : submitStatus.type === "success"
                ? "Sucesso!"
                : "Criar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
