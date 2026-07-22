/**
 * TicketDashboard contiene intenzionalmente più responsabilità:
 * stato, dati derivati, filtri, lista e riepilogo vivono nello stesso file.
 * Lo starter funziona, mentre i TODO mostreranno come separare questi confini.
 */
import { useState } from 'react';
import {
  ArrowClockwiseIcon,
  BuildingsIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { TicketDashboardLayout } from './components/TicketDashboardLayout/TicketDashboardLayout';
import { TicketDetail } from './components/TicketDetail/TicketDetail';
import { TicketList } from './components/TicketList/TicketList';
import { tickets } from './tickets';
import type { TicketStatusFilter } from './ticket.types';
import './TicketDashboard.scss';

export function TicketDashboard() {
  // Questi valori rappresentano stato reale perché cambiano dopo un'azione utente.
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<TicketStatusFilter>('tutti');
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0].id);

  // I conteggi derivano dalle fixture. Un secondo useState creerebbe una copia da sincronizzare.
  const openTicketsCount = tickets.filter(
    (ticket) => ticket.status !== 'risolto',
  ).length;
  const urgentTicketsCount = tickets.filter(
    (ticket) => ticket.priority === 'critica' || ticket.priority === 'alta',
  ).length;
  const waitingTicketsCount = tickets.filter(
    (ticket) => ticket.status === 'in-attesa',
  ).length;

  const normalizedQuery = query.trim().toLocaleLowerCase('it-IT');

  // La lista visibile è derived state: gli input sono ticket, query e filtro.
  const visibleTickets = tickets.filter((ticket) => {
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

  const hasActiveFilters = query !== '' || statusFilter !== 'tutti';
  const selectedTicket = tickets.find(
    (ticket) => ticket.id === selectedTicketId,
  );

  function resetFilters() {
    setQuery('');
    setStatusFilter('tutti');
  }

  const sidebar = (
          <div
            className="ticket-dashboard__filters"
            aria-labelledby="filters-title"
          >
            <div className="ticket-dashboard__section-title">
              <FunnelSimpleIcon size={20} weight="bold" aria-hidden="true" />
              <h2 id="filters-title">Filtri</h2>
            </div>

            <label className="ticket-dashboard__field">
              <span>Cerca nella coda</span>
              <span className="ticket-dashboard__input-wrap">
                <MagnifyingGlassIcon
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ID, cliente o titolo"
                />
              </span>
            </label>

            <label className="ticket-dashboard__field">
              <span>Stato</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as TicketStatusFilter)
                }
              >
                <option value="tutti">Tutti gli stati</option>
                <option value="nuovo">Nuovo</option>
                <option value="in-lavorazione">In lavorazione</option>
                <option value="in-attesa">In attesa</option>
                <option value="risolto">Risolto</option>
              </select>
            </label>

            <button
              className="ticket-dashboard__reset"
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              <ArrowClockwiseIcon size={18} weight="bold" aria-hidden="true" />
              Reimposta filtri
            </button>

            <div className="ticket-dashboard__filter-note">
              <strong>{visibleTickets.length}</strong>
              <span>ticket nella vista corrente</span>
            </div>
          </div>
  );

  const queue = (
          <section
            className="ticket-dashboard__queue"
            aria-labelledby="queue-title"
          >
            <header className="ticket-dashboard__queue-header">
              <div>
                <h2 id="queue-title">Coda ticket</h2>
                <p>Ordine di aggiornamento, dal più recente.</p>
              </div>
              <span>{visibleTickets.length} risultati</span>
            </header>

            {visibleTickets.length > 0 ? (
              <TicketList
                tickets={visibleTickets}
                selectedTicketId={selectedTicketId}
                onSelect={setSelectedTicketId}
              />
            ) : (
              <div className="ticket-dashboard__empty" role="status">
                <MagnifyingGlassIcon
                  size={28}
                  weight="duotone"
                  aria-hidden="true"
                />
                <h3>Nessun ticket trovato</h3>
                <p>Modifica la ricerca oppure reimposta i filtri.</p>
                <button type="button" onClick={resetFilters}>
                  Mostra tutti i ticket
                </button>
              </div>
            )}
          </section>
  );

  return (
    <div className="ticket-dashboard">
      <header className="ticket-dashboard__topbar">
        <a className="ticket-dashboard__brand" href="#main-content">
          <span className="ticket-dashboard__brand-mark" aria-hidden="true">
            <BuildingsIcon size={20} weight="bold" />
          </span>
          <span>
            <strong>Control Room</strong>
            <small>Operations support</small>
          </span>
        </a>
        <span className="ticket-dashboard__environment">
          Ambiente didattico
        </span>
      </header>

      <main id="main-content" className="ticket-dashboard__main">
        <header className="ticket-dashboard__heading">
          <div>
            <p className="ticket-dashboard__context">Coda assistenza</p>
            <h1>Operations Dashboard</h1>
            <p>
              Controlla le richieste aperte, filtra la coda e assegna la
              priorità al prossimo intervento.
            </p>
          </div>
          <div className="ticket-dashboard__selection" aria-live="polite">
            <span>Ticket selezionato</span>
            <strong>{selectedTicket?.id ?? 'Nessuno'}</strong>
          </div>
        </header>

        <section
          className="ticket-dashboard__metrics"
          aria-label="Riepilogo ticket"
        >
          <article>
            <TicketIcon size={20} weight="duotone" aria-hidden="true" />
            <span>Totali</span>
            <strong>{tickets.length}</strong>
          </article>
          <article>
            <ClockIcon size={20} weight="duotone" aria-hidden="true" />
            <span>Aperti</span>
            <strong>{openTicketsCount}</strong>
          </article>
          <article>
            <WarningIcon size={20} weight="duotone" aria-hidden="true" />
            <span>Alta priorità</span>
            <strong>{urgentTicketsCount}</strong>
          </article>
          <article>
            <CheckCircleIcon size={20} weight="duotone" aria-hidden="true" />
            <span>In attesa</span>
            <strong>{waitingTicketsCount}</strong>
          </article>
        </section>

        <TicketDashboardLayout
          sidebar={sidebar}
          detail={<TicketDetail ticket={selectedTicket ?? null} />}
        >
          {queue}
        </TicketDashboardLayout>
      </main>
    </div>
  );
}