import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Badge } from '../components/ui/badge';

import { getResult } from '../api/quizApi';

function ResultPage() {
  const { id } = useParams();

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['result', id],
    queryFn: () => getResult(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <p>Loading result...</p>;
  }

  if (isError || !result) {
    return (
      <p className="text-red-600">
        Unable to load result.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{result.quiz_title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold">
              {result.score} / {result.total_questions}
            </p>

            <p className="mt-2 text-muted-foreground">
              {result.percentage}%
            </p>

            <div className="mt-3">
              <Badge variant={result.passed ? 'default' : 'destructive'}>
                {result.passed ? 'Passed' : 'Failed'}
              </Badge>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Passing score: 60%
          </p>

          <div className="flex justify-center gap-3">
<Link
  to="/"
  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
>
  Back to Quizzes
</Link>

<Link
  to="/my-results"
  className="inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
>
  My Results
</Link>          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResultPage;