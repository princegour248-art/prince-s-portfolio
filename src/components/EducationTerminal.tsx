import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal as TerminalIcon, Sparkles, X, CornerDownLeft } from 'lucide-react';
import './EducationTerminal.css';

interface TerminalEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const formatTimestamp = () => {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
};

export const EducationTerminal: React.FC = () => {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when clicking anywhere inside the terminal body
  const handleTerminalClick = (e: React.MouseEvent) => {
    // Avoid stealing focus if user is selecting text
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    // Do not interfere if user clicked a button
    if ((e.target as HTMLElement).closest('button')) return;

    inputRef.current?.focus();
  };

  // Auto-scroll output to bottom on new output
  useEffect(() => {
    const el = terminalBodyRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [entries]);

  // Execute a command string through the safe local command processor
  const executeCommand = useCallback((cmdRaw: string) => {
    const trimmed = cmdRaw.trim();
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const time = formatTimestamp();

    if (!trimmed) {
      setEntries(prev => [
        ...prev,
        {
          id,
          command: '',
          output: null,
          timestamp: time
        }
      ]);
      return;
    }

    // Save to history (avoid duplicates at end of history)
    setHistory(prev => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
    setHistoryIndex(-1);

    const lower = trimmed.toLowerCase();

    // Command Parser
    if (lower === 'clear' || lower === 'cls') {
      setEntries([]);
      return;
    }

    let outputNode: React.ReactNode;

    switch (lower) {
      case 'help':
        outputNode = (
          <div className="terminal-output-text">
            <p style={{ color: '#FF8C42', marginBottom: '8px', fontWeight: 600 }}>
              Available Terminal Commands:
            </p>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">education --current</span>
              <span>Display current BCA degree, institution &amp; academic focus</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">education --history</span>
              <span>Display High School &amp; Intermediate academic records</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">education --institution</span>
              <span>Display verified institution details &amp; campus location</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">education --all</span>
              <span>Display complete chronological academic records summary</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">whoami</span>
              <span>Display verified developer profile &amp; technical focus</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">help</span>
              <span>Show this command reference list</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-orange">clear</span>
              <span>Clear visible terminal screen (retains command history)</span>
            </div>
            <p style={{ color: '#71717A', marginTop: '10px', fontSize: '12px' }}>
              Tip: Use &uarr; and &darr; arrow keys to cycle through previously run commands.
            </p>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="terminal-output-text">
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Name:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Prince Gour</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Status:</span>
              <span>Bachelor of Computer Applications (BCA) Student</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Institution:</span>
              <span>ITM, GIDA, Gorakhpur</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Focus:</span>
              <span>Web Development, Software Development, and AI</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Verified Records:</span>
              <span>High School, Intermediate, BCA Undergraduate</span>
            </div>
          </div>
        );
        break;

      case 'education --current':
        outputNode = (
          <div className="terminal-output-text">
            <p style={{ color: '#27C93F', fontWeight: 600, marginBottom: '6px' }}>
              [ACTIVE UNDERGRADUATE ENROLLMENT]
            </p>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Degree:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                Bachelor of Computer Applications (BCA)
              </span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Field:</span>
              <span>Computer Science &amp; Application Development</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Institution:</span>
              <span>ITM, GIDA, Gorakhpur</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Academic Status:</span>
              <span style={{ color: '#FF8C42' }}>In Progress / Current Student</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Core Focus:</span>
              <span>Data Structures &amp; Algorithms, OOP (Java &amp; Python), DBMS (SQL), Web Technologies, Software Engineering</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-muted">Grades / CGPA:</span>
              <span className="terminal-highlight-muted">Not provided (honestly omitted)</span>
            </div>
          </div>
        );
        break;

      case 'education --institution':
        outputNode = (
          <div className="terminal-output-text">
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Institution:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                ITM (Institute of Technology and Management)
              </span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Campus / Location:</span>
              <span>GIDA, Gorakhpur, Uttar Pradesh, India</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Affiliation:</span>
              <span>Degree College Campus / Technical Higher Education</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Program Enrolled:</span>
              <span>Bachelor of Computer Applications (BCA)</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-muted">Official Portal:</span>
              <span className="terminal-highlight-muted">Not provided / Unverified link omitted</span>
            </div>
          </div>
        );
        break;

      case 'education --history':
        outputNode = (
          <div className="terminal-output-text">
            <p style={{ color: '#FF8C42', fontWeight: 600, marginBottom: '8px' }}>
              Verified Secondary &amp; Senior Secondary History:
            </p>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#FF6A00', fontWeight: 700, fontSize: '13px' }}>
                INTERMEDIATE (12TH GRADE)
              </div>
              <div style={{ paddingLeft: '8px', borderLeft: '2px solid #FF6A00', marginTop: '4px' }}>
                <div><strong>Institution :</strong> RAGHURAJ SINGH KISAN INTER COLLEGE</div>
                <div><strong>Status      :</strong> Completed</div>
                <div style={{ color: '#71717A', fontSize: '12px' }}>
                  Board / Stream / Percentage: Not provided
                </div>
              </div>
            </div>

            <div>
              <div style={{ color: '#FF6A00', fontWeight: 700, fontSize: '13px' }}>
                HIGH SCHOOL (10TH GRADE)
              </div>
              <div style={{ paddingLeft: '8px', borderLeft: '2px solid #FF6A00', marginTop: '4px' }}>
                <div><strong>Institution :</strong> RAGHURAJ SINGH KISAN INTER COLLEGE</div>
                <div><strong>Status      :</strong> Completed</div>
                <div style={{ color: '#71717A', fontSize: '12px' }}>
                  Board / Percentage: Not provided
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'education --all':
      case 'education':
        outputNode = (
          <div className="terminal-output-text">
            <p style={{ color: '#FF8C42', fontWeight: 700, marginBottom: '10px' }}>
              === PRINCE GOUR // COMPLETE ACADEMIC RECORDS ===
            </p>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#27C93F', fontWeight: 700 }}>
                [01] Bachelor of Computer Applications (BCA) &bull; CURRENT
              </div>
              <div style={{ paddingLeft: '10px', marginTop: '2px' }}>
                <div>Institution : ITM, GIDA, Gorakhpur</div>
                <div>Status      : In Progress / Undergraduate Student</div>
                <div>Focus Area  : Software Development, Artificial Intelligence &amp; Web Systems</div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#F59E0B', fontWeight: 700 }}>
                [02] Intermediate (12th Grade) &bull; COMPLETED
              </div>
              <div style={{ paddingLeft: '10px', marginTop: '2px' }}>
                <div>Institution : RAGHURAJ SINGH KISAN INTER COLLEGE</div>
                <div>Status      : Completed</div>
              </div>
            </div>

            <div>
              <div style={{ color: '#3B82F6', fontWeight: 700 }}>
                [03] High School (10th Grade) &bull; COMPLETED
              </div>
              <div style={{ paddingLeft: '10px', marginTop: '2px' }}>
                <div>Institution : RAGHURAJ SINGH KISAN INTER COLLEGE</div>
                <div>Status      : Completed</div>
              </div>
            </div>
            <p style={{ color: '#71717A', marginTop: '10px', fontSize: '12px' }}>
              Note: Unverified marks, enrollment numbers, and board rankings are omitted for strict data integrity.
            </p>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="terminal-output-text" style={{ color: '#EF4444' }}>
            <span>Command not found: </span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>&apos;{trimmed}&apos;</span>
            <span style={{ color: '#A1A1AA' }}>. Type </span>
            <span
              style={{ color: '#FF6A00', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => executeCommand('help')}
            >
              help
            </span>
            <span style={{ color: '#A1A1AA' }}> to see available commands.</span>
          </div>
        );
        break;
    }

    setEntries(prev => [
      ...prev,
      {
        id,
        command: trimmed,
        output: outputNode,
        timestamp: time
      }
    ]);
  }, []);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue;
    setInputValue('');
    executeCommand(cmd);
  };

  // Keyboard Navigation: Up/Down arrow for history, Esc to clear
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;

      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputValue(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;

      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIdx);
        setInputValue(history[nextIdx]);
      }
    } else if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  // Mount with initial welcome message
  useEffect(() => {
    // Execute default overview command to give visitor instant helpful context
    const id = 'initial-welcome';
    setEntries([
      {
        id,
        command: 'education --current',
        output: (
          <div className="terminal-output-text">
            <p style={{ color: '#27C93F', fontWeight: 600, marginBottom: '6px' }}>
              [ACTIVE UNDERGRADUATE ENROLLMENT]
            </p>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Degree:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                Bachelor of Computer Applications (BCA)
              </span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Institution:</span>
              <span>ITM, GIDA, Gorakhpur</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Status:</span>
              <span style={{ color: '#FF8C42' }}>In Progress / Current Student</span>
            </div>
            <div className="terminal-table-row">
              <span className="terminal-highlight-accent">Focus:</span>
              <span>Software Engineering, Artificial Intelligence, and Web Development</span>
            </div>
          </div>
        ),
        timestamp: formatTimestamp()
      }
    ]);
  }, []);

  return (
    <div className="education-terminal-wrapper">
      <div className="terminal-window">
        {/* Terminal Chrome Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-controls" aria-hidden="true">
            <span className="terminal-dot close" />
            <span className="terminal-dot minimize" />
            <span className="terminal-dot maximize" />
          </div>

          <div className="terminal-title-label">
            <TerminalIcon size={14} color="#FF6A00" />
            <span>education-terminal</span>
          </div>

          <div>
            <span className="terminal-simulation-badge">SIMULATION</span>
          </div>
        </div>

        {/* Scrollable Terminal Output Body */}
        <div
          ref={terminalBodyRef}
          className="terminal-body"
          onClick={handleTerminalClick}
          aria-live="polite"
          aria-relevant="additions"
          role="region"
          aria-label="Education Terminal Output Console"
        >
          {/* Welcome Banner */}
          <div className="terminal-welcome">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={13} color="#FF6A00" />
              <span className="terminal-welcome-brand">Prince Gour Education Shell v1.0.0</span>
            </div>
            <p style={{ margin: 0, color: '#71717A' }}>
              Type <strong style={{ color: '#F5F5F5' }}>help</strong> or use the quick buttons below to query verified academic records.
            </p>
          </div>

          {/* Historical Output Entries */}
          {entries.map(entry => (
            <div key={entry.id} className="terminal-entry">
              {entry.command && (
                <div className="terminal-command-line">
                  <span className="terminal-prompt-user">prince@portfolio</span>
                  <span className="terminal-prompt-path">:~$</span>
                  <span className="terminal-command-text">{entry.command}</span>
                  <span style={{ color: '#52525B', fontSize: '11px', marginLeft: 'auto' }}>
                    {entry.timestamp}
                  </span>
                </div>
              )}
              {entry.output && (
                <div className="terminal-output-block">
                  {entry.output}
                </div>
              )}
            </div>
          ))}

          {/* Active Command Input Line */}
          <form onSubmit={handleSubmit} className="terminal-input-bar">
            <label htmlFor="terminal-command-input" className="sr-only">
              Terminal command input
            </label>
            <span className="terminal-prompt-user" aria-hidden="true">prince@portfolio</span>
            <span className="terminal-prompt-path" aria-hidden="true">:~$</span>
            <input
              id="terminal-command-input"
              ref={inputRef}
              type="text"
              className="terminal-input-field"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="type 'help' or command here..."
            />

            {inputValue && (
              <button
                type="button"
                className="terminal-clear-input-btn"
                onClick={() => {
                  setInputValue('');
                  inputRef.current?.focus();
                }}
                title="Clear input"
                aria-label="Clear input line"
              >
                <X size={13} />
              </button>
            )}

            <button
              type="submit"
              className="terminal-clear-input-btn"
              title="Submit command"
              aria-label="Submit command"
            >
              <CornerDownLeft size={13} />
            </button>
          </form>
        </div>

        {/* Quick Commands Navigation Bar */}
        <div className="terminal-quick-bar">
          <span className="terminal-quick-label">
            Quick Queries:
          </span>

          <button
            type="button"
            className="terminal-quick-btn accent"
            onClick={() => executeCommand('education --current')}
            title="Run 'education --current'"
          >
            <span>Current Education</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('education --history')}
            title="Run 'education --history'"
          >
            <span>Academic History</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('education --institution')}
            title="Run 'education --institution'"
          >
            <span>Institution</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('education --all')}
            title="Run 'education --all'"
          >
            <span>All Education</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('whoami')}
            title="Run 'whoami'"
          >
            <span>Whoami</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('help')}
            title="Run 'help'"
          >
            <span>Help</span>
          </button>

          <button
            type="button"
            className="terminal-quick-btn"
            onClick={() => executeCommand('clear')}
            title="Run 'clear'"
            style={{ marginLeft: 'auto' }}
          >
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationTerminal;
