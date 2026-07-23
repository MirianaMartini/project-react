/** Il container crea la dipendenza stabile e adatta il hook alla view. */
import { TicketDashboardView } from '../components/TicketDashboardView/TicketDashboardView';
import { useTicketDashboard } from '../hooks/useTicketDashboard';
import { createLocalTicketService } from '../services/createLocalTicketService';

const shouldFailOnce =
  new URLSearchParams(window.location.search).get('scenario') === 'error-once';

// Istanza creata all'esterno del componente per mantenerla stabile durante i re-render
const ticketService = createLocalTicketService({ failFirstRequest: shouldFailOnce });

export function TicketDashboardContainer() {
  const dashboard = useTicketDashboard(ticketService);

  return (
    <TicketDashboardView
      tickets={dashboard.tickets}
      selectedTicketId={dashboard.selectedTicketId}
      selectedTicket={dashboard.selectedTicket}
      query={dashboard.query}
      statusFilter={dashboard.statusFilter}
      summary={dashboard.summary}
      loadStatus={dashboard.loadStatus}
      error={dashboard.error}
      isSearching={dashboard.isSearching}
      onQueryChange={dashboard.setQuery}
      onStatusChange={dashboard.setStatusFilter}
      onSelectTicket={dashboard.selectTicket}
      onResetFilters={dashboard.resetFilters}
      onRetry={dashboard.retry}
    />
  );
}