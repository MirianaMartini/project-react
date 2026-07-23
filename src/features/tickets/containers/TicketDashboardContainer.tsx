/** Il container collega fixture, hook e contratto della view. */
import { TicketDashboardView } from '../components/TicketDashboardView/TicketDashboardView';
import { useTicketDashboard } from '../hooks/useTicketDashboard';
import { tickets } from '../tickets';

export function TicketDashboardContainer() {
  const dashboard = useTicketDashboard(tickets);

  return (
    <TicketDashboardView
      tickets={dashboard.visibleTickets}
      selectedTicketId={dashboard.selectedTicketId}
      selectedTicket={dashboard.selectedTicket}
      query={dashboard.query}
      statusFilter={dashboard.statusFilter}
      summary={dashboard.summary}
      onQueryChange={dashboard.setQuery}
      onStatusChange={dashboard.setStatusFilter}
      onSelectTicket={dashboard.selectTicket}
      onResetFilters={dashboard.resetFilters}
    />
  );
}