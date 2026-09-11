import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";

import {Button} from "../components/ui/button";

function QuizListPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Available Quizzes</h1>
                <p className="mt-2 text-muted-foreground">
                    Choose a quiz from the list below to test your knowledge and skills.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Sample Quiz</CardTitle>
                    <CardDescription>
                        This is a sample quiz to demonstrate the functionality of the online quiz application.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizListPage;