export interface SpreadPosition {
  id: string;
  name: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  positionIndex: number;
  isReversed: boolean;
}

export type SpreadType = 'single' | 'past-present-future' | 'five-elements';
