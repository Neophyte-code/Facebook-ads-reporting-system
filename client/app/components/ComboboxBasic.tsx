"use client";

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

// Define the Client type based on your Laravel Model
interface Client {
  id: number;
  name: string;
}

interface ComboboxBasicProps {
  apiBase: string;
  onClientChange: (id: string | null) => void;
}

export function ComboboxBasic({ apiBase, onClientChange }: ComboboxBasicProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedClientName = clients.find(
    (c) => c.id.toString() === selectedId,
  )?.name;

  // 1. Fetch real clients from your Laravel API
  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/api/clients`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
      })
      .catch((err) => console.error("Failed to fetch clients:", err))
      .finally(() => setLoading(false));
  }, [apiBase]);

  return (
    <Combobox
      items={clients}
      onValueChange={(value) => {
        const val = value as string | null;
        setSelectedId(val);
        onClientChange(val);
      }}
    >
      <ComboboxInput
        value={selectedClientName || ""}
        placeholder="Select a Client"
        className="w-full max-w-sm rounded-lg border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:ring-amber-500/50"
      />

      <ComboboxContent className="bg-stone-900 border-stone-800 text-stone-100">
        <ComboboxEmpty>No clients found.</ComboboxEmpty>
        <ComboboxList>
          {clients.map((client: Client) => (
            <ComboboxItem
              key={client.id}
              value={client.id.toString()}
              className="hover:bg-stone-800 aria-selected:bg-amber-500/20 aria-selected:text-amber-400"
            >
              {client.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
