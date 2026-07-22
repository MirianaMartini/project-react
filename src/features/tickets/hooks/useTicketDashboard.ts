/**
 * Il hook possiede lo stato UI e calcola i valori derivati.
 * L'array arriva come dipendenza, quindi il hook non importa fixture.
 */
import { useState } from 'react';
import type { Ticket, TicketStatusFilter } from '../ticket.types';

export function useTicketDashboard(allTickets: Ticket[]) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<TicketStatusFilter>('tutti');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    allTickets[0]?.id ?? null,
  );

  const normalizedQuery = query.trim().toLocaleLowerCase('it-IT');
  const visibleTickets = allTickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'tutti' || ticket.status === statusFilter;
    const searchableText = [
      ticket.id,
      ticket.title,
      ticket.customer,
      ticket.assignee,
      ticket.description,
    ]
      .join(' ')
      .toLocaleLowerCase('it-IT');

    return matchesStatus && searchableText.includes(normalizedQuery);
  });

  const selectedTicket =
    allTickets.find((ticket) => ticket.id === selectedTicketId) ?? null;
  const summary = {
    total: allTickets.length,
    open: allTickets.filter((ticket) => ticket.status !== 'risolto').length,
    urgent: allTickets.filter(
      (ticket) => ticket.priority === 'critica' || ticket.priority === 'alta',
    ).length,
    waiting: allTickets.filter((ticket) => ticket.status === 'in-attesa').length,
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
    visibleTickets,
    summary,
    setQuery,
    setStatusFilter,
    selectTicket: setSelectedTicketId,
    resetFilters,
  };
}