import program from 'commander'; //子命令
import execa from 'execa'; //cli中调用外部命令
import inquirer from 'inquirer'; //询问
import ora from 'ora'; //终端加载效果
import Listr from 'listr'; //步骤
import chalk from 'chalk';　//高亮终端打印出来的信息
import boxen from 'boxen'; //加边框
import updateNotifier from 'update-notifier'; //update okg
import pkg from '../package.json';
import logSymbols from 'log-symbols'; // 打印日志的特殊标志

function checkVersion() {
    const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
    if (notifier.update) {
      notifier.notify();
    }
}

export function cli(args) {
    checkVersion();
    //version
    program.version(pkg.version, '-v, --version,').usage('<command> [options]');
    //init 
    //vue
    program.version(pkg.version)
      .usage('<command> [options]') 
      .command('init', 'init')
      .command('vue', 'vue') ;
    // .parse(process.argv) ;

    program.on('--help', () => {
      console.log('  Examples:')
      console.log()
      console.log(chalk.gray('    # create a new project with an official template'))
      console.log('    $ calamus-cli init webpack my-project')
      console.log()
      console.log(chalk.gray('    # create a new project straight from a github template'))
      console.log('    $ calamus-cli init username/repo my-project')
      console.log()
    })

    //子命令
    program
        .command('start <food>')
        .option('-f, --fruit <name>', 'Fruit to be added')
        .description('Start cooking food')
        .action(function(food, option) {
            console.log(`run start command`);
            console.log(`argument: ${food}`);
            console.log(`option: fruit = ${option.fruit}`);
        });

    //TODO:调用这个有问题
    program
        .command('npm-version')
        .description('Display npm version')
        .action(async function() {
          const { stdout } = await execa('vue -V').then((res)=>{
            console.log('Npm version:',res);
          }).catch(error =>{
              console.log('error',error)
          });
        });
    
    program
        .command('ask')
        .description('Ask some questions')
        .action(async function(option) {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'What is your name?'
            },
            {
              type: 'confirm',
              name: 'isAdult',
              message: 'Are you over 18 years old?'
            },
            {
              type: 'checkbox',
              name: 'favoriteFrameworks',
              choices: ['Vue', 'React', 'Angular'],
              message: 'What are you favorite frameworks?'
            },
            {
              type: 'list',
              name: 'favoriteLanguage',
              choices: ['Chinese', 'English', 'Japanese'],
              message: 'What is you favorite language?'
            }
          ]);
          
          console.log(boxen(chalk.yellow(logSymbols.success + 'your answers:' ), { padding: 1 }) , '\n', answers);
        });

    program
        .command('wait')
        .description('Wait 5 secords')
        .action(async function(option) {
          const spinner = ora('Waiting 5 seconds').start();
          let count = 5;
          
          await new Promise(resolve => {
            let interval = setInterval(() => {
              if (count <= 0) {
                clearInterval(interval);
                spinner.stop();
                resolve();
              } else {
                count--;
                spinner.text = `Waiting ${count} seconds`;
              }
            }, 1000);
          });
        });


    program
        .command('steps')
        .description('some steps')
        .action(async function(option) {
          const tasks = new Listr([
            {
              title: 'Run step 1',
              task: () =>
                new Promise(resolve => {
                  setTimeout(() => resolve('1 Done'), 1000);
                })
            },
            {
              title: 'Run step 2',
              task: () =>
                new Promise((resolve) => {
                  setTimeout(() => resolve('2 Done'), 1000);
                })
            },
            {
              title: 'Run step 3',
              task: () =>
                new Promise((resolve, reject) => {
                  setTimeout(() => reject(new Error('Oh, my god')), 1000);
                })
            }
          ]);
    
          await tasks.run().catch(err => {
            console.error(err);
          });
        });
        
    program.parse(args);
}