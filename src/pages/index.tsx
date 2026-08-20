import React from 'react';
import clsx from 'clsx';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Victoria Open API Docs</h1>
          <p className={styles.heroSubtitle}>维多利亚开放平台开发者文档</p>
          <p className={styles.heroDescription}>
            接入指南、API 参考与 Webhook 文档，帮助开发者快速接入 Victoria 开放能力。
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/guide/overview">
              开始接入
            </Link>
            <Link className="button button--secondary button--lg" to="/api/passkey/overview">
              API 参考
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.cards}>
        <div className="card-group">
          <a className="card" href="/guide/overview">
            <div className="card-icon">🚀</div>
            <h3 className="card-title">快速接入</h3>
            <p className="card-body">从创建账号到完成首次调用的完整流程。</p>
          </a>
          <a className="card" href="/api/passkey/overview">
            <div className="card-icon">🔌</div>
            <h3 className="card-title">API 参考</h3>
            <p className="card-body">基于 OpenAPI 自动生成的接口文档，支持在线调试。</p>
          </a>
          <a className="card" href="/guide/webhooks">
            <div className="card-icon">🔔</div>
            <h3 className="card-title">Webhook 通知</h3>
            <p className="card-body">实时接收业务事件，自动化你的业务闭环。</p>
          </a>
          <a className="card" href="/guide/quickstart">
            <div className="card-icon">📚</div>
            <h3 className="card-title">接入指南</h3>
            <p className="card-body">从零开始的开发者指南，含示例与注意事项。</p>
          </a>
        </div>
      </section>
    </main>
  );
}