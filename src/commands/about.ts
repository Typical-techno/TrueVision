import command from "../../config.json" assert { type: "json" };

const createAbout = () => {
  const about = [];
  const SPACE = "&nbsp;";

  const CONTRIBUTION = "Contribution";
  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";

  about.push("<br>");
  about.push(command.aboutGreeting);
  about.push("<br>");

  command.social.forEach((member) => {
    let contribution = `<i class='fa-solid fa-briefcase' style="padding: 0px 10px 0px 0px;"></i> ${CONTRIBUTION}`;
    let email = `<i class='fa-solid fa-envelope' style="padding: 0px 10px 0px 0px;"></i> ${EMAIL}`;
    let github = `<i class='fa-brands fa-github' style="padding: 0px 10px 0px 0px;"></i> ${GITHUB}`;
    let linkedin = `<i class='fa-brands fa-linkedin' style="padding: 0px 10px 0px 0px;"></i> ${LINKEDIN}`;
    let string = "";

    string += SPACE.repeat(2);
    string += email;
    string += SPACE.repeat(17 - EMAIL.length);
    string += `<a target='_blank' style="color: yellow;" href='mailto:${member.email}'>${member.email}</a>`;
    about.push(string);

    string = "";
    string += SPACE.repeat(2);
    string += github;
    string += SPACE.repeat(17 - GITHUB.length);
    string += `<a target='_blank' style="color: yellow;"  href='https://github.com/${member.github}'>github/${member.github}</a>`;
    about.push(string);

    string = "";
    string += SPACE.repeat(2);
    string += linkedin;
    string += SPACE.repeat(17 - LINKEDIN.length);
    string += `<a target='_blank' style="color: yellow;"  href='https://www.linkedin.com/in/${member.linkedin}'>linkedin/${member.linkedin}</a>`;
    about.push(string);

    // Adding Work field
    string = "";
    string += SPACE.repeat(2);
    string += contribution;
    string += SPACE.repeat(17 - CONTRIBUTION.length);
    string += `<div ><a style="color: pink; white-space: break-spaces;">${member.contribution}</a></div>`;
    about.push(string);

    about.push("<br>");
  });

  return about;
};

export const ABOUT = createAbout();
