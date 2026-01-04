import Head from 'next/head';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="layout">
        <Head>
            <title>TickerTrends</title>
            <link rel="icon" href="/favicon.svg" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </Head>
        <div className="bg-grid" aria-hidden />
        <div className="bg-gradient" aria-hidden />
        <header className="header">
            <div>
                <p className="eyebrow">TickerTrends</p>
                <h1>Black + blue neon console</h1>
                <p className="lede">Scrape, store, and compare media momentum for any keyword.</p>
            </div>
        </header>
        <main className="main-shell">{children}</main>
        <footer className="footer">Created by: Chester Grudzinski 2025</footer>
    </div>
);

export default Layout;