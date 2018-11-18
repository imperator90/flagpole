
let fs = require('fs');
let exec = require('child_process').exec;
let path = require('path');

function printHeader() {
    console.log("\x1b[32m", "\n", `    \x1b[31m$$$$$$$$\\ $$\\                                         $$\\           
    \x1b[31m $$  _____|$$ |                                        $$ |          
    \x1b[31m $$ |      $$ | $$$$$$\\   $$$$$$\\   $$$$$$\\   $$$$$$\\  $$ | $$$$$$\\  
    \x1b[31m $$$$$\\    $$ | \\____$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ $$ |$$  __$$\\ 
    \x1b[37m $$  __|   $$ | $$$$$$$ |$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ |$$$$$$$$ |
    \x1b[37m $$ |      $$ |$$  __$$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$   ____|
    \x1b[37m $$ |      $$ |\\$$$$$$$ |\\$$$$$$$ |$$$$$$$  |\\$$$$$$  |$$ |\\$$$$$$$\\ 
    \x1b[34m \\__|      \\__| \\_______| \\____$$ |$$  ____/  \\______/ \\__| \\_______|
    \x1b[34m                         $$\\   $$ |$$ |                              
    \x1b[34m                         \\$$$$$$  |$$ |                              
    \x1b[34m                          \\______/ \\__|`, "\x1b[0m", "\n");
}

export class FlagpoleConfig {

    public configDir: string|undefined;
    public testsPath: string|undefined;
    public envBase: Array<{[s: string]: string;}> = [];

    public isValid(): boolean {
        return (typeof this.configDir !== 'undefined');
    }

}

export class TestSuiteFile {

    public rootTestsDir: string = '';
    public filePath: string = '';
    public fileName: string = '';
    public name: string = '';

    constructor(rootTestsDir: string, dir: string, file: string) {
        this.rootTestsDir = rootTestsDir;
        this.filePath = dir + file;
        this.fileName = file;
        this.name = dir.replace(this.rootTestsDir, '') + file.split('.').slice(0, -1).join('.');
    }

}

export class Tests {

    private testsFolder: string;
    private testSuiteStatus: { [s: string]: number|null; } = {};
    private suites: Array<TestSuiteFile> = [];

    constructor(testsFolder: string) {

        this.testsFolder = testsFolder = Cli.normalizePath(testsFolder);

        // Discover all test suites in the specified folder
        let me: Tests = this;
        this.suites = (function(): Array<TestSuiteFile> {

            let tests: Array<TestSuiteFile> = [];

            let findTests = function(dir: string, isSubFolder: boolean = false) {
                // Does this folder exist?
                if (fs.existsSync(dir)) {
                    // Read contents
                    let files = fs.readdirSync(dir);
                    files.forEach(function(file) {
                        // Drill into sub-folders, but only once!
                        if (!isSubFolder && fs.statSync(dir + file).isDirectory()) {
                            tests = findTests(dir + file + '/', true);
                        }
                        // Push in any JS files
                        else if (file.match(/.js$/)) {
                            tests.push(new TestSuiteFile(me.testsFolder, dir, file));
                        }
                    });
                }

                return tests;
            };

            return findTests(testsFolder);

        })();

    }

    private onTestStart(filePath: string) {
        this.testSuiteStatus[filePath] = null;
    };

    private onTestExit(filePath: string, exitCode: number) {
        let me: Tests = this;
        this.testSuiteStatus[filePath] = exitCode;
        // Are they all done?
        let areDone: boolean = Object.keys(this.testSuiteStatus).every(function(filePath: string) {
            return (me.testSuiteStatus[filePath] !== null);
        });
        let areAllPassing: boolean = Object.keys(this.testSuiteStatus).every(function(filePath: string) {
            return (me.testSuiteStatus[filePath] === 0);
        });
        if (areDone) {
            if (!areAllPassing) {
                Cli.log('Some suites failed.');
                Cli.log("\n");
            }
            Cli.exit(areAllPassing ? 0 : 1);
        }
    };

    /**
     * Find a test with this name in our list of available tests
     *
     * @param name: string
     * @returns {TestSuiteFile}
     */
    private getTestByName(name: string) {
        for (let i=0; i < this.suites.length; i++) {
            if (this.suites[i].name == name) {
                return this.suites[i];
            }
        }
    };

    /**
     *
     * @param {string} filePath
     */
    private runTestFile(filePath: string) {
        let me: Tests = this;
        this.onTestStart(filePath);

        let child = exec('node ' + filePath);

        child.stdout.on('data', function(data) {
            data && Cli.log(data);
        });

        child.stderr.on('data', function(data) {
            data && Cli.log(data);
        });

        child.on('error', function(data) {
            data && Cli.log(data);
        });

        child.on('exit', function(exitCode) {
            if (exitCode > 0) {
                Cli.log('FAILED TEST SUITE:');
                Cli.log(filePath + ' exited with error code ' + exitCode);
                Cli.log("\n");
            }
            me.onTestExit(filePath, exitCode);
        });

    };

    public foundTestSuites(): boolean {
        return (this.suites.length > 0);
    }

    public getSuiteNames(): Array<string> {
        let list: Array<string> = [];
        this.suites.forEach(function(test: TestSuiteFile) {
            list.push(test.name);
        });
        return list;
    }

    public getTestsFolder(): string {
        return this.testsFolder;
    }

    public runAll() {
        let me: Tests = this;
        // Loop through first and just add them to make sure we are tracking it (avoid race conditions)
        this.suites.forEach(function(test) {
            me.onTestStart(test.filePath);
        });
        this.suites.forEach(function(suite: TestSuiteFile) {
            me.runTestFile(suite.filePath);
        });
    }

    public getAnyTestSuitesNotFound(suiteNames: Array<string>): string|null {
        let suiteThatDoesNotExist: string|null = null;
        let me: Tests = this;
        suiteNames.every(function(suiteName) {
            if (typeof me.getTestByName(suiteName) !== 'undefined') {
                return true;
            }
            else {
                suiteThatDoesNotExist = suiteName;
                return false;
            }
        });
        return suiteThatDoesNotExist;
    }

    public filterTestSuitesByName(suiteNames: Array<string>) {
        // If filtered list was passed in, apply filter
        if (suiteNames.length > 0) {
            // First get all test suites that we found or error
            let filteredSuites: Array<TestSuiteFile> = [];
            let me: Tests = this;
            suiteNames.forEach(function(suiteName) {
                let testSuite: TestSuiteFile|undefined = me.getTestByName(suiteName);
                if (testSuite) {
                    filteredSuites.push(testSuite);
                }
                else {
                    Cli.log('Could not find test suite: ' + suiteName + "\n");
                    Cli.exit(3);
                }
            });
            me.suites = filteredSuites;
        }
    }

}


export class Cli {

    static consoleLog: Array<string> = [];

    static log(message: string) {
        if (typeof message !== 'undefined') {
            Cli.consoleLog.push(message.replace(/\n$/, ''));
        }
    }

    static list(list: Array<string>) {
        list.forEach(function(message: string) {
            Cli.log('  » ' + message);
        });
    }

    static exit(exitCode: number) {
        printHeader();
        Cli.consoleLog.forEach(function(message: string) {
            console.log(message);
        });
        process.exit(exitCode);
    };

    static normalizePath(path: string): string {
        if (path) {
            path = (path.match(/\/$/) ? path : path + '/');
        }
        return path;
    }

    static parseConfigFile(configPath: string): FlagpoleConfig {
        let config: FlagpoleConfig = new FlagpoleConfig();
        // Does path exist?
        if (configPath && fs.existsSync(configPath)) {
            // Read the file
            let configContent: string = fs.readFileSync(configPath);
            let configDir: string = Cli.normalizePath(path.dirname(configPath));
            let configData: any = JSON.parse(configContent) || {};
            // Remember the config folder
            config.configDir = configDir;
            // Path to tests specified, then grab that
            if (configData.hasOwnProperty('path')) {
                // If path is absolute
                if (/^\//.test(configData.path)) {
                    config.testsPath = Cli.normalizePath(configData.path);
                }
                // If path just says current directory
                else if (configData.path == '.') {
                    config.testsPath = Cli.normalizePath(configDir);
                }
                // Path is relative
                else {
                    config.testsPath = Cli.normalizePath(configDir + configData.path);
                }
            }
            // Look for base domain definition
            if (configData.hasOwnProperty('base')) {
                config.envBase = configData.base;
            }
            //console.log(config);
        }
        return config;
    }

}