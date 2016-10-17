# translate_app
translate app

## Getting Started

To get you started you can simply clone the translate-app repository and install the dependencies:

### Prerequisites

You need git to clone the translate-app repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test translate_app. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).
You will also have to install mongodb to manage your data.

### Clone translate-app

Clone the translate-app repository using [git][git]:

```
git clone https://github.com/Guerline/translate-app.git
cd translate-app
```

### Install Dependencies


* We get the tools we depend upon via `npm`, the [node package manager][npm]
Open your node command prompt and type : 
```
npm install
```

### Running the app
First, you will have to create the database.
Go to the bin directory inside the directory where MongoDB is installed. Run the mongo deamon mongod for our database.
Open a command prompt and type :

```
mongod --dbpath <direname>\translate_app\data\
```

Open another  command prompt in the sa,e directory and type :
```
mongo
```

In the mongo console that is now open, type : 
```
>use translate_db
```
```
>db.translated_texts.insert({text : "Hello", from_language:"en", to_language : "fr", translated_text:"Bonjour"})
```

Now you can start the app by going back to your node command prompt and running the app.js file.

```
node app.js
```

To use this app, open your favorite brozser and go to http://localhost:3000
