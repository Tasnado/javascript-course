
$(document).ready(function(){
    // store all quizzes in an array
    const quizQuestions = [
        {
            question: "What is illegal on the German Autobhan?",
            answers: ["Chewing Gum", "Running out of gas", "Talking to animals", "Having a backseat driver"],
            correct: "Running out of gas"
        },
        {
            question: "How many bones are in the adult human body?",
            answers: ["294", "25", "206", "314"],
            correct: "206"
        },
        {
            question: "What is the biggest planet in our solar system?",
            answers: ["Saturn", "Earth", "Neptune", "Jupiter"],
            correct: "Jupiter"
        },
        {
            question: "What is the study of mushrooms called?",
            answers: ["Mycology", "Microbiology", "Mushroomology", "Botany"],
            correct: "Mycology"
        },
        {
            question: "What is the slogan of Oshawa, Ontaio?",
            answers: ["Diversity Our Strength", "Activate Life", "Prepare to be Amazed", "Leading Today for Tomorrow"],
            correct: "Prepare to be Amazed"
        },
        {
            question: "What mythological creature was half eagle half lion?",
            answers: ["Centaur", "Sphinx", "Faun", "Griffin"],
            correct: "Griffin"
        }
    ];
    
    // global variables
    let quizNumber = 0;
    let counter = 0;
    
    // hide everything except for the start button
    $('.quizQuestions').hide();
    $('#restart').hide();
    $('.end').hide();


    // click the start button to start the quiz
    $('#start').on('click', function(){
        // display the first questions and answers
        $('.quizQuestions').show();
        $('#start').hide();
        displayQuestion();
    });


    $('#restart').on('click', function() {
        $('#restart').hide();
        $('h1').show();
        $('.end').hide();
        quizNumber = 0;
        counter = 0;
        $('.counter').text(counter);
        $('.quizQuestions').show();
        displayQuestion();
    });


    function displayQuestion() {
        // declare variables
        let questionNumber = quizQuestions[quizNumber];
        let answer;
        let answerPrint;

        if (quizNumber < quizQuestions.length - 1) {
            // display the question
            $('.question').text(questionNumber.question);
    
            //loop the answer display
            for (n = 0; n < 4; n++) {
                answer = questionNumber.answers[n];
                answerPrint = `
                <button class="answerButton">
                    ${answer}
                </button>
                `;
    
                $('.answers').append(answerPrint);
            }

        } else {
            endGame();
        }
    }


    $('.answers').on('click', 'button', function(event) {
        let userAns = $(this).text();
        let clickedAns = $.trim(userAns);

        $('.answerButton').remove();
        newQuestions(clickedAns);
    });



    function newQuestions(clickedAns) {
        let correctAnswer = quizQuestions[quizNumber].correct;

        $('.answerButton').remove();

        if (clickedAns == correctAnswer) {
            counter++;
            $('.counter').text(counter);
        }

        quizNumber++;
        displayQuestion();
    }

    function endGame() {
        $('.quizQuestions').hide();
        $('#restart').show();
        $('h1').hide();
        $('.end').show();
    }
});
