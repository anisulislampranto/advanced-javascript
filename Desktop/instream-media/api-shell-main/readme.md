### Read through this carefully before embedding the shell

# Directory Explanation
codeTemplates: Templates to copy and paste into new Project
controllers: General controllers
modules: Functionality split into multiple directories (Log, users, team, ...)
utils: utility Functions (Email, Keypair Generation, ...)


# Integration
## Project Folder structure
node_modules
modules (contains api-shell, and all other models)
emailTemplates (contains email templates in ejs format)
.env
package.json
app.js (See codeTemplates folder in api-shell)
server.js (See codeTemplates folder in api-shell)

1. Place the api-shell folder into the "modules" directory in your project
2. In the same Folder create a folder called "templateModels", put the Mongoose Schema Extensions there (userTemplateModel, teamTemplateModel, invitationTemplateModel, logTemplateModel)
3. in the modules folder, create a folder called "emailTemplates", and put your custom PUG Email templates there
4. in the main dir of the project (where package.json is located), generate public and private key using the utility function


### .gitignore:
node_modules
.env
*.pem

### Protect routes with this line of code
router.use(passport.authenticate('jwt', { session: false, failWithError: true }), authController.connectCurrentTeam, authController.restrict());