// by Daan Hegger

module.exports = {

  style: {
    src: 'src/style/main.scss',
    build: 'build/',
    watch: 'src/**/*.scss'
  },

  scripts: {
    src: 'src/script/main.js',
    build: 'build',
    buildName: 'bundle.js',
    watch: 'src/script/**/*.js'
  },

  html: {
    src: 'src/**/*.{html,php}',
    build: 'build',
    watch: 'src/**/*.{html,php}'
  }

};
