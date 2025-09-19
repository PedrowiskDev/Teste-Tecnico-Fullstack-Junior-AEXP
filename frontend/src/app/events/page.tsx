"use client";

import { useState, useEffect } from "react";
import { eventService, Event } from "@/services/eventService";
import { inscriptionService } from "../../services/inscriptionService";
import { InscriptionForm } from "../../components/Forms/InscriptionForm"; // Importe o novo componente
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface estendida para incluir a contagem de inscrições
interface EventWithCount extends Event {
  inscriptionCount: number;
}

export default function EventList() {
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar eventos ao montar o componente
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const eventsData = await eventService.getAllEvents();

      const eventsWithCount = await Promise.all(
        eventsData.map(async (event) => {
          try {
            const countResult = (await inscriptionService.getInscriptionCount(
              event.id
            )) as { count: number };
            console.log(countResult.count);
            return {
              ...event,
              inscriptionCount: countResult.count,
            };
          } catch (err) {
            console.error(
              `Erro ao buscar contagem para evento ${event.id}:`,
              err
            );
            return {
              ...event,
              inscriptionCount: 0,
            };
          }
        })
      );

      setEvents(eventsWithCount);
    } catch (err) {
      setError("Erro ao carregar eventos");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteEvent = async (id: string) => {
  //   if (!confirm("Tem certeza que deseja deletar este evento?")) return;

  //   try {
  //     await eventService.deleteEvent(id);
  //     setEvents(events.filter((event) => event.id !== id));
  //   } catch (err) {
  //     setError("Erro ao deletar evento");
  //     console.error("Erro:", err);
  //   }
  // };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando eventos...</span>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Erro: {error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="event-list">
      <div className="flex justify-between items-center mb-6 border ">
        <h1 className="text-3xl font-bold p-5">Lista de Eventos</h1>
        <Button onClick={loadEvents} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Lista
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="flex w-fit">
          {events.map((event) => (
            <Card key={event.id} className="flex-1 m-3">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {event.description}
                </p>
                <div className="flex justify-between">
                  <p className="">{event.inscriptionCount} Inscritos</p>
                  <p className="">{event.capacity} Vagas</p>
                </div>
              </CardContent>
              <CardFooter>
                <InscriptionForm
                  eventId={event.id}
                  eventTitle={event.title}
                  onSuccess={loadEvents}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
