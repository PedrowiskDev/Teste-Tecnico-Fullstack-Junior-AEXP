import { useRouter } from "next/router";

export default function RegisterEvent() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Inscrição no Evento {id}</h1>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Confirmar inscrição
      </button>
    </div>
  );
}
