/** Il hook di dominio compone stato UI e accesso dati. */
import { useState } from 'react';
import type { TicketStatusFilter } from '../ticket.types';
import type { TicketService } from '../services/TicketService';
import { useTickets } from './useTickets';

export function useTicketDashboard(service: TicketService) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<TicketStatusFilter>('tutti');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const remote = useTickets(query, statusFilter, service);

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
    retry: remote.retry,
    setQuery,
    setStatusFilter,
    selectTicket: setSelectedTicketId,
    resetFilters,
  };
}