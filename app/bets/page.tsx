'use client';

import { useEffect, useMemo, useState } from 'react';

type Selection = {
  id: string;
  match: string;
  league: string;
  choice: string;
  odds: number;
};

type BetCoupon = {
  id: string;
  code: string;
  createdAt: string;
  selections: Selection[];
  totalOdds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
};

const availableSelections: Selection[] = [
  {
    id: 'arsenal-chelsea-1',
    match: 'Arsenal vs Chelsea',
    league: 'Premier League',
    choice: 'Arsenal gagne',
    odds: 1.65,
  },
  {
    id: 'barca-sevilla-1',
    match: 'Barcelona vs Sevilla',
    league: 'La Liga',
    choice: 'Barcelona gagne',
    odds: 1.42,
  },
  {
    id: 'inter-milan-1',
    match: 'Inter vs Milan',
    league: 'Serie A',
    choice: 'Inter gagne',
    odds: 1.75,
  },
];

const COUPON_STORAGE = 'goalix_current_coupon';
const BETS_STORAGE = 'goalix_bets_history';
const SHARED_STORAGE = 'goalix_shared_coupons';

function generateCouponCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = 'GX';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return code;
}

export default function BetsPage() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState('');
  const [history, setHistory] = useState<BetCoupon[]>([]);
  const [shareCode, setShareCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem(
        COUPON_STORAGE
      );

      const savedHistory = localStorage.getItem(
        BETS_STORAGE
      );

      if (savedCoupon) {
        setSelections(JSON.parse(savedCoupon));
      }

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error(
        'Erreur de chargement du coupon:',
        error
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      COUPON_STORAGE,
      JSON.stringify(selections)
    );
  }, [selections]);

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;

    return selections.reduce(
      (total, selection) =>
        total * selection.odds,
      1
    );
  }, [selections]);

  const potentialWin = useMemo(() => {
    const amount = Number(stake);

    if (
      !amount ||
      amount <= 0 ||
      totalOdds === 0
    ) {
      return 0;
    }

    return amount * totalOdds;
  }, [stake, totalOdds]);

  function addSelection(
    selection: Selection
  ) {
    setSelections((current) => {
      if (
        current.some(
          (item) => item.id === selection.id
        )
      ) {
        return current;
      }

      return [...current, selection];
    });

    setMessage(
      `${selection.choice} ajouté au coupon.`
    );
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter(
        (selection) =>
          selection.id !== id
      )
    );
  }

  function clearCoupon() {
    setSelections([]);
    setStake('');
    setShareCode('');
    setMessage('Coupon effacé.');
  }

  function validateCoupon() {
    const amount = Number(stake);

    if (selections.length === 0) {
      setMessage(
        'Ajoutez au moins une sélection.'
      );
      return;
    }

    if (!amount || amount <= 0) {
      setMessage(
        'Veuillez entrer une mise valide.'
      );
      return;
    }

    const code = generateCouponCode();

    const coupon: BetCoupon = {
      id: `${Date.now()}`,
      code,
      createdAt:
        new Date().toLocaleString('fr-FR'),
      selections,
      totalOdds,
      stake: amount,
      potentialWin,
      status: 'pending',
    };

    const newHistory = [
      coupon,
      ...history,
    ];

    localStorage.setItem(
      BETS_STORAGE,
      JSON.stringify(newHistory)
    );

    const sharedCoupons = JSON.parse(
      localStorage.getItem(
        SHARED_STORAGE
      ) || '{}'
    );

    sharedCoupons[code] = coupon;

    localStorage.setItem(
      SHARED_STORAGE,
      JSON.stringify(sharedCoupons)
    );

    setHistory(newHistory);
    setShareCode(code);

    setSelections([]);
    setStake('');

    setMessage(
      `Coupon validé ! Code : ${code}`
    );
  }

  async function copyCode() {
    if (!shareCode) return;

    try {
      await navigator.clipboard.writeText(
        shareCode
      );

      setMessage(
        'Code coupon copié !'
      );
    } catch {
      setMessage(
        `Votre code : ${shareCode}`
      );
    }
  }

  async function shareCoupon() {
    if (!shareCode) return;

    const text =
      `🎟️ Mon coupon GOALIX\n\n` +
      `Code : ${shareCode}\n` +
      `${history[0]?.selections.length || 0} sélections\n` +
      `Cote : ${history[0]?.totalOdds.toFixed(2) || '0.00'}\n\n` +
      `Ouvre GOALIX pour utiliser ce coupon.`;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: 'Coupon GOALIX',
          text,
        });

        setMessage(
          'Coupon partagé.'
        );
      } else {
        await navigator.clipboard.writeText(
          text
        );

        setMessage(
          'Message de partage copié.'
        );
      }
    } catch {
      setMessage(
        'Partage annulé.'
      );
    }
  }

  function importCoupon() {
    const code =
      importCode
        .trim()
        .toUpperCase();

    if (!code) {
      setMessage(
        'Entrez un code coupon.'
      );
      return;
    }

    try {
      const sharedCoupons =
        JSON.parse(
          localStorage.getItem(
            SHARED_STORAGE
          ) || '{}'
        );

      const coupon =
        sharedCoupons[code];

      if (!coupon) {
        setMessage(
          'Coupon introuvable sur cet appareil.'
        );
        return;
      }

      setSelections(
        coupon.selections
      );

      setImportCode('');

      setMessage(
        `Coupon ${code} importé.`
      );
    } catch {
      setMessage(
        'Impossible d’importer ce coupon.'
      );
    }
  }

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);
  }

  return (
    <main className="bets-page">

      {/* HEADER */}
      <header className="bets-header">

        <div>
          <div className="bets-logo">
            GOA<span>LIX</span>
          </div>

          <div className="bets-subtitle">
            SPORTS BETTING
          </div>
        </div>

        <div className="bets-ticket-icon">
          🎟️
        </div>

      </header>

      {/* TITLE */}
      <section className="bets-intro">

        <span>
          GOALIX
        </span>

        <h1>
          Mon coupon
        </h1>

        <p>
          Préparez vos sélections avant
          de valider votre pari.
        </p>

      </section>

      {/* IMPORT */}
      <section className="import-coupon">

        <div>
          <span className="section-label">
            PARTAGER UN COUPON
          </span>

          <h2>
            🔎 Utiliser un code
          </h2>

          <p>
            Entrez le code d’un coupon
            GOALIX partagé avec vous.
          </p>
        </div>

        <div className="import-row">

          <input
            type="text"
            value={importCode}
            onChange={(event) =>
              setImportCode(
                event.target.value
              )
            }
            placeholder="Ex : GX7K4P9M"
            maxLength={8}
          />

          <button
            onClick={importCoupon}
          >
            Importer
          </button>

        </div>

      </section>

      {/* MESSAGE */}
      {message && (
        <div className="bets-message">
          <span>✓</span>
          {message}
        </div>
      )}

      {/* SELECTIONS */}
      <section className="bets-section">

        <div className="bets-section-title">

          <div>
            <span>
              SÉLECTIONS
            </span>

            <h2>
              Ajouter des paris
            </h2>
          </div>

          <div className="selection-count">
            {selections.length}
          </div>

        </div>

        <div className="selection-list">

          {availableSelections.map(
            (selection) => {

              const selected =
                selections.some(
                  (item) =>
                    item.id ===
                    selection.id
                );

              return (
                <button
                  key={selection.id}
                  onClick={() =>
                    addSelection(
                      selection
                    )
                  }
                  disabled={selected}
                  className={`selection-card ${
                    selected
                      ? 'selected'
                      : ''
                  }`}
                >

                  <div>
                    <small>
                      {selection.league}
                    </small>

                    <strong>
                      {selection.match}
                    </strong>

                    <span>
                      {selection.choice}
                    </span>
                  </div>

                  <b>
                    {selection.odds.toFixed(2)}
                  </b>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* CURRENT COUPON */}
      <section className="current-coupon">

        <div className="coupon-heading">

          <div>
            <span>
              COUPON
            </span>

            <h2>
              🎟️ Mon coupon
            </h2>
          </div>

          {selections.length > 0 && (
            <button
              onClick={clearCoupon}
              className="clear-button"
            >
              🗑️ Tout effacer
            </button>
          )}

        </div>

        {selections.length === 0 ? (

          <div className="empty-coupon">

            <div>
              🎟️
            </div>

            <strong>
              Votre coupon est vide
            </strong>

            <p>
              Ajoutez des sélections
              pour commencer.
            </p>

          </div>

        ) : (

          <>

            <div className="coupon-selections">

              {selections.map(
                (selection) => (

                  <div
                    key={selection.id}
                    className="coupon-selection"
                  >

                    <div>

                      <small>
                        {selection.league}
                      </small>

                      <strong>
                        {selection.match}
                      </strong>

                      <span>
                        {selection.choice}
                      </span>

                    </div>

                    <div className="coupon-right">

                      <b>
                        {selection.odds.toFixed(
                          2
                        )}
                      </b>

                      <button
                        onClick={() =>
                          removeSelection(
                            selection.id
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* TOTAL */}
            <div className="coupon-summary">

              <div>
                <span>
                  COTE TOTALE
                </span>

                <strong>
                  {totalOdds.toFixed(2)}
                </strong>
              </div>

              <div>
                <span>
                  MISE
                </span>

                <input
                  type="number"
                  min="0"
                  value={stake}
                  onChange={(event) =>
                    setStake(
                      event.target.value
                    )
                  }
                  placeholder="0"
                />

                <small>
                  FCFA
                </small>
              </div>

            </div>

            {/* WIN */}
            <div className="potential-win">

              <div>
                <span>
                  GAIN POTENTIEL
                </span>

                <strong>
                  {formatMoney(
                    potentialWin
                  )}{' '}
                  FCFA
                </strong>
              </div>

              <span>
                💰
              </span>

            </div>

            {/* VALIDATE */}
            <button
              onClick={validateCoupon}
              className="validate-button"
            >
              🎯 Valider le coupon
            </button>

            <p className="demo-warning">
              Mode démonstration —
              aucun argent réel n'est engagé.
            </p>

          </>
        )}

      </section>

      {/* SHARE CODE */}
      {shareCode && (

        <section className="share-result">

          <div className="share-icon">
            🔗
          </div>

          <div className="share-content">

            <span>
              VOTRE CODE GOALIX
            </span>

            <strong>
              {shareCode}
            </strong>

            <p>
              Partagez ce code avec
              quelqu’un pour lui permettre
              de retrouver votre coupon.
            </p>

            <div className="share-actions">

              <button
                onClick={copyCode}
              >
                📋 Copier
              </button>

              <button
                onClick={shareCoupon}
              >
                📤 Partager
              </button>

            </div>

          </div>

        </section>

      )}

      {/* MY BETS */}
      <section className="my-bets">

        <div className="bets-section-title">

          <div>
            <span>
              HISTORIQUE
            </span>

            <h2>
              📋 Mes paris
            </h2>
          </div>

          <div className="selection-count">
            {history.length}
          </div>

        </div>

        {history.length === 0 ? (

          <div className="empty-history">

            <span>
              📋
            </span>

            <strong>
              Aucun pari enregistré
            </strong>

            <p>
              Vos coupons validés
              apparaîtront ici.
            </p>

          </div>

        ) : (

          <div className="history-list">

            {history.map(
              (coupon) => (

                <article
                  key={coupon.id}
                  className="history-card"
                >

                  <div className="history-top">

                    <div>
                      <span>
                        CODE COUPON
                      </span>

                      <strong>
                        {coupon.code}
                      </strong>
                    </div>

                    <div className="pending-status">
                      🟡 En attente
                    </div>

                  </div>

                  <p className="history-date">
                    {coupon.createdAt}
                  </p>

                  <div className="history-selections">

                    {coupon.selections.map(
                      (selection) => (

                        <div
                          key={selection.id}
                        >

                          <span>
                            {selection.match}
                          </span>

                          <b>
                            {selection.odds.toFixed(
                              2
                            )}
                          </b>

                        </div>

                      )
                    )}

                  </div>

                  <div className="history-summary">

                    <div>
                      <small>
                        Cote
                      </small>

                      <strong>
                        {coupon.totalOdds.toFixed(
                          2
                        )}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Mise
                      </small>

                      <strong>
                        {formatMoney(
                          coupon.stake
                        )}{' '}
                        FCFA
                      </strong>
                    </div>

                    <div>
                      <small>
                        Gain potentiel
                      </small>

                      <strong>
                        {formatMoney(
                          coupon.potentialWin
                        )}{' '}
                        FCFA
                      </strong>
                    </div>

                  </div>

                  <div className="history-share">

                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            coupon.code
                          );

                          setMessage(
                            'Code copié !'
                          );
                        } catch {
                          setMessage(
                            `Code : ${coupon.code}`
                          );
                        }
                      }}
                    >
                      📋 {coupon.code}
                    </button>

                    <button
                      onClick={async () => {

                        const text =
                          `🎟️ Coupon GOALIX\n` +
                          `Code : ${coupon.code}\n` +
                          `Cote : ${coupon.totalOdds.toFixed(2)}`;

                        try {
                          if (
                            navigator.share
                          ) {
                            await navigator.share({
                              title:
                                'Coupon GOALIX',
                              text,
                            });
                          } else {
                            await navigator.clipboard.writeText(
                              text
                            );

                            setMessage(
                              'Message copié.'
                            );
                          }
                        } catch {
                          setMessage(
                            'Partage annulé.'
                          );
                        }

                      }}
                    >
                      📤 Partager
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {/* INFO */}
      <section className="bets-info">

        <span>
          🔐
        </span>

        <div>
          <strong>
            Vos paris
          </strong>

          <p>
            Cette version utilise un stockage
            local de démonstration. Le système
            sera connecté à votre compte GOALIX
            et à PostgreSQL dans une prochaine
            étape.
          </p>
        </div>

      </section>

      {/* FOOTER 
