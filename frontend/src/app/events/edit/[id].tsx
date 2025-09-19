import { useRouter } from "next/router";
import EventForm from "../../../components/EventForm";

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Editar Evento {id}</h1>
      <EventForm eventId={id} />
    </div>
  );
}
