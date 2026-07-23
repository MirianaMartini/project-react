/** Il hook di dominio compone stato UI, debounce e accesso dati. */
import { useState } from 'react';
import type { TicketStatusFilter } from '../ticket.types';
import type { TicketService } from '../services/TicketService';
import { useDebouncedValue } from './useDebouncedValue';
import { useTickets } from './useTickets';

export function useTicketDashboard(service: TicketService) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<TicketStatusFilter>('tutti');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Applichiamo il debounce di 350ms al valore della query
  const debouncedQuery = useDebouncedValue(query, 350);
  
  // Passiamo a useTickets la query stabilizzata
  const remote = useTickets(debouncedQuery, statusFilter, service);

  const selectedTicket =
    remote.tickets.find((ticket) => ticket.id === selectedTicketId) ?? null;
  const summary = {
    total: remote.tickets.length,
    open: remote.tickets.filter((ticket) => ticket.status !== 'risolto').length,
    urgent: remote.tickets.filter(
      (ticket) => ticket.priority === 'critica' || ticket.priority === 'alta',
    ).length,
    waiting: remote.tickets.filter((ticket) => ticket.status === 'in-attesa').length,
  };

  function resetFilters() {
    setQuery('');
    setStatusFilter('tutti');
  }

  return {
    query,
    statusFilter,
    selectedTicketId,
    selectedTicket,
    tickets: remote.tickets,
    summary,
    loadStatus: remote.status,
    error: remote.error,
    // L'utente sta cercando se ha digitato qualcosa non ancora sincronizzato o se la richiesta è in corso
    isSearching: query !== debouncedQuery || remote.status === 'loading',
    retry: remote.retry,
    setQuery,
    setStatusFilter,
    selectTicket: setSelectedTicketId,
    resetFilters,
  };
}