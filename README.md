# DBL-Webtech
Visualisation Project!

**DEMO:** [http://dbl2018vis.win.tue.nl:2000/~20171964/](http://dbl2018vis.win.tue.nl:2000/~20171964/)

## How to work on the project?
### Prerequisite
- `NodeJS`
- `npm`
- `gulp-cli`, install using `npm install -g gulp-cli`
- Text editor (Atom, Visual Code or Sublime text for example)
- Git Client (for example "gitkraken" or "sourcetree")

### How to?
1. Clone the repository to your local machine (use the git client)
2. Open your terminal/console/cmd in the project directory
3. Run the command `npm install`
4. Use one of the following commands:
  - **To build the project for production run:** `npm run build`
      - Build folder is: `./build`
  - **To run the project in develop mode run:** `npm run start`
     - This will also instantiate a php server using: `php -S localhost:8080 -t build/`
     - Make sure PHP is installed and available in your `PATH`
