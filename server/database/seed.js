const db = require('./database');

const quizzes = [
    {
        title: 'JavaScript Basics',
        description: 'Test your knowledge of JavaScript fundamentals.',
        questions: [
            {
                text: 'What is the output of `typeof null` in JavaScript?',
                choices: [
                    [ 'object', 1 ],
                    [ 'null', 0 ],
                    [ 'undefined', 0 ],
                    [ 'number', 0 ],
                ],
            },
            { 
                text: 'Which of the following is NOT a JavaScript data type?',
                choices: [
                    [ 'String', 0 ],
                    [ 'Boolean', 0 ],
                    [ 'Float', 1 ],
                    [ 'Object', 0  ],
                ],
            },
        { 
            text: 'Which method is used to add an element at the end of an array in JavaScript?',
            choices: [
                [ 'push()', 1 ],
                [ 'pop()', 0 ],
                [ 'shift()', 0 ],
                [ 'unshift()', 0 ],
            ],
        }, 
        {
            text: 'What is the correct syntax to create a function in JavaScript?',
            choices: [
                [ 'function myFunction() {}', 1 ],
                [ 'def myFunction() {}', 0 ],
                [ 'function:myFunction() {}', 0 ],
            ],
        },
        {
            text: 'Which of the following is NOT a valid way to declare a variable in JavaScript?',
            choices: [
                [ 'var myVar;', 0 ],
                [ 'let myVar;', 0 ],
                [ 'const myVar;', 0 ],
                [ 'variable myVar;', 1 ],
            ],
        },
    ],
    },
        
    {
        title: 'HTML & CSS',
        description: 'Test your knowledge of HTML and CSS fundamentals.',
        questions: [
            {
                text: 'Which HTML tag is used to define an internal style sheet?',
                choices: [
                    [ '<script>', 0 ],
                    [ '<css>', 0 ],
                    [ '<style>', 1 ],
                    [ '<font>', 0 ],
                ],
            },
        {
            text: 'Which CSS property is used to change the text color of an element?',
            choices: [
                [ 'font-color', 0 ],
                [ 'color', 1 ],
                [ 'text-color', 0 ],
                [ 'background-color', 0 ],
            ],
        },
        {
            text: 'Which HTML attribute is used to define inline styles?',
            choices: [  
                [ 'style', 1 ],
                [ 'class', 0 ],
                [ 'id', 0 ],
                [ 'css', 0 ],
            ],
        },
        {
            text: 'Which CSS property is used to control the spacing between lines of text?',
            choices: [
                [ 'line-height', 1 ],
                [ 'letter-spacing', 0 ],
                [ 'word-spacing', 0 ],
                [ 'text-indent', 0 ],
            ],
        },
        {
            text: 'Which HTML tag is used to create a hyperlink?',
            choices: [
                [ '<a>', 1 ],
                [ '<link>', 0 ],
                [ '<href>', 0 ],    
                [ '<url>', 0 ],
            ],
        },
    ],
},
        {
            title: 'Which CSS property is used to change the background color of an element?',
            description: 'Test your knowledge of CSS properties.',
            questions: [
                {
                    text: 'Which CSS property is used to change the background color of an element?',
                    choices: [
                        [ 'background-color', 1 ],
                        [ 'color', 0 ],
                        [ 'bg-color', 0 ],
                        [ 'background', 0 ],
                    ],
                },        
        {
            text: 'Which HTML tag is used to define a table row?',
            choices: [
                [ '<tr>', 1 ],
                [ '<td>', 0 ],
                [ '<th>', 0 ],
                [ '<table>', 0 ],
            ],
        },
        {
            text: 'Which CSS property is used to control the visibility of an element?',
            choices: [
                [ 'visibility', 1 ],    
                [ 'display', 0 ],
                [ 'opacity', 0 ],
                [ 'hidden', 0 ],
            ],
        },
        {
            text: 'Which HTML tag is used to define a table header cell?',
            choices: [
                [ '<th>', 1 ],
                [ '<td>', 0 ],
                [ '<tr>', 0 ],
                [ '<table>', 0 ],
            ],
        },
        {
            text: 'Which CSS property is used to control the font size of an element?',
            choices: [
                [ 'font-size', 1 ],
                [ 'text-size', 0 ],
                [ 'size', 0 ],
                [ 'font', 0 ],
            ],
        }
    ],
},
        {
            title: 'Which HTML tag is used to define a table header cell?',
            description: 'Test your knowledge of HTML and CSS fundamentals.',
            questions: [
                {
                    text: 'Which HTML tag is used to define a table header cell?',
                    choices: [
                        [ '<th>', 1 ],
                        [ '<td>', 0 ],
                        [ '<tr>', 0 ],
                        [ '<table>', 0 ],
                    ],
                },
                {
                    text: 'Which CSS property is used to control the font size of an element?',
                    choices: [
                        [ 'font-size', 1 ],
                        [ 'text-size', 0 ],
                        [ 'size', 0 ],
                        [ 'font', 0 ],
                    ],
                },
                {
                    text: 'Which HTML tag is used to define a table row?',
                    choices: [
                        [ '<tr>', 1 ],
                        [ '<td>', 0 ],
                        [ '<th>', 0 ],
                        [ '<table>', 0 ],
                    ],
                },
                {
                    text: 'Which CSS property is used to control the visibility of an element?',
                    choices: [
                        [ 'visibility', 1 ],
                        [ 'display', 0 ],
                        [ 'opacity', 0 ],
                        [ 'hidden', 0 ],
                    ],
                },  
                {
                    text: 'Which CSS property is used to change the background color of an element?',
                    choices: [
                        [ 'background-color', 1 ],
                        [ 'color', 0 ],
                        [ 'bg-color', 0 ],
                        [ 'background', 0 ],
                    ],  
                },
            ],
        },
    ];



const insertQuiz = db.prepare(`
    INSERT INTO quizzes (title, description) VALUES (?, ?)
`);

const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)
`);

const insertChoice = db.prepare(`
    INSERT INTO choices (question_id, choice_text, is_correct) VALUES (?, ?, ?)
`);

const seed = db.transaction(() => {
    const existing = db.prepare('SELECT COUNT(*) AS count FROM quizzes').get();
    if (existing.count > 0) {
        console.log('Database already seeded. Skipping seeding process.');
        return;
    }

        for (const quiz of quizzes) {
            const quizResult = insertQuiz.run(quiz.title, quiz.description);
            const quizId = quizResult.lastInsertRowid;

            for (const question of quiz.questions) {
                const questionResult = insertQuestion.run(quizId, question.text);
                const questionId = questionResult.lastInsertRowid;
            

            for (const choice of question.choices) {
                insertChoice.run(questionId, choice[0], choice[1]);
            }
        }
    }
});

seed();

console.log('Database seeded successfully.');

db.close();