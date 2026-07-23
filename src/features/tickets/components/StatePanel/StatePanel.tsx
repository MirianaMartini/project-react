/** StatePanel presenta i tre esiti che sostituiscono la lista. */
import {
  ArrowClockwiseIcon,
  MagnifyingGlassIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import './StatePanel.scss';

type StatePanelProps =
  | { state: 'loading' }
  | { state: 'empty'; onReset: () => void }
  | { state: 'error'; message: string; onRetry: () => void };

export function StatePanel(props: StatePanelProps) {
  if (props.state === 'loading') {
    return (
      <div className="state-panel" role="status" aria-label="Caricamento ticket">
        <div className="state-panel__skeleton" aria-hidden="true" />
        <div className="state-panel__skeleton" aria-hidden="true" />
        <span>Caricamento della coda</span>
      </div>
    );
  }

  if (props.state === 'error') {
    return (
      <div className="state-panel" role="alert">
        <WarningCircleIcon size={30} weight="duotone" aria-hidden="true" />
        <h3>Non posso caricare i ticket</h3>
        <p>{props.message}</p>
        <button type="button" onClick={props.onRetry}>
          <ArrowClockwiseIcon size={18} weight="bold" aria-hidden="true" />
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="state-panel" role="status">
      <MagnifyingGlassIcon size={30} weight="duotone" aria-hidden="true" />
      <h3>Nessun ticket trovato</h3>
      <p>Modifica la ricerca oppure reimposta i filtri.</p>
      <button type="button" onClick={props.onReset}>Mostra tutti i ticket</button>
    </div>
  );
}