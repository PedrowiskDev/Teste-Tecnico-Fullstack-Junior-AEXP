"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  inscriptionService,
  getErrorMessage,
} from "../../services/inscriptionService";
import {
  inscriptionSchema,
  type InscriptionFormData,
} from "../../app/schemas/validationSchemas";
import { CheckCircle, XCircle } from "lucide-react";

interface InscriptionFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
  isFull?: boolean;
}

const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (!numbers) return "";

  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
      6
    )}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

const applyNameMask = (value: string): string =>
  value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

export function InscriptionForm({
  eventId,
  eventTitle,
  onSuccess,
  isFull,
}: InscriptionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { control, handleSubmit, reset } = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const resetForm = () => {
    reset();
    setSubmitStatus({ type: null, message: "" });
  };

  const onSubmit = async (data: InscriptionFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      const cleanPhone = `+55${data.phone.replace(/\D/g, "").slice(0, 11)}`;

      await inscriptionService.createInscription(eventId, {
        name: data.name.trim(),
        phone: cleanPhone,
      });

      setSubmitStatus({
        type: "success",
        message: "Inscrição realizada com sucesso!",
      });

      setTimeout(() => {
        setIsOpen(false);
        resetForm();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      let errorMessage = "Erro ao realizar inscrição. Tente novamente.";

      if (error instanceof Error) {
        errorMessage = getErrorMessage(error.message);
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
        <Button className="w-full bg-black h-10 text-lg" disabled={isFull}>
          {isFull ? "Lotado" : "Registrar"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Inscrição no Evento</DialogTitle>
            <DialogDescription>
              Faça sua inscrição para o evento &ldquo;{eventTitle}&rdquo;.
              Preencha seus dados abaixo.
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
              <Label htmlFor="name">Nome Completo</Label>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Digite seu nome completo"
                      onChange={(e) =>
                        field.onChange(applyNameMask(e.target.value))
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

            <div className="grid gap-2 mb-5">
              <Label htmlFor="phone">Telefone</Label>

              <div className="flex items-center">
                <span className="flex items-center px-2 h-9 border border-r-0 rounded-l-md bg-gray-100 text-gray-700">
                  +55
                </span>

                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="flex-1 relative">
                      <Input
                        {...field}
                        id="phone"
                        placeholder="(DD) NNNNN-NNNN"
                        onChange={(e) =>
                          field.onChange(applyPhoneMask(e.target.value))
                        }
                        className={`${
                          fieldState.invalid ? "border-red-500" : ""
                        } w-full rounded-l-none `}
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                        aria-describedby={
                          fieldState.error ? "phone-error" : undefined
                        }
                        disabled={isSubmitting}
                      />

                      {fieldState.error && (
                        <p
                          id="phone-error"
                          className="mt-1 text-sm text-red-500 absolute"
                        >
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
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
                ? "Inscrevendo..."
                : submitStatus.type === "success"
                ? "Sucesso!"
                : "Confirmar Inscrição"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
