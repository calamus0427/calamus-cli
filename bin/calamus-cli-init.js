#!/usr/bin/env node
const download = require('download-git-repo')  //用于下载远程仓库至本地 支持GitHub、GitLab、Bitbucket
const program = require('commander') //命令行处理工具
const exists = require('fs').existsSync  //node自带的fs模块下的existsSync方法，用于检测路径是否存在。（会阻塞）
const path = require('path') //node自带的path模块，用于拼接路径
const ora = require('ora') //用于命令行上的加载效果
const home = require('user-home')  //用于获取用户的根目录
const tildify = require('tildify') //将绝对路径转换成带波浪符的路径
const chalk = require('chalk')// 用于高亮终端打印出的信息
const inquirer = require('inquirer') //用于命令行与开发者交互
const rm = require('rimraf').sync // 相当于UNIX的“rm -rf”命令
const logger = require('../lib/logger') //自定义工具-用于日志打印
const generate = require('../lib/generate')  //自定义工具-用于基于模板构建项目
const checkVersion = require('../lib/check-version') //自定义工具-用于检测vue-cli版本的工具
const warnings = require('../lib/warnings') //自定义工具-用于模板的警告
const localPath = require('../lib/local-path') //自定义工具-用于路径的处理
const isLocalPath = localPath.isLocalPath  //判断是否是本地路径
const getTemplatePath = localPath.getTemplatePath  //获取本地模板的绝对路径

program.usage('<project-name>').parse(process.argv)

let template = program.args[0]//项目名称
const rawName = program.args[1]  //项目构建目录名
const inPlace = !rawName || rawName === '.'  // 没写或者“.”，表示当前目录下构建项目
const name = inPlace ? path.relative('../', process.cwd()) : rawName  //如果在当前目录下构建项目,当前目录名为项目构建目录名，否则是当前目录下的子目录【rawName】为项目构建目录名
const to = path.resolve(rawName || '.') //项目构建目录的绝对路径
const clone = program.clone || false  //是否采用clone模式，提供给“download-git-repo”的参数
const tmp = path.join(home, '.vue-templates', template.replace(/[\/:]/g, '-'))  //远程模板下载到本地的路径



if (inPlace || exists(to)) {
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace
        ? 'Generate project in current directory?'
        : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        run()
      }
    }).catch(logger.fatal)
  } else {
    run()
  }
  


function run(){
    //do something
    console.log('projectname',template,rawName)
}

/**
 * 定义下载模板并生产项目的函数 downloadAndGenerate
 */
function downloadAndGenerate(){

}