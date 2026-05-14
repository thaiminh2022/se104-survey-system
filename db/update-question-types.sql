truncate table answers restart identity cascade;
truncate table submissions restart identity cascade;
truncate table questions restart identity cascade;
truncate table sections restart identity cascade;
truncate table surveys restart identity cascade;

alter table questions
drop constraint if exists questions_question_type_check;

alter table questions
add constraint questions_question_type_check
check (
  question_type in (
    'single-choice',
    'multiple-choice',
    'rating-scale',
    'likert-scale',
    'short-text',
    'long-text',
    'dropdown',
    'yes-no',
    'matrix',
    'ranking',
    'date-time',
    'consent',
    'number'
  )
);
