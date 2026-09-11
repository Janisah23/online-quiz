import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Input } from '../components/ui/input';

import { getQuizzes } from '../api/quizApi';
import { useQuizStore } from '../store/quizStore';

function QuizListPage() {
  const searchTerm = useQuizStore((state) => state.searchTerm);
  const setSearchTerm = useQuizStore((state) => state.setSearchTerm);

  const {
    data: quizzes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzes,
  });

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <p>Loading quizzes...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">
        Unable to load quizzes. Make sure the backend is running.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Quizzes</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a quiz to test your knowledge.
        </p>
      </div>

      <Input
        placeholder="Search quizzes..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {filteredQuizzes.length === 0 ? (
        <p className="text-muted-foreground">
          No quizzes found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>
                  {quiz.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Link
  to={`/quiz/${quiz.id}`}
  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
>
  Start Quiz
</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizListPage;