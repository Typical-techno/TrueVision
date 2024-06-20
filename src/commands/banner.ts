import command from '../../config.json' assert {type: 'json'};

const createBanner = () : string[] => {
  const banner : string[] = [];
  banner.push("<br>");

  command.ascii.forEach((ele) => {
    let asciiLine = "";
    // this is for the ascii art
    for (let i = 0; i < ele.length; i++) {
      if (ele[i] === " ") {
        asciiLine += "&nbsp;";
      } else {
        asciiLine += ele[i];
      }
    }

    // Wrap the ASCII line in the marquee structure
    let asciiMarquee = `<div class="marquee"><span><pre>${asciiLine}</pre></span></div>`;
    banner.push(asciiMarquee);
  });

  banner.push("<br>");
  banner.push("Welcome to TrueVision v1.0.0");
  banner.push("Type <span class='command'>'help'</span> for a list of all available commands.");
  banner.push("Type <span class='command'>'file'</span> to get started with deepfake detection.");
  banner.push("<br>");
  return banner;
}

export const BANNER = createBanner();
