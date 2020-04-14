import stripIndent from "strip-indent";
import { migrate } from "./migrate";

function clean(code: string, eof = false): string {
  return stripIndent(code)
    .replace(/^\s+/g, "")
    .replace(/\s+$/g, eof ? "\n" : "");
}

function compare(
  filename: string,
  input: string,
  output: string,
  treatAsYaml?: boolean
) {
  const isYAML =
    typeof treatAsYaml === "boolean" ? treatAsYaml : !filename.endsWith("json");
  expect(migrate(clean(input, isYAML), filename)).toBe(clean(output, isYAML));
}

test("json - default", () => {
  compare(
    "foo.json",
    `
      {
        "schemaPath": "schema.graphql",
        "includes": [
          "*.graphql"
        ],
        "excludes": [
          "*.ts"
        ]
      }
    `,
    `
      {
        "schema": "schema.graphql",
        "include": [
          "*.graphql"
        ],
        "exclude": [
          "*.ts"
        ]
      }
    `
  );
});

test("json - projects", () => {
  compare(
    "foo.json",
    `
      {
        "projects": {
          "custom": {
            "schemaPath": "schema.graphql",
            "includes": [
              "*.graphql"
            ],
            "excludes": [
              "*.ts"
            ]
          }
        }
      }
    `,
    `
      {
        "projects": {
          "custom": {
            "schema": "schema.graphql",
            "include": [
              "*.graphql"
            ],
            "exclude": [
              "*.ts"
            ]
          }
        }
      }
  `
  );
});

test("yaml - default", () => {
  compare(
    "foo.yaml",
    `
      schemaPath: schema.graphql
      includes: 
        - "*.graphql"
      excludes:
        - "*.ts"
      `,
    `
      schema: schema.graphql
      include:
        - '*.graphql'
      exclude:
        - '*.ts'
    `
  );
});

test("yaml - projects", () => {
  compare(
    "foo.yaml",
    `
      projects:
        custom:
          schemaPath: schema.graphql
          includes:
            - "*.graphql"
          excludes:
            - "*.ts"
    `,
    `
      projects:
        custom:
          schema: schema.graphql
          include:
            - '*.graphql'
          exclude:
            - '*.ts'
    `
  );
});

test("yaml - extensions project", () => {
  compare(
    "foo.yaml",
    `
      projects:
        custom:
          schemaPath: schema.graphql
          includes:
            - "*.graphql"
          excludes:
            - "*.ts"
          extensions:
            foo:
              debug: true
    `,
    `
      projects:
        custom:
          extensions:
            foo:
              debug: true
          schema: schema.graphql
          include:
            - '*.graphql'
          exclude:
            - '*.ts'
    `
  );
});

test("no extension", () => {
  compare(
    "foo",
    `
      schemaPath: schema.graphql
    `,
    `
      schema: schema.graphql
    `,
    true
  );

  compare(
    "foo",
    `
      {
        "schemaPath": "schema.graphql"
      }
    `,
    `
      {
        "schema": "schema.graphql"
      }
    `,
    false
  );
});
