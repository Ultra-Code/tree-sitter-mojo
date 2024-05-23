module.exports = grammar({
  name: 'mojo',
  rules: {
    source_file: $ => 'hello',
    _statements: repeat1($._statement),
    _statement: choice($._compound_stmt,$._simple_stmt)
  }
});

