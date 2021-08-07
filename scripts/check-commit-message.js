const chalk = require('chalk');
const fs = require('fs');
const msg = fs
    .readFileSync(process.argv[2])
    .toString()
    .trim();

const commitRegex = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/;

if (!commitRegex.test(msg)) {
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
            chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
            `    ${chalk.green(`feat(user): add user service for registration`)}\n` +
            `    ${chalk.green(`fix(post): handle input validations (close #13)`)}\n\n` +
            chalk.red(
                `  You can also use ${chalk.cyan(
                    `yarn commit / npm run commit`,
                )} to interactively generate a commit message.\n`,
            ),
    );
    process.exit(1);
}
