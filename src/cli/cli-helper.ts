import { FlagpoleExecution } from "../flagpoleexecutionoptions";
import prompts = require("prompts");

const ansiAlign = require("ansi-align");

export function printHeader() {
  if (FlagpoleExecution.opts.quietMode) {
    return;
  }
  console.log("\u001b[0m \u001b[37m^\u001b[0m ");
  console.log(
    "\u001b[0m \u001b[47m \u001b[0m \u001b[44m\u001b[37m ****** \u001b[41m                 \u001b[0m\u001b[37;1m\u001b[1m   F L A G P O L E   J S"
  );
  console.log(
    "\u001b[0m \u001b[47m \u001b[0m \u001b[44m\u001b[37m ****** \u001b[47m                 \u001b[0m"
  );
  console.log(
    "\u001b[0m \u001b[47m \u001b[0m \u001b[44m\u001b[37m ****** \u001b[41m                 \u001b[0m\u001b[238m   Version 2.2"
  );
  console.log(
    "\u001b[0m \u001b[47m \u001b[0m \u001b[47m                         \u001b[0m"
  );
  console.log(
    "\u001b[0m \u001b[47m \u001b[0m \u001b[41m                         \u001b[0m"
  );
  console.log("\u001b[0m \u001b[47m \u001b[0m ");
}

export function printOldHeader() {
  if (FlagpoleExecution.opts.quietMode) {
    return;
  }
  console.log(
    "\x1b[32m",
    `
        \x1b[31m $$$$$$$$\\ $$\\                                         $$\\           
        \x1b[31m $$  _____|$$ |                                        $$ |          
        \x1b[31m $$ |      $$ | $$$$$$\\   $$$$$$\\   $$$$$$\\   $$$$$$\\  $$ | $$$$$$\\  
        \x1b[31m $$$$$\\    $$ | \\____$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ $$ |$$  __$$\\ 
        \x1b[37m $$  __|   $$ | $$$$$$$ |$$ /  $$ |$$ /  $$ |$$ /  $$ |$$ |$$$$$$$$ |
        \x1b[37m $$ |      $$ |$$  __$$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$   ____|
        \x1b[37m $$ |      $$ |\\$$$$$$$ |\\$$$$$$$ |$$$$$$$  |\\$$$$$$  |$$ |\\$$$$$$$\\ 
        \x1b[34m \\__|      \\__| \\_______| \\____$$ |$$  ____/  \\______/ \\__| \\_______|
        \x1b[34m                         $$\\   $$ |$$ |                              
        \x1b[34m                         \\$$$$$$  |$$ |                              
        \x1b[34m                          \\______/ \\__|`,
    "\x1b[0m",
    "\n"
  );
}

export function printSubheader(heading: string) {
  if (!FlagpoleExecution.opts.quietMode) {
    console.log(
      ansiAlign.center(
        "\x1b[31m===========================================================================\x1b[0m\n" +
          "\x1b[0m" +
          heading +
          "\n" +
          "\x1b[31m===========================================================================\x1b[0m\n"
      )
    );
  }
}

export function printLine(...messages: string[]) {
  if (!FlagpoleExecution.opts.quietMode) {
    messages.forEach((message) => {
      console.log(message);
    });
  }
}

export function trimInput(input) {
  return input.trim();
}

export function stringArrayToPromptChoices(arr: string[]): prompts.Choice[] {
  const out: prompts.Choice[] = [];
  arr.forEach((item) => {
    out.push({ title: item, value: item });
  });
  return out;
}

export function promptTextName(
  name: string,
  message: string,
  initial?: string
): prompts.PromptObject<string> {
  return {
    type: "text",
    name: name,
    message: message,
    initial: initial || "",
    format: trimInput,
    validate: (input: string) => {
      return /^[a-z0-9][a-z0-9/\/_-]{1,62}[a-z0-9]$/i.test(input);
    },
  };
}

export function promptTextDescription(
  name: string,
  message: string,
  initial?: string
): prompts.PromptObject<string> {
  return {
    type: "text",
    name: name,
    message: message,
    initial: initial || "",
    format: trimInput,
  };
}

export function promptSelect(
  name: string,
  message: string,
  choices: prompts.Choice[],
  required: boolean = false,
  initial?: string | number
): prompts.PromptObject<string> {
  const obj: prompts.PromptObject<string> = {
    type: "select",
    name: name,
    message: message,
    choices: choices,
  };
  if (required) {
    obj.validate = (input: string) => {
      return input.length > 0;
    };
  }
  if (initial !== undefined) {
    obj.initial = initial || 0;
  }
  return obj;
}

export function promptList(
  name: string,
  message: string
): prompts.PromptObject<string> {
  return {
    type: "text",
    name: name,
    message: message,
    initial: "",
    validate: function (input) {
      return /^[A-Z0-9 -_]*$/i.test(input);
    },
  };
}
