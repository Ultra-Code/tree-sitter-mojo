/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {RuleOrLiteral} rule
 *
 * @return {SeqRule}
 *
 */
function commaSep1(rule) {
  return sep1(rule, ",");
}

/**
 * Creates a rule to match one or more occurrences of `rule` separated by `sep`
 *
 * @param {RuleOrLiteral} rule
 *
 * @param {RuleOrLiteral} separator
 *
 * @return {SeqRule}
 *
 */
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

const SEMICOLON = ";";

module.exports = grammar({
  name: "mojo",
  //tokens to be scanned by scanner.c
  externals: ($) => [$._newline],
  rules: {
    module: ($) => repeat($._stmt),
    // GENERAL STATEMENTS
    _stmt: ($) => choice($._simple_stmts, $._compound_stmt),
    _simple_stmts: ($) =>
      seq(
        $._simple_stmt,
        repeat(seq(SEMICOLON, $._simple_stmt)),
        optional(SEMICOLON),
        $._newline,
      ),
    _simple_stmt: ($) =>
      choice(
        $.assignment,
        $.type_alias,
        $.star_expressions,
        $.return_stmt,
        $.import_stmt,
        $.raise_stmt,
        "pass",
        $.del_stmt,
        $.yield_stmt,
        $.assert_stmt,
        "break",
        "continue",
        $.global_stmt,
        $.nonlocal_stmt,
      ),
    // SIMPLE STATEMENTS
    _compound_stmt: ($) =>
      choice(
        $.function_def,
        $.if_stmt,
        $.class_def,
        $.with_stmt,
        $.for_stmt,
        $.try_stmt,
        $.while_stmt,
        $.match_stmt,
      ),
    function_def: ($) =>
      choice(seq($.decorators, $.function_def_raw), $.function_def_raw),
    function_def_raw: ($) =>
      choice(
        seq(
          "def",
          $.NAME,
          optional($.type_params),
          "(",
          optional($.params),
          ")",
          optional(seq("->", $.expression)),
          ":",
          optional($.func_type_comment),
          $.block,
        ),
        seq(
          $.ASYNC,
          "def",
          $.NAME,
          optional($.type_params),
          "(",
          optional($.params),
          ")",
          optional(seq("->", $.expression)),
          ":",
          optional($.func_type_comment),
          $.block,
        ),
      ),
    //Type parameter declaration
    type_params: ($) => seq("[", $._type_param_seq, "]"),
    _type_param_seq: ($) => seq(",", repeat1($.type_param), optional(",")),
    type_param: ($) =>
      choice(
        seq($.NAME, optional($._type_param_bound)),
        seq("*", $.NAME),
        seq("**", $.NAME),
      ),
    _type_param_bound: ($) => seq(":", $.expression),
  },
});
