# TypeScript starter project to create scripts for Adobe applications (Photoshop, InDesign, After Effects...), that includes connection to a MySQL database, password hashing and verification (bcrypt) and the use of the Active Record design pattern.

This starter kit is preconfigured to facilitate fast development.

> ### All the code is compiled to ExtendScript.

This kit is heavily influenced by the greate course
[PHP: Object-Oriented Programming with Databases](https://www.linkedin.com/learning/php-object-oriented-programming-with-databases)
taught by Kevin Skoglund. If you are learning about OOP, I highly recommend it
even if PHP is not your primary focus.

## Why is it better than a script in a single file?

## It includes
    1. Node.js (Net) server to act as a bridge between the client socket (like
    Adobe InDesign, Adobe Brigde...) and the database server (MySQL).
    2. Easy password hashing and verification (bcrypt) through the same local
    server.
    3. An abstract class to be inherited by all the others that access
    the database. It is an application of the __active record__ design pattern.
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
|- config       (database credentials, server and initialization)
|- dist         ((empty) for compiled code)
|- docs         ((empty) for generated HTML documentation)
|- resources    (.sql files)
|- src          (source code to be compiled)


```

## Suggested VSCODE extensions
[Task Explorer](https://marketplace.visualstudio.com/items?itemName=spmeesseman.vscode-taskexplorer)

[Document This](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis)