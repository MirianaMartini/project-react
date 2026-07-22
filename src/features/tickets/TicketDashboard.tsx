/**
 * TicketDashboard contiene intenzionalmente più responsabilità:
 * stato, dati derivati, filtri, lista e riepilogo vivono nello stesso file.
 * Lo starter funziona, mentre i TODO mostreranno come separare questi confini.
 */
import {
  BuildingsIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { TicketDashboardLayout } from './components/TicketDashboardLayout/TicketDashboardLayout';
import { TicketDetail } from './components/TicketDetail/TicketDetail';
import { TicketFilters } from './components/TicketFilters/TicketFilters';
import { useTicketDashboard } from './hooks/useTicketDashboard';
import { TicketList } from './components/TicketList/TicketList';
import { tickets } from './tickets';
import './TicketDashboard.scss';

export function TicketDashboard() {
  const {
    query,
    statusFilter,
    selectedTicketId,
    selectedTicket,
    visibleTickets,
    summary,
    setQuery,
    setStatusFilter,
    selectTicket,
    resetFilters,
  } = useTicketDashboard(tickets);

  const sidebar = (
    <TicketFilters
      query={query}
      status={statusFilter}
      resultCount={visibleTickets.length}
      onQueryChange={setQuery}
      onStatusChange={setStatusFilter}
      onReset={resetFilters}
    />
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
                onSelect={selectTicket}
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
            <strong>{summary.total}</strong>
          </article>
          <article>
            <ClockIcon size={20} weight="duotone" aria-hidden="true" />
            <span>Aperti</span>
            <strong>{summary.open}</strong>
          </article>
          <article>
            <WarningIcon size={20} weight="duotone" aria-hidden="true" />
            <span>Alta priorità</span>
            <strong>{summary.urgent}</strong>
          </article>
          <article>
            <CheckCircleIcon size={20} weight="duotone" aria-hidden="true" />
            <span>In attesa</span>
            <strong>{summary.waiting}</strong>
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