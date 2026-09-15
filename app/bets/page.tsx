use client';

import { useMemo, useState } from 'react';

type Selection = {
  id: string;
  match: string;
  league: string;
  choice: string;
  odds: number;
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

export default function BetsPage() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState('');

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;

    return selections.reduce(
      (total, selection) => total * selection.odds,
      1
    );
  }, [selections]);

  const potentialWin = useMemo(() => {
    const amount = Number(stake);

    if (!amount || totalOdds === 0) return 0;

    return amount * totalOdds;
  }, [stake, totalOdds]);

  function addSelection(selection: Selection) {
    setSelections((current) => {
      if (current.some((item) => item.id === selection.id)) {
        return current;
      }

      return [...current, selection];
    });
  }

  function removeSelection(id: string) {
    setSelections((current) =>
      current.filter((selection) => selection.id !== id)
    );
  }

