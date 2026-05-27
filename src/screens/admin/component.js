import React, { useRef, useState } from 'react';

import {
  AddBlogPost,
  BlogPosts,
  ChangePassword,
  FileUpload,
  Login,
  UploadHistory,
  UserSection,
} from './components';

import { runPipeline, updateHistogram } from '../../services/admin';

import './style.scss';

const guideURL = 'https://docs.google.com/document/u/1/d/e/2PACX-1vS-VkOBKcB3_nAsyIYUU-ogG-zezQd-XZmDt5SFqMPd6OkrpRXGtoa1_Fr0gDL6LBIwzQI9A6Ix3JKr/pub';

const TABS = [
  { id: 'data', label: 'Data' },
  { id: 'users', label: 'Users' },
  { id: 'blog', label: 'Blog' },
];

const Admin = (props) => {
  const {
    isLoggedIn,
    signOut,
    user,
  } = props;

  const {
    first_name: firstName,
    last_name: lastName,
  } = user;

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [runningModels, setRunningModels] = useState(false);
  const [updatingHistogram, setUpdatingHistogram] = useState(false);
  const [modelError, setModelError] = useState('');
  const [histogramError, setHistogramError] = useState('');
  const [activeTab, setActiveTab] = useState('data');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const tabRefs = useRef([]);

  // Refresh the upload history after an upload completes. The upload service
  // resolves only once the audit row exists (sync for county/RD; polled to
  // completion for Survey123), so a single bump is enough — no timers.
  const handleUploadComplete = () => {
    setHistoryRefreshKey((k) => k + 1);
  };

  const onTabKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = TABS.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      setActiveTab(TABS[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const runAllModels = async () => {
    setModelError('');
    setRunningModels(true);

    try {
      await runPipeline();
    } catch (err) {
      setModelError(err?.response?.data?.error?.message || '');
    } finally {
      setRunningModels(false);
    }
  };

  const runUpdateHistogram = async () => {
    setHistogramError('');
    setUpdatingHistogram(true);

    try {
      await updateHistogram();
    } catch (err) {
      setHistogramError(err?.response?.data || '');
    } finally {
      setUpdatingHistogram(false);
    }
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div id="auth-container">
      <header className="admin-topbar">
        <div className="admin-topbar-heading">
          <h1>Admin Dashboard</h1>
          <p className="admin-greeting">Hi, {lastName ? `${firstName} ${lastName}` : firstName}!</p>
        </div>
        <div className="admin-topbar-actions">
          <button type="button" className="admin-link-button" onClick={() => setChangePasswordVisible(true)}>
            Change Password
          </button>
          <button type="button" className="admin-link-button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            ref={(el) => { tabRefs.current[index] = el; }}
            className={`admin-tab${activeTab === tab.id ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => onTabKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'data' && (
        <div id="panel-data" role="tabpanel" aria-labelledby="tab-data" className="admin-grid">
          <section className="admin-card" aria-labelledby="uploads-heading">
            <div className="admin-card-head">
              <h2 id="uploads-heading">Data Uploads</h2>
              <p className="admin-card-note">
                Before uploading, please read <a href={guideURL} target="_blank" rel="noopener noreferrer">this guide</a>.
              </p>
            </div>
            <FileUpload guideURL={guideURL} onUploadComplete={handleUploadComplete} />
          </section>

          <section className="admin-card" aria-labelledby="history-heading">
            <div className="admin-card-head">
              <h2 id="history-heading">Upload History</h2>
            </div>
            <UploadHistory refreshKey={historyRefreshKey} />
          </section>

          <section className="admin-card" aria-labelledby="actions-heading">
            <div className="admin-card-head">
              <h2 id="actions-heading">Pipeline Actions</h2>
              <p className="admin-card-note">Re-run predictions or refresh the histogram after uploading new data.</p>
            </div>
            <div className="admin-actions">
              <div className="admin-action">
                <button
                  className="admin-button"
                  disabled={runningModels}
                  onClick={runAllModels}
                  type="button"
                >
                  {runningModels ? 'Running…' : 'Rerun all models'}
                </button>
                {modelError && <p className="admin-action-error" role="alert">{modelError}</p>}
              </div>
              <div className="admin-action">
                <button
                  className="admin-button"
                  disabled={updatingHistogram}
                  onClick={runUpdateHistogram}
                  type="button"
                >
                  {updatingHistogram ? 'Updating…' : 'Update histogram'}
                </button>
                {histogramError && <p className="admin-action-error" role="alert">{histogramError}</p>}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'users' && (
        <div id="panel-users" role="tabpanel" aria-labelledby="tab-users" className="admin-grid">
          <section className="admin-card" aria-labelledby="users-heading">
            <div className="admin-card-head">
              <h2 id="users-heading">Users</h2>
            </div>
            <UserSection activeUser={user} />
          </section>
        </div>
      )}

      {activeTab === 'blog' && (
        <div id="panel-blog" role="tabpanel" aria-labelledby="tab-blog" className="admin-grid">
          <div className="admin-blog-stack">
            <AddBlogPost />
            <BlogPosts />
          </div>
        </div>
      )}

      <ChangePassword
        close={() => setChangePasswordVisible(false)}
        open={() => setChangePasswordVisible(true)}
        visible={changePasswordVisible}
      />
    </div>
  );
};

export default Admin;
