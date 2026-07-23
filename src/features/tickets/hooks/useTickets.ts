/** useTickets sincronizza filtri React e servizio dati. */
import { useEffect, useState } from 'react';
import type { LoadStatus, Ticket, TicketStatusFilter } from '../ticket.types';
import type { TicketService } from '../services/TicketService';

export function useTickets(
  query: string,
  statusFilter: TicketStatusFilter,
  service: TicketService,
) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    service
      .list({ query, status: statusFilter }, controller.signal)
      .then((result) => {
        setTickets(result);
        setStatus('success');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Errore imprevisto durante il caricamento.',
        );
        setStatus('error');
      });

    return () => controller.abort();
  }, [query, reloadKey, service, statusFilter]);

  function retry() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  return { tickets, status, error, retry };
}