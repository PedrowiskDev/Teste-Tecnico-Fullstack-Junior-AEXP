import EventForm from "../../components/EventForm";

export default function CreateEvent() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Criar Evento</h1>
      <EventForm />
    </div>
  );
}
