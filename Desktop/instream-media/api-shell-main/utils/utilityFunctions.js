module.exports.makeId = function (length) {
  if (typeof length !== "number") return "";
  const result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

module.exports.triggerAutomation = function (trigger, config) {};

module.exports.findBestEmail = function (emails, domain) {
  // Map To Lower Case
  emails = emails.map((el) => el && el?.toLowerCase?.());

  const keywords = ["info", "kontakt", "contact", "vertrieb", "sales"];
  const providers = [
    "gmail.com",
    "yahoo.de",
    "hotmail.de",
    "outlook.com",
    "aol.com",
    "mail.de",
    "web.de",
  ];

  if (!domain) return emails.filter((email) => email?.includes?.("@"))[0];

  // Filter only own domain or providers
  const filteredEmails = emails.filter((email) => {
    if (!email.includes("@")) return false;
    if (email.endsWith(domain)) return true;
    if (providers.includes(email.split("@")[1])) return true;
    return false;
  });

  // Go through keywords, find email and return if found
  for (const keyword of keywords) {
    const email = filteredEmails.find((email) => email.startsWith(keyword));
    if (email) return email;
  }

  // Return first email with domain in it
  for (const email of emails) {
    if (email.endsWith(domain)) return email;
  }

  // Look for common email providers
  for (const provider of providers) {
    const email = filteredEmails.find((email) => email.endsWith(provider));
    if (email) return email;
  }

  return null;
};

module.exports.getMatches = function (string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }
  return matches;
};

/**
 * -------------- HELPER FUNCTIONS ---------------
 */

module.exports.cookieExtractor = function (req) {
  let token = null;
  // Authorization via Bearer Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};
