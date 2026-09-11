import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Badge } from '../components/ui/badge';

import { getMyResults } from '../api/quizApi';

function MyResultsPage() {
  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-results'],
    queryFn: getMyResults,
  });

  if (isLoading) {
    return <p>Loading results...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">
        Please log in to view your results.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Results</h1>
        <p className="mt-2 text-muted-foreground">
          View your previous quiz attempts.
        </p>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              You have no quiz results yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>{result.quiz_title}</CardTitle>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {result.score} / {result.total_questions}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {result.percentage}%
                  </p>
                </div>

                <Badge
                  variant={
                    result.passed ? 'default' : 'destructive'
                  }
                >
                  {result.passed ? 'Passed' : 'Failed'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResultsPage;