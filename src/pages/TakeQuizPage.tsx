import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

import {
  getQuiz,
  submitQuiz,
  type QuizAnswer,
} from '../api/quizApi';

function TakeQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => getQuiz(id!),
    enabled: Boolean(id),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitQuiz(id!, answers),
    onSuccess: (data) => {
      navigate(`/result/${data.attemptId}`);
    },
  });

  if (isLoading) {
    return <p>Loading quiz...</p>;
  }

  if (isError || !quiz) {
    return (
      <p className="text-red-600">
        Unable to load quiz.
      </p>
    );
  }

  function handleAnswer(questionId: number, choiceId: number) {
    setAnswers((currentAnswers) => {
      const existingAnswer = currentAnswers.find(
        (answer) => answer.questionId === questionId,
      );

      if (existingAnswer) {
        return currentAnswers.map((answer) =>
          answer.questionId === questionId
            ? { questionId, choiceId }
            : answer,
        );
      }

      return [...currentAnswers, { questionId, choiceId }];
    });
  }

  function getSelectedAnswer(questionId: number) {
    return answers.find(
      (answer) => answer.questionId === questionId,
    )?.choiceId.toString();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {quiz.description}
        </p>
      </div>

      {quiz.questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>
              Question {index + 1} of {quiz.questions.length}
            </CardTitle>

            <CardDescription>
              {question.question_text}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={getSelectedAnswer(question.id)}
              onValueChange={(value) =>
                handleAnswer(question.id, Number(value))
              }
            >
              {question.choices.map((choice) => (
                <div
                  key={choice.id}
                  className="flex items-center space-x-3 rounded-md border p-3"
                >
                  <RadioGroupItem
                    value={choice.id.toString()}
                    id={`choice-${choice.id}`}
                  />

                  <label
                    htmlFor={`choice-${choice.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {choice.choice_text}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {submitMutation.isError && (
        <p className="text-red-600">
          {submitMutation.error.message}
        </p>
      )}

      <Button
        className="w-full"
        onClick={() => submitMutation.mutate()}
        disabled={
          submitMutation.isPending ||
          answers.length !== quiz.questions.length
        }
      >
        {submitMutation.isPending
          ? 'Submitting...'
          : 'Submit Quiz'}
      </Button>
    </div>
  );
}

export default TakeQuizPage;