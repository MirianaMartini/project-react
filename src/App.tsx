/**
 * App rappresenta il punto di ingresso dell'interfaccia.
 * Importa la feature tickets dalla sua API pubblica.
 */
import { TicketDashboard } from './features/tickets';

export function App() {
  return <TicketDashboard />;
}

