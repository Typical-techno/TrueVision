const createDefault = () : string[] => {
  const defaultMsgArr = [
    "<br>",
    "COMMAND NOT FOUND",
    "Type <span class='command'>'help'</span> to get started.",
    "Type <span class='command'>'file'</span> to get started with deepfake detection.",
    "<br>"
  ]  
  
  const defaultMsg : string[] = [];
  
  defaultMsgArr.forEach((ele) => {
    defaultMsg.push(ele);
  })

  return defaultMsg;
}

export const DEFAULT = createDefault();
