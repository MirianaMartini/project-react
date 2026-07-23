/** 
 * Il servizio locale simula latenza e filtro remoto senza richiedere un backend. 
 * La factory crea istanze indipendenti, utili anche nei test. 
 */
import { tickets } from '../tickets';
import type { TicketFiltersValue } from '../ticket.types';
import type { TicketService } from './TicketService';

type LocalTicketServiceOptions = {
  delay?: number;
  failFirstRequest?: boolean;
};

export function createLocalTicketService({
  delay = 450,
  failFirstRequest = false,
}: LocalTicketServiceOptions = {}): TicketService {
  let hasFailed = false;

  return {
    list(filters: TicketFiltersValue, signal: AbortSignal) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Richiesta annullata', 'AbortError'));
          return;
        }

        const timerId = window.setTimeout(() => {
          signal.removeEventListener('abort', handleAbort);

          if (failFirstRequest && !hasFailed) {
            hasFailed = true;
            reject(new Error('Il servizio ticket non è disponibile.'));
            return;
          }

          const normalizedQuery = filters.query
            .trim()
            .toLocaleLowerCase('it-IT');
          const result = tickets.filter((ticket) => {
            const matchesStatus =
              filters.status === 'tutti' || ticket.status === filters.status;
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

          resolve(result);
        }, delay);

        function handleAbort() {
          window.clearTimeout(timerId);
          reject(new DOMException('Richiesta annullata', 'AbortError'));
        }

        signal.addEventListener('abort', handleAbort, { once: true });
      });
    },
  };
}