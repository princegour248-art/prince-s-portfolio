import React, { useState, useEffect } from 'react';
import { Star, GitFork, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { GithubIcon } from './icons';
import { PORTFOLIO_CONFIG } from '../data/portfolioData';

interface Repository {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export const GithubSection: React.FC = () => {
  const { contact } = PORTFOLIO_CONFIG.personal;
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGithubRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/users/${contact.githubUsername}/repos?sort=updated&per_page=6`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        throw new Error('Unexpected data format from GitHub');
      }
    } catch (err: any) {
      console.warn('GitHub API fetch failed or rate-limited. Using fallback repository info.', err);
      setError('Live GitHub API rate limited or offline. Displaying verified repository metadata.');
      // Fallback verified repository
      setRepos([
        {
          name: 'master-sahab-ai-student-assistant',
          description: 'A production-grade AI student assistant helping students understand academic topics, organize routines, and solve doubts.',
          html_url: 'https://github.com/princegour248-art/master-sahab-ai-student-assistant',
          stargazers_count: 1,
          forks_count: 0,
          language: 'Python',
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubRepos();
  }, [contact.githubUsername]);

  return (
    <section id="github" className="section" style={{ borderBottom: '1px solid #222222' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span className="section-tag">08 &bull; Open Source</span>
            <h2 className="section-title">GitHub Activity</h2>
            <p className="section-subtitle">
              Live public repositories fetched directly from GitHub (<code>github.com/{contact.githubUsername}</code>).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={fetchGithubRepos}
              className="btn btn-secondary btn-sm"
              title="Refresh GitHub repositories"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <GithubIcon size={15} />
              <span>View Profile</span>
            </a>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#1C1611',
              border: '1px solid rgba(232, 117, 36, 0.3)',
              color: '#F28C38',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            <AlertCircle size={16} flex-shrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Repositories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
          className="repos-grid"
        >
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#737373', gridColumn: '1 / -1' }}>
              Fetching latest repositories from GitHub...
            </div>
          ) : repos.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#737373', gridColumn: '1 / -1' }}>
              No public repositories found.
            </div>
          ) : (
            repos.map((repo, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  backgroundColor: '#161616',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#F5F2ED',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        wordBreak: 'break-word'
                      }}
                    >
                      <span>{repo.name}</span>
                      <ExternalLink size={13} color="#E87524" style={{ flexShrink: 0 }} />
                    </a>
                  </div>

                  <p style={{ fontSize: '13px', color: '#A6A6A6', lineHeight: 1.55, marginBottom: '16px' }}>
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #242424',
                    fontSize: '12px',
                    color: '#737373'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {repo.language && (
                      <>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E87524' }} />
                        <span style={{ color: '#D4D4D8' }}>{repo.language}</span>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} /> {repo.stargazers_count}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitFork size={13} /> {repo.forks_count}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .repos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
