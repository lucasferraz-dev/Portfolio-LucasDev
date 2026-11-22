import { forwardRef } from 'react';
import styles from './TerminalWindow.module.css';

/*
 * Janela de terminal/editor usada nos três “terminais” do site (SQL do topo,
 * JSON do Sobre e o shell do contato): barra de título com as três bolinhas,
 * aba com o nome do arquivo, o programa à direita e uma barra de status embaixo.
 */
const TerminalWindow = forwardRef(function TerminalWindow(
  { title, app, status, statusRight, live = true, className = '', bodyClassName = '', children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={`${styles.window} ${className}`} {...rest}>
      <div className={styles.titleBar}>
        <span className={styles.lights} aria-hidden="true">
          <span className={styles.light} />
          <span className={styles.light} />
          <span className={styles.light} />
        </span>
        <span className={styles.tab}>
          <svg viewBox="0 0 24 24" className={styles.tabIcon} aria-hidden="true">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
          {title}
        </span>
        {app && <span className={styles.app}>{app}</span>}
      </div>

      <div className={`${styles.body} ${bodyClassName}`}>{children}</div>

      {(status || statusRight) && (
        <div className={styles.statusBar}>
          <span className={styles.statusLeft}>
            <span className={`${styles.statusDot} ${live ? styles.statusLive : ''}`} aria-hidden="true" />
            {status}
          </span>
          {statusRight && <span className={styles.statusRight}>{statusRight}</span>}
        </div>
      )}
    </div>
  );
});

export default TerminalWindow;
