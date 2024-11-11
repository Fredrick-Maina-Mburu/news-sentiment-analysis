import vader from 'vader-sentiment';

export const analyzeSentiment = (text: string) => {
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  const score = intensity.compound;
  let sentiment: 'positive' | 'neutral' | 'negative';

  if (score >= 0.05) sentiment = 'positive';
  else if (score <= -0.05) sentiment = 'negative';
  else sentiment = 'neutral';

  return { sentiment, score };
};
