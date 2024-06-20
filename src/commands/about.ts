import command from '../../config.json' assert {type: 'json'};

const createAbout = () => {
  const about = [];
  const SPACE = "&nbsp;";

  const WORK = 'Work';
  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";
  
  about.push("<br>");
  about.push(command.aboutGreeting);
  about.push("<br>");

  command.social.forEach(member => {
    let work = `<i class='fa-solid fa-briefcase'></i> ${WORK}`;   
    let email = `<i class='fa-solid fa-envelope'></i> ${EMAIL}`;   
    let github = `<i class='fa-brands fa-github'></i> ${GITHUB}`;
    let linkedin = `<i class='fa-brands fa-linkedin'></i> ${LINKEDIN}`;
    let string = "";

    string += SPACE.repeat(2);
    string += email;
    string += SPACE.repeat(17 - EMAIL.length);
    string += `<a target='_blank' href='mailto:${member.email}'>${member.email}</a>`;
    about.push(string);

    string = '';
    string += SPACE.repeat(2);
    string += github;
    string += SPACE.repeat(17 - GITHUB.length);
    string += `<a target='_blank' href='https://github.com/${member.github}'>github/${member.github}</a>`;
    about.push(string);

    string = '';
    string += SPACE.repeat(2);
    string += linkedin;
    string += SPACE.repeat(17 - LINKEDIN.length);  
    string += `<a target='_blank' href='https://www.linkedin.com/in/${member.linkedin}'>linkedin/${member.linkedin}</a>`;
    about.push(string);

    // Adding Work field
    string = '';
    string += SPACE.repeat(2);
    string += work;
    string += SPACE.repeat(17 - WORK.length);  
    string += `${member.work}`;
    about.push(string);

    about.push("<br>");
  });

  return about;
}

export const ABOUT = createAbout();
