/** La view compone componenti presentazionali e non conosce le fixture. */
import {
  BuildingsIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import type { Ticket, TicketStatusFilter } from '../../ticket.types';
import { TicketDashboardLayout } from '../TicketDashboardLayout/TicketDashboardLayout';
import { TicketDetail } from '../TicketDetail/TicketDetail';
import { TicketFilters } from '../TicketFilters/TicketFilters';
import { TicketList } from '../TicketList/TicketList';
import './TicketDashboardView.scss';

type TicketDashboardViewProps = {
  tickets: Ticket[];
  selectedTicketId: string | null;
  selectedTicket: Ticket | null;
  query: string;
  statusFilter: TicketStatusFilter;
  summary: { total: number; open: number; urgent: number; waiting: number };
  onQueryChange: (query: string) => void;
  onStatusChange: (status: TicketStatusFilter) => void;
  onSelectTicket: (ticketId: string) => void;
  onResetFilters: () => void;
};

export function TicketDashboardView({
  tickets,
  selectedTicketId,
  selectedTicket,
  query,
  statusFilter,
  summary,
  onQueryChange,
  onStatusChange,
  onSelectTicket,
  onResetFilters,
}: TicketDashboardViewProps) {
  const sidebar = (
    <TicketFilters
      query={query}
      status={statusFilter}
      resultCount={tickets.length}
      onQueryChange={onQueryChange}
      onStatusChange={onStatusChange}
      onReset={onResetFilters}
    />
  );
  const detail = <TicketDetail ticket={selectedTicket} />;

  return (
    <div className="ticket-dashboard-view">
      <header className="ticket-dashboard-view__topbar">
        <a href="#main-content" className="ticket-dashboard-view__brand">
          <BuildingsIcon size={20} weight="bold" aria-hidden="true" />
          <span>
            <strong>Control Room</strong>
            <small>Operations support</small>
          </span>
        </a>
        <span>Ambiente didattico</span>
      </header>
      <main id="main-content" className="ticket-dashboard-view__main">
        <header className="ticket-dashboard-view__heading">
          <div>
            <p>Coda assistenza</p>
            <h1>Operations Dashboard</h1>
            <span>
              Controlla le richieste aperte e assegna la priorità al prossimo intervento.
            </span>
          </div>
          <div aria-live="polite">
            <span>Ticket selezionato</span>
            <strong>{selectedTicket?.id ?? 'Nessuno'}</strong>
          </div>
        </header>
        <section
          className="ticket-dashboard-view__metrics"
          aria-label="Riepilogo ticket"
        >
          <article>
            <TicketIcon size={20} aria-hidden="true" />
            <span>Totali</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <ClockIcon size={20} aria-hidden="true" />
            <span>Aperti</span>
            <strong>{summary.open}</strong>
          </article>
          <article>
            <WarningIcon size={20} aria-hidden="true" />
            <span>Alta priorità</span>
            <strong>{summary.urgent}</strong>
          </article>
          <article>
            <CheckCircleIcon size={20} aria-hidden="true" />
            <span>In attesa</span>
            <strong>{summary.waiting}</strong>
          </article>
        </section>
        <TicketDashboardLayout sidebar={sidebar} detail={detail}>
          <section
            className="ticket-dashboard-view__queue"
            aria-labelledby="queue-title"
          >
            <header>
              <div>
                <h2 id="queue-title">Coda ticket</h2>
                <p>Ordine di aggiornamento, dal più recente.</p>
              </div>
              <span>{tickets.length} risultati</span>
            </header>
            {tickets.length > 0 ? (
              <TicketList
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelect={onSelectTicket}
              />
            ) : (
              <div className="ticket-dashboard-view__empty" role="status">
                <MagnifyingGlassIcon size={28} aria-hidden="true" />
                <h3>Nessun ticket trovato</h3>
                <p>Modifica la ricerca oppure reimposta i filtri.</p>
                <button type="button" onClick={onResetFilters}>
                  Mostra tutti i ticket
                </button>
              </div>
            )}
          </section>
        </TicketDashboardLayout>
      </main>
    </div>
  );
}