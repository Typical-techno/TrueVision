import command from "../config.json" assert { type: "json" };
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about";
import { DEFAULT } from "./commands/default";
import { file } from "./commands/file";

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0;
let tempInput = "";
let userInput: string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;

//WRITELINESCOPY is used to during the "clear" command
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById(
  "password-field"
) as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const PROMPT = document.getElementById("prompt");
const COMMANDS = ["help", "about", "file", "banner", "clear"];
const HISTORY: string[] = [];
const SUDO_PASSWORD = command.password;

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if (!MAIN) return;

  MAIN.scrollTop = MAIN.scrollHeight;
};

function userInputHandler(e: KeyboardEvent) {
  const key = e.key;

  switch (key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }

      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return;
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;

  if (bareMode) {
    newUserInput = userInput;
  } else {
    newUserInput = `<span class='output'>${userInput}</span>`;
  }

  HISTORY.push(userInput);
  historyIdx = HISTORY.length;

  //if clear then early return
  if (userInput === "clear") {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return;
  }

  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
    commandHandler(userInput.toLowerCase().trim());
  }

  USERINPUT.value = resetInput;
  userInput = resetInput;
}

function tabKey() {
  let currInput = USERINPUT.value;

  for (const ele of COMMANDS) {
    if (ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return;
    }
  }
}

function arrowKeys(e: string) {
  switch (e) {
    case "ArrowDown":
      if (historyIdx !== HISTORY.length) {
        historyIdx += 1;
        USERINPUT.value = HISTORY[historyIdx];
        if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;
      }
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

async function commandHandler(input: string) {
  if (input.startsWith("rm -rf") && input.trim() !== "rm -rf") {
    if (isSudo) {
      if (input === "rm -rf src" && !bareMode) {
        bareMode = true;

        setTimeout(() => {
          if (!TERMINAL || !WRITELINESCOPY) return;
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });

        easterEggStyles();
        setTimeout(() => {
          writeLines(["What made you think that was a good idea?", "<br>"]);
        }, 200);

        setTimeout(() => {
          writeLines(["Now everything is ruined.", "<br>"]);
        }, 1200);
      } else if (input === "rm -rf src" && bareMode) {
        writeLines(["there's no more src folder.", "<br>"]);
      } else {
        if (bareMode) {
          writeLines(["What else are you trying to delete?", "<br>"]);
        } else {
          writeLines([
            "<br>",
            "Directory not found.",
            "type <span class='command'>'ls'</span> for a list of directories.",
            "<br>",
          ]);
        }
      }
    } else {
      writeLines(["Permission not granted.", "<br>"]);
    }
    return;
  }
  if (input === "file") {
    await handleFileCommand();
    return; // Ensure no further command processing occurs
  }

  switch (input) {
    case "clear":
      setTimeout(() => {
        if (!TERMINAL || !WRITELINESCOPY) return;
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      });
      break;
    case "banner":
      if (bareMode) {
        writeLines(["TrueVisioin v1.0.0", "<br>"]);
        break;
      }
      writeLines(BANNER);
      break;
    case "help":
      if (bareMode) {
        writeLines(["maybe restarting your browser will fix this.", "<br>"]);
        break;
      }
      writeLines(HELP);
      break;
    case "file":
      if (bareMode) {
        writeLines([`${command.username}`, "<br>"]);
        break;
      }
      break;
    case "about":
      if (bareMode) {
        writeLines(["Nothing to see here.", "<br>"]);
        break;
      }
      writeLines(ABOUT);
      break;
    case "linkedin":
      //add stuff here
      break;
    case "github":
      //add stuff here
      break;
    case "email":
      //add stuff here
      break;
    case "rm -rf":
      if (bareMode) {
        writeLines(["don't try again.", "<br>"]);
        break;
      }

      if (isSudo) {
        writeLines([
          "Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>",
          "<br>",
        ]);
      } else {
        writeLines(["Permission not granted.", "<br>"]);
      }
      break;
    case "sudo":
      if (bareMode) {
        writeLines(["no.", "<br>"]);
        break;
      }
      if (!PASSWORD) return;
      isPasswordInput = true;
      USERINPUT.disabled = true;

      if (INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => {
        PASSWORD_INPUT.focus();
      }, 100);

      break;
    case "ls":
      if (bareMode) {
        writeLines(["", "<br>"]);
        break;
      }

      if (isSudo) {
        writeLines(["src", "<br>"]);
      } else {
        writeLines(["Permission not granted.", "<br>"]);
      }
      break;
    default:
      if (bareMode) {
        writeLines(["type 'help'", "<br>"]);
        break;
      }

      writeLines(DEFAULT);
      break;
  }
}

function writeLines(message: string[]) {
  message.forEach((item, idx) => {
    displayText(item, idx);
  });
}

function displayText(item: string, idx: number) {
  setTimeout(() => {
    if (!mutWriteLines) return;
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

function revertPasswordChanges() {
  if (!INPUT_HIDDEN || !PASSWORD) return;
  PASSWORD_INPUT.value = "";
  USERINPUT.disabled = false;
  INPUT_HIDDEN.style.display = "block";
  PASSWORD.style.display = "none";
  isPasswordInput = false;

  setTimeout(() => {
    USERINPUT.focus();
  }, 200);
}

function passwordHandler() {
  if (passwordCounter === 2) {
    if (!INPUT_HIDDEN || !mutWriteLines || !PASSWORD) return;
    writeLines([
      "<br>",
      "INCORRECT PASSWORD.",
      "PERMISSION NOT GRANTED.",
      "<br>",
    ]);
    revertPasswordChanges();
    passwordCounter = 0;
    return;
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return;
    writeLines([
      "<br>",
      "PERMISSION GRANTED.",
      "Try <span class='command'>'rm -rf'</span>",
      "<br>",
    ]);
    revertPasswordChanges();
    isSudo = true;
    return;
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

function easterEggStyles() {
  const bars = document.getElementById("bars");
  const body = document.body;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");

  if (!bars) return;
  bars.innerHTML = "";
  bars.remove();

  if (main) main.style.border = "none";

  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";

  for (let i = 0; i < span.length; i++) {
    span[i].style.color = "white";
  }

  USERINPUT.style.backgroundColor = "black";
  USERINPUT.style.color = "white";
  USERINPUT.style.fontFamily = "VT323, monospace";
  USERINPUT.style.fontSize = "20px";
  if (PROMPT) PROMPT.style.color = "white";
}

const initEventListeners = () => {
  if (HOST) {
    HOST.innerText = command.hostname;
  }

  if (USER) {
    USER.innerText = command.username;
  }

  if (PRE_HOST) {
    PRE_HOST.innerText = command.hostname;
  }

  if (PRE_USER) {
    PRE_USER.innerText = command.username;
  }

  window.addEventListener("load", () => {
    writeLines(BANNER);
  });

  USERINPUT.addEventListener("keypress", userInputHandler);
  USERINPUT.addEventListener("keydown", userInputHandler);
  PASSWORD_INPUT.addEventListener("keypress", userInputHandler);

  window.addEventListener("click", () => {
    USERINPUT.focus();
  });
};

initEventListeners();

async function handleFileUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        "https://api.deepfake-detect.com/v1/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const responseData = await response.json();

      // Update the text content of the target element with the file name
      const fileNameDisplay = document.getElementById("file-name-display");
      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }

      // Return both the API response data and the file name
      return { responseData, fileName: file.name };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { responseData: null, fileName: "" }; // Handle errors appropriately
    }
  }

  return { responseData: null, fileName: "" };
}

async function handleFileCommand() {
  writeLines(file());
  await new Promise((resolve) => setTimeout(resolve, 100)); // Delay to ensure DOM updates
  const fileUpload = document.getElementById("file-upload") as HTMLInputElement;
  
  if (fileUpload) {
    fileUpload.click();
    
    try {
      const { responseData, fileName } = await new Promise<any>((resolve, reject) => {
        fileUpload.addEventListener(
          "change",
          async (event) => {
            try {
              const response = await handleFileUpload(event);
              if (response && response.responseData) {
                resolve(response);
              } else {
                reject(new Error("Failed to upload file"));
              }
            } catch (error) {
              reject(error);
            }
          },
          { once: true }
        );
      });

      if (responseData && responseData.pred) {
        await simulateProcessing(); // Simulate the processing steps
        writeLines([
          `Your uploaded file is ${formatPrediction(responseData.pred)} Original`,
          "<br>",
        ]);
        writeLines(["Process complete.", "<br>"]);
      } else {
        writeLines(["Prediction not available.", "<br>"]);
      }

    } catch (error) {
      console.error(error);
      writeLines(["Error uploading file.", "<br>"]);
    }
  }

  // await loadResultPage();
}

function formatPrediction(pred: number): string {
  // Format prediction to display as percentage
  const percentage = (pred * 100).toFixed(2);
  return `${percentage}%`;
}

async function simulateProcessing() {
  const processMessages = [
    "Uploading Content...",
    "Analyzing Content...",
    "Retrieving AI models...",
    "Loading deep learning frameworks...",
    "Setting up neural networks...",
    "Applying convolutional layers...",
    "Detecting faces...",
    "Comparing with deepfake database...",
    "Generating heatmap...",
    "Validating authenticity...",
    "Finalizing analysis wait...",
  ];

  for (let i = 0; i < processMessages.length; i++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        writeLines([processMessages[i], "<br>"]);
        resolve(null);
      }, 1000); // Delay each message by 1 second
    });
  }
}

// Ensure the handleFileUpload function is available globally
(window as any).handleFileUpload = handleFileUpload;
