"use client";

import { useState, useEffect } from "react";
import { eventService, Event } from "@/services/eventService";
import { inscriptionService } from "../../services/inscriptionService";
import { InscriptionForm } from "../../components/Forms/InscriptionForm";
import { CreateEventForm } from "../../components/Forms/EventForm";
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
import { DeleteEvent } from "@/components/Alert/DeleteEventAlert";
import { UpdateEventForm } from "@/components/Forms/UpdateEventForm";
import { InscriptionsListView } from "@/components/View/InscriptionView";
interface EventWithCount extends Event {
  inscriptionCount: number;
}

export default function EventList() {
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

            return {
              ...event,
              inscriptionCount: countResult.count,
            };
          } catch {
            return {
              ...event,
              inscriptionCount: 0,
            };
          }
        })
      );

      setEvents(eventsWithCount);
    } catch {
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleInscriptionDeleted = () => {
    loadEvents();
  };

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
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h1 className="text-3xl font-bold p-5">Lista de Eventos</h1>
        <div className="flex gap-2 mr-5">
          <CreateEventForm onSuccess={loadEvents} />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Button onClick={loadEvents} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Lista
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum evento encontrado.</p>
          <p className="text-sm mt-2">
            Crie seu primeiro evento clicando no botão acima.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col mx-5">
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <DeleteEvent eventId={event.id} onDeleteSuccess={loadEvents} />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-3 line-clamp-3">
                  {event.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-blue-600">
                    {event.inscriptionCount} Inscritos
                  </span>
                  <span className="font-medium text-green-600">
                    {event.capacity} Vagas
                  </span>
                </div>

                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (event.inscriptionCount / event.capacity) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.capacity - event.inscriptionCount} vagas restantes
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t bg-muted/20">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors">
                      <InscriptionsListView
                        eventId={event.id}
                        eventTitle={event.title}
                        onInscriptionDeleted={handleInscriptionDeleted}
                      />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors">
                      <UpdateEventForm event={event} onSuccess={loadEvents} />
                    </div>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <InscriptionForm
                      eventId={event.id}
                      eventTitle={event.title}
                      onSuccess={loadEvents}
                      isFull={event.inscriptionCount >= event.capacity}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
