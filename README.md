# TypeScript starter project to create scripts for Adobe applications (Photoshop, InDesign, After Effects...), that includes connection to a MySQL database, password hashing and verification (bcrypt) and the use of the Active Record design pattern.

This starter kit is preconfigured to facilitate fast development.

This kit is heavily influenced by the greate course
[PHP: Object-Oriented Programming with Databases](https://www.linkedin.com/learning/php-object-oriented-programming-with-databases)
taught by Kevin Skoglund. If you are learning about OOP, I highly recommend it
even if PHP is not your primary focus.

## It includes
    1. Node.js (Net) server to act as a bridge between the client socket (like
    Adobe InDesign, Adobe Brigde...) and the database server (MySQL).
    2. Easy password hashing and verification (bcrypt) through the same local
    server.
    3. An abstract class to be inherited by all the others that access
    the database. It is an application of the **active record** design pattern.
    4. Two example subclasses are provided.
    5. The code is heavly documented (JSDoc) and HTML generation is
    preconfigured.
    6. General and validation functions that can be easily reused in other
    projects.

## Dependencies
It depends on Node.js. The package.json file is included.

## Folder structure
```
Root
|- config
|- dist
|- docs
|- resources
|- src
|- .eslintrc.json
|- .gitignore
|- .prettierrc.json
|- jsdoc.json
|- LICENSE
|- package-lock.json
|- package.json
|- README.md
|- tsconfig.json
|- typescript-extendscript-mysql-boilerplate.code-workspace

```